import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getStreak, getTotalPoints, getEarnedBadges, ALL_BADGES } from '../services/pointsService';
import { getHistoryCount } from '../services/history';
import { Colors, Spacing, Radius, Shadow } from '../theme';
import { Zap, Trophy, Flame, Star, ChevronRight } from 'lucide-react-native';

type Props = NativeStackScreenProps<RootStackParamList, 'Challenges'>;

type Challenge = {
    id: string;
    title: string;
    description: string;
    emoji: string;
    target: number;
    current: number;
    points: number;
};

export default function ChallengesScreen({ navigation }: Props) {
    const [streak, setStreak] = useState({ current: 0, best: 0 });
    const [points, setPoints] = useState(0);
    const [scanCount, setScanCount] = useState(0);
    const [badges, setBadges] = useState(ALL_BADGES);

    useEffect(() => {
        getStreak().then(setStreak);
        getTotalPoints().then(setPoints);
        getHistoryCount().then(setScanCount);
        getEarnedBadges().then(setBadges);
    }, []);

    const challenges: Challenge[] = [
        {
            id: 'week_scan',
            title: 'Label Ninja',
            description: 'Scan 1 product a day for 7 days',
            emoji: '🥷',
            target: 7,
            current: Math.min(streak.current, 7),
            points: 200,
        },
        {
            id: 'total_scans',
            title: 'Explorer',
            description: 'Scan 20 different products',
            emoji: '🗺️',
            target: 20,
            current: Math.min(scanCount, 20),
            points: 150,
        },
        {
            id: 'first_5',
            title: 'Getting Started',
            description: 'Scan your first 5 products',
            emoji: '🚀',
            target: 5,
            current: Math.min(scanCount, 5),
            points: 50,
        },
        {
            id: 'streak_3',
            title: '3-Day Streak',
            description: 'Build a 3-day scan streak',
            emoji: '🔥',
            target: 3,
            current: Math.min(streak.current, 3),
            points: 75,
        },
        {
            id: 'streak_14',
            title: '2-Week Champion',
            description: 'Maintain a 14-day scan streak',
            emoji: '🏆',
            target: 14,
            current: Math.min(streak.current, 14),
            points: 500,
        },
    ];

    const earnedBadges = badges.filter(b => b.earnedAt !== undefined);
    const lockedBadges = badges.filter(b => b.earnedAt === undefined);

    return (
        <ScrollView style={styles.wrapper} contentContainerStyle={{ paddingBottom: 60 }} showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Challenges & Badges</Text>
            </View>

            {/* Stats row */}
            <View style={styles.statsRow}>
                <View style={styles.statCard}>
                    <Flame color="#FF6B35" size={24} />
                    <Text style={styles.statValue}>{streak.current}</Text>
                    <Text style={styles.statLabel}>Day Streak</Text>
                </View>
                <View style={styles.statCard}>
                    <Zap color={Colors.primary} size={24} />
                    <Text style={styles.statValue}>{points}</Text>
                    <Text style={styles.statLabel}>Points</Text>
                </View>
                <View style={styles.statCard}>
                    <Trophy color="#FFC107" size={24} />
                    <Text style={styles.statValue}>{earnedBadges.length}</Text>
                    <Text style={styles.statLabel}>Badges</Text>
                </View>
                <View style={styles.statCard}>
                    <Star color={Colors.info} size={24} />
                    <Text style={styles.statValue}>{streak.best}</Text>
                    <Text style={styles.statLabel}>Best Streak</Text>
                </View>
            </View>

            {/* Challenges */}
            <Text style={styles.sectionTitle}>Active Challenges</Text>
            {challenges.map(c => {
                const pct = Math.min(c.current / c.target, 1);
                const done = pct >= 1;
                return (
                    <View key={c.id} style={[styles.challengeCard, done && styles.challengeDone]}>
                        <Text style={styles.challengeEmoji}>{c.emoji}</Text>
                        <View style={{ flex: 1 }}>
                            <View style={styles.challengeTitleRow}>
                                <Text style={styles.challengeTitle}>{c.title}</Text>
                                <Text style={styles.challengePoints}>+{c.points} pts</Text>
                            </View>
                            <Text style={styles.challengeDesc}>{c.description}</Text>
                            <View style={styles.progressBg}>
                                <View style={[styles.progressFill, { width: `${pct * 100}%` as any, backgroundColor: done ? Colors.success : Colors.primary }]} />
                            </View>
                            <Text style={styles.progressText}>{c.current}/{c.target} {done ? '✅ Complete!' : ''}</Text>
                        </View>
                    </View>
                );
            })}

            {/* Earned Badges */}
            {earnedBadges.length > 0 && (
                <>
                    <Text style={styles.sectionTitle}>Earned Badges 🏆</Text>
                    <View style={styles.badgesGrid}>
                        {earnedBadges.map(b => (
                            <View key={b.id} style={[styles.badgeCard, styles.badgeEarned]}>
                                <Text style={styles.badgeEmoji}>{b.emoji}</Text>
                                <Text style={styles.badgeName}>{b.name}</Text>
                            </View>
                        ))}
                    </View>
                </>
            )}

            {/* Locked badges */}
            <Text style={styles.sectionTitle}>Badges to Unlock</Text>
            <View style={styles.badgesGrid}>
                {lockedBadges.map(b => (
                    <View key={b.id} style={styles.badgeCard}>
                        <Text style={[styles.badgeEmoji, { opacity: 0.3 }]}>{b.emoji}</Text>
                        <Text style={[styles.badgeName, { color: Colors.textMuted }]}>{b.name}</Text>
                        <Text style={styles.badgeDesc}>{b.description}</Text>
                    </View>
                ))}
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background },
    header: { backgroundColor: Colors.primary, paddingTop: 50, paddingBottom: 20, paddingHorizontal: Spacing.lg },
    headerTitle: { fontSize: 24, fontWeight: '900', color: '#fff' },

    statsRow: { flexDirection: 'row', margin: Spacing.md, gap: 8 },
    statCard: { flex: 1, backgroundColor: '#fff', borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: 4, ...Shadow.sm },
    statValue: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
    statLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },

    sectionTitle: { fontSize: 17, fontWeight: '800', color: Colors.textPrimary, marginHorizontal: Spacing.md, marginBottom: 10, marginTop: 8 },

    challengeCard: { marginHorizontal: Spacing.md, marginBottom: 10, backgroundColor: '#fff', borderRadius: Radius.xl, padding: Spacing.md, flexDirection: 'row', gap: 14, alignItems: 'flex-start', ...Shadow.sm },
    challengeDone: { borderWidth: 1.5, borderColor: Colors.success + '60', backgroundColor: '#F0FFF4' },
    challengeEmoji: { fontSize: 32, marginTop: 4 },
    challengeTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    challengeTitle: { fontSize: 15, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
    challengePoints: { fontSize: 12, fontWeight: '700', color: Colors.primary },
    challengeDesc: { fontSize: 12, color: Colors.textMuted, marginTop: 2, marginBottom: 10 },
    progressBg: { height: 6, backgroundColor: Colors.divider, borderRadius: 3, overflow: 'hidden' },
    progressFill: { height: '100%', borderRadius: 3 },
    progressText: { fontSize: 11, color: Colors.textMuted, marginTop: 5 },

    badgesGrid: { flexDirection: 'row', flexWrap: 'wrap', margin: Spacing.md, gap: 10 },
    badgeCard: { width: '29%', backgroundColor: '#fff', borderRadius: Radius.lg, padding: Spacing.sm, alignItems: 'center', gap: 4, ...Shadow.sm, borderWidth: 1, borderColor: Colors.border },
    badgeEarned: { borderColor: Colors.primary + '60', backgroundColor: Colors.primaryLight },
    badgeEmoji: { fontSize: 32 },
    badgeName: { fontSize: 11, fontWeight: '800', color: Colors.textPrimary, textAlign: 'center' },
    badgeDesc: { fontSize: 9, color: Colors.textMuted, textAlign: 'center', lineHeight: 13 },
});
