/**
 * pointsService.ts
 *
 * Points ledger, streak tracking, and badge management — all AsyncStorage.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import { PointEvent, PointReason, BadgeId, Badge } from '../types';

const POINTS_KEY = '@padho_points_ledger';
const STREAK_KEY = '@padho_scan_streak';
const BADGES_KEY = '@padho_badges';
const LAST_SCAN_DATE_KEY = '@padho_last_scan_date';

// ─── Badge definitions ────────────────────────────────────────────────────────

export const ALL_BADGES: Badge[] = [
    {
        id: 'first_scan',
        name: 'First Scan',
        description: 'Scanned your very first product',
        emoji: '🔍',
    },
    {
        id: 'label_ninja',
        name: 'Label Ninja',
        description: 'Scanned a product every day for 7 days',
        emoji: '🥷',
    },
    {
        id: 'sugar_smart',
        name: 'Sugar Smart',
        description: 'Avoided high-sugar products for a week',
        emoji: '🍃',
    },
    {
        id: 'pantry_champion',
        name: 'Pantry Champion',
        description: 'Added 5 products to your pantry',
        emoji: '🏆',
    },
    {
        id: 'explorer',
        name: 'Explorer',
        description: 'Scanned products in 3 different categories',
        emoji: '🗺️',
    },
    {
        id: 'clean_beauty_pioneer',
        name: 'Clean Beauty Pioneer',
        description: 'Scanned your first beauty product',
        emoji: '✨',
    },
    {
        id: 'hydration_hero',
        name: 'Hydration Hero',
        description: 'Scanned a drink with no added sugar',
        emoji: '💧',
    },
];

// ─── Points ───────────────────────────────────────────────────────────────────

export const POINT_VALUES: Record<PointReason, number> = {
    first_scan: 20,
    scan: 5,
    contribution: 50,
    streak: 100,
    challenge: 200,
    review: 15,
    referral: 100,
};

export const getLedger = async (): Promise<PointEvent[]> => {
    try {
        const json = await AsyncStorage.getItem(POINTS_KEY);
        return json ? JSON.parse(json) : [];
    } catch {
        return [];
    }
};

export const getTotalPoints = async (): Promise<number> => {
    const ledger = await getLedger();
    return ledger.reduce((sum, e) => sum + e.delta, 0);
};

export const addPoints = async (reason: PointReason, refId?: string): Promise<number> => {
    const ledger = await getLedger();
    const delta = POINT_VALUES[reason];
    const event: PointEvent = {
        id: `${reason}_${Date.now()}`,
        delta,
        reason,
        refId,
        timestamp: Date.now(),
    };
    const updated = [event, ...ledger];
    await AsyncStorage.setItem(POINTS_KEY, JSON.stringify(updated));
    return await getTotalPoints();
};

// ─── Streak ───────────────────────────────────────────────────────────────────

type StreakData = {
    current: number;
    best: number;
};

const todayDateStr = () => new Date().toISOString().slice(0, 10);

export const getStreak = async (): Promise<StreakData> => {
    try {
        const json = await AsyncStorage.getItem(STREAK_KEY);
        return json ? JSON.parse(json) : { current: 0, best: 0 };
    } catch {
        return { current: 0, best: 0 };
    }
};

/**
 * Call on every product scan. Returns updated streak.
 */
export const recordScanForStreak = async (): Promise<StreakData> => {
    const today = todayDateStr();
    const lastScanDate = await AsyncStorage.getItem(LAST_SCAN_DATE_KEY);
    const streak = await getStreak();

    if (lastScanDate === today) {
        // Already scanned today — no change
        return streak;
    }

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    let newCurrent: number;
    if (lastScanDate === yesterdayStr) {
        // Consecutive day
        newCurrent = streak.current + 1;
    } else {
        // Streak broken
        newCurrent = 1;
    }

    const updated: StreakData = {
        current: newCurrent,
        best: Math.max(streak.best, newCurrent),
    };

    await AsyncStorage.setItem(STREAK_KEY, JSON.stringify(updated));
    await AsyncStorage.setItem(LAST_SCAN_DATE_KEY, today);

    // Award points at 7-day streak
    if (newCurrent === 7) {
        await addPoints('streak', 'streak_7_day');
    }

    return updated;
};

// ─── Badges ───────────────────────────────────────────────────────────────────

export const getEarnedBadges = async (): Promise<Badge[]> => {
    try {
        const json = await AsyncStorage.getItem(BADGES_KEY);
        const earnedIds: { id: BadgeId; earnedAt: number }[] = json ? JSON.parse(json) : [];
        return ALL_BADGES.map(badge => {
            const earned = earnedIds.find(e => e.id === badge.id);
            return earned ? { ...badge, earnedAt: earned.earnedAt } : badge;
        });
    } catch {
        return ALL_BADGES;
    }
};

export const awardBadge = async (id: BadgeId): Promise<void> => {
    try {
        const json = await AsyncStorage.getItem(BADGES_KEY);
        const earned: { id: BadgeId; earnedAt: number }[] = json ? JSON.parse(json) : [];
        if (earned.some(e => e.id === id)) return; // Already earned
        earned.push({ id, earnedAt: Date.now() });
        await AsyncStorage.setItem(BADGES_KEY, JSON.stringify(earned));
    } catch {
        // silent
    }
};

export const hasBadge = async (id: BadgeId): Promise<boolean> => {
    const json = await AsyncStorage.getItem(BADGES_KEY);
    if (!json) return false;
    const earned: { id: BadgeId }[] = JSON.parse(json);
    return earned.some(e => e.id === id);
};
