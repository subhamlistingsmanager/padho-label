import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, FlatList, Image, Animated, ScrollView, Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import {
    Camera, Search, ChevronRight, Lightbulb, Heart, Award,
    Apple, Sparkles, ShoppingBag, Salad, Coffee, Leaf, Star
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import { getHistory } from '../services/history';
import { calculateNutriScore } from '../services/ratingEngine';
import { getTopBySubCategory, GRADE_COLOR, LeaderboardEntry } from '../data/leaderboardData';
import { getFavorites, toggleFavorite } from '../services/favorites';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const BEAUTY_COLOR = '#E91E63';

const HEALTH_TIPS = [
    'High sugar (>15g/100g) is linked to weight gain. Watch out for Grade D & E products.',
    'Fibre slows sugar absorption and keeps you full longer. Look for >6g/100g.',
    'Ultra-processed foods (NOVA 4) have many additives. Prefer NOVA 1 & 2.',
    'Saturated fat raises LDL cholesterol. Keep below 5g/100g for heart health.',
    'Scan the barcode before you buy — labels can be misleading.',
    'A Nutri-Score of A or B still requires mindful portion control.',
];

const FOOD_PREVIEW_CATS = ['Snacks', 'Beverages', 'Dairy', 'Breakfast'];
const BEAUTY_PREVIEW_CATS = ['Skincare', 'Haircare', 'Body Care', 'Oral Care'];

const FOOD_CAT_ICONS: Record<string, any> = {
    Snacks: ShoppingBag,
    Beverages: Coffee,
    Dairy: Leaf,
    Breakfast: Salad,
};
const BEAUTY_CAT_ICONS: Record<string, any> = {
    Skincare: Sparkles,
    Haircare: Star,
    'Body Care': Leaf,
    'Oral Care': Star,
};

export default function HomeScanScreen({ navigation }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [recentScans, setRecentScans] = useState<Product[]>([]);
    const [tipIndex] = useState(() => Math.floor(Math.random() * HEALTH_TIPS.length));
    const [topFood, setTopFood] = useState<LeaderboardEntry[]>([]);
    const [topBeauty, setTopBeauty] = useState<LeaderboardEntry[]>([]);
    const [favBarcodes, setFavBarcodes] = useState<Set<string>>(new Set());
    const [favAnims] = useState<Record<string, Animated.Value>>({});

    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    useEffect(() => {
        loadData();
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 500, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
        ]).start();
    }, []);

    const loadData = async () => {
        const history = await getHistory();
        setRecentScans(history.slice(0, 3));
        setTopFood(getTopBySubCategory('food', 'All', 3));
        setTopBeauty(getTopBySubCategory('beauty', 'All', 3));
        const favs = await getFavorites();
        setFavBarcodes(new Set(favs.map(f => f.barcode)));
    };

    const handleToggleFav = useCallback(async (item: LeaderboardEntry) => {
        if (!favAnims[item.barcode]) {
            favAnims[item.barcode] = new Animated.Value(1);
        }
        const anim = favAnims[item.barcode];
        Animated.sequence([
            Animated.spring(anim, { toValue: 1.4, useNativeDriver: true, speed: 40 }),
            Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 40 }),
        ]).start();

        const nowFav = await toggleFavorite({
            barcode: item.barcode,
            name: item.name,
            brand: item.brand,
            image_url: item.image_url,
            grade: item.grade,
            score: item.score,
            category: item.category,
            subCategory: item.subCategory,
            savedAt: Date.now(),
        });
        setFavBarcodes(prev => {
            const next = new Set(prev);
            nowFav ? next.add(item.barcode) : next.delete(item.barcode);
            return next;
        });
    }, [favAnims]);

    const renderLeaderRow = (item: LeaderboardEntry, idx: number, color: string) => {
        const isFav = favBarcodes.has(item.barcode);
        if (!favAnims[item.barcode]) {
            favAnims[item.barcode] = new Animated.Value(1);
        }
        const anim = favAnims[item.barcode];
        const medals = ['🥇', '🥈', '🥉'];

        return (
            <View key={item.barcode} style={styles.leaderRow}>
                <Text style={styles.medalEmoji}>{medals[idx] || `${idx + 1}`}</Text>
                <Image source={{ uri: item.image_url }} style={styles.leaderImg} />
                <View style={styles.leaderInfo}>
                    <Text style={styles.leaderName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.leaderBrand}>{item.brand}</Text>
                    {/* mini score bar */}
                    <View style={styles.miniBarBg}>
                        <View style={[styles.miniBarFill, { width: `${item.score}%` as any, backgroundColor: color }]} />
                    </View>
                </View>
                <View style={[styles.gradeDot, { backgroundColor: GRADE_COLOR[item.grade] || Colors.gradeC }]}>
                    <Text style={styles.gradeDotText}>{item.grade}</Text>
                </View>
                <TouchableOpacity onPress={() => handleToggleFav(item)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                    <Animated.View style={{ transform: [{ scale: anim }] }}>
                        <Heart size={18} color={isFav ? '#E91E63' : Colors.textMuted} fill={isFav ? '#E91E63' : 'transparent'} />
                    </Animated.View>
                </TouchableOpacity>
            </View>
        );
    };

    const renderCategorySection = (
        label: string,
        emoji: string,
        color: string,
        cats: string[],
        icons: Record<string, any>,
        catType: 'food' | 'beauty',
        topItems: LeaderboardEntry[]
    ) => (
        <View style={[styles.catSection, { borderTopColor: color }]}>
            {/* Category header */}
            <View style={styles.catHeader}>
                <View style={[styles.catIconCircle, { backgroundColor: color + '20' }]}>
                    <Text style={{ fontSize: 22 }}>{emoji}</Text>
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.catLabel}>{label}</Text>
                    <Text style={styles.catSub}>{cats.length - 1} sub-categories</Text>
                </View>
                <TouchableOpacity
                    style={[styles.exploreBtn, { backgroundColor: color }]}
                    onPress={() => navigation.navigate('Leaderboard', { category: catType })}
                >
                    <Text style={styles.exploreBtnText}>Explore</Text>
                    <ChevronRight color="#fff" size={14} />
                </TouchableOpacity>
            </View>

            {/* Sub-category pills */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.subPillsRow}>
                {cats.slice(1).map(sub => {
                    const Icon = icons[sub] || Star;
                    return (
                        <TouchableOpacity
                            key={sub}
                            style={[styles.subPill, { borderColor: color + '40' }]}
                            onPress={() => navigation.navigate('Leaderboard', { category: catType, subCategory: sub })}
                        >
                            <Icon color={color} size={13} />
                            <Text style={[styles.subPillText, { color }]}>{sub}</Text>
                        </TouchableOpacity>
                    );
                })}
            </ScrollView>

            {/* Top 3 mini leaderboard */}
            <View style={styles.miniLeaderboard}>
                <View style={styles.miniLeaderHeader}>
                    <Award color={color} size={14} />
                    <Text style={[styles.miniLeaderTitle, { color }]}>Top Rated</Text>
                </View>
                {topItems.map((item, idx) => renderLeaderRow(item, idx, color))}
                <TouchableOpacity
                    style={[styles.viewAllBtn, { borderColor: color }]}
                    onPress={() => navigation.navigate('Leaderboard', { category: catType })}
                >
                    <Text style={[styles.viewAllText, { color }]}>View Full {label} Leaderboard</Text>
                    <ChevronRight color={color} size={14} />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <FlatList
            style={styles.container}
            data={recentScans}
            keyExtractor={item => item.barcode}
            contentContainerStyle={{ paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={() => (
                <>
                    {/* ── Hero ── */}
                    <View style={styles.hero}>
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                            <Text style={styles.heroGreeting}>Good day! 🌟</Text>
                            <Text style={styles.heroTitle}>Know What You Use</Text>
                            <Text style={styles.heroTagline}>Scan any product for an instant health & safety report.</Text>
                        </Animated.View>

                        {/* Scan CTA */}
                        <Animated.View style={[styles.scanHeroCTA, { opacity: fadeAnim }]}>
                            <TouchableOpacity
                                style={styles.scanHeroBtn}
                                onPress={() => navigation.navigate('Scan')}
                                activeOpacity={0.85}
                            >
                                <Camera color="#fff" size={26} />
                                <Text style={styles.scanHeroBtnText}>Scan a Product</Text>
                            </TouchableOpacity>
                        </Animated.View>
                    </View>

                    {/* ── Search Bar ── */}
                    <View style={styles.searchRow}>
                        <View style={styles.searchBox}>
                            <Search color={Colors.textMuted} size={18} />
                            <TextInput
                                style={styles.searchInput}
                                placeholder="Search products…"
                                placeholderTextColor={Colors.textMuted}
                                value={searchQuery}
                                onChangeText={setSearchQuery}
                                onSubmitEditing={() => navigation.navigate('Scan')}
                                returnKeyType="search"
                            />
                        </View>
                    </View>

                    {/* ── Daily Tip ── */}
                    <View style={styles.tipCard}>
                        <Lightbulb color={Colors.primary} size={16} />
                        <Text style={styles.tipText}>{HEALTH_TIPS[tipIndex]}</Text>
                    </View>

                    {/* ── Food Category Section ── */}
                    {renderCategorySection(
                        'Food & Beverages', '🍎', Colors.primary,
                        ['All', ...['Beverages', 'Snacks', 'Dairy', 'Breakfast', 'Condiments', 'Noodles']],
                        FOOD_CAT_ICONS, 'food', topFood
                    )}

                    {/* ── Beauty Category Section ── */}
                    {renderCategorySection(
                        'Beauty & Personal Care', '💄', BEAUTY_COLOR,
                        ['All', ...['Skincare', 'Haircare', 'Body Care', 'Oral Care']],
                        BEAUTY_CAT_ICONS, 'beauty', topBeauty
                    )}

                    {/* ── Recent Scans header ── */}
                    {recentScans.length > 0 && (
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Your Recent Scans</Text>
                            <TouchableOpacity onPress={() => navigation.navigate('History')}>
                                <Text style={styles.seeAll}>View All</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </>
            )}
            renderItem={({ item }) => {
                const rating = calculateNutriScore(item.nutrition);
                return (
                    <TouchableOpacity
                        style={styles.recentItem}
                        onPress={() => navigation.navigate('Result', { product: item })}
                        activeOpacity={0.8}
                    >
                        {item.image_url ? (
                            <Image source={{ uri: item.image_url }} style={styles.recentImg} />
                        ) : (
                            <View style={[styles.recentImg, styles.recentImgPlaceholder]}>
                                <Camera color={Colors.textMuted} size={18} />
                            </View>
                        )}
                        <View style={styles.recentInfo}>
                            <Text style={styles.recentName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.recentBrand}>{item.brand || 'Unknown brand'}</Text>
                        </View>
                        <View style={[styles.gradeDot, { backgroundColor: rating.color }]}>
                            <Text style={styles.gradeDotText}>{rating.grade || '?'}</Text>
                        </View>
                    </TouchableOpacity>
                );
            }}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    // Hero
    hero: {
        backgroundColor: Colors.primary,
        paddingTop: 60,
        paddingBottom: 36,
        paddingHorizontal: Spacing.lg,
    },
    heroGreeting: { fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: '600', marginBottom: 4 },
    heroTitle: { fontSize: 28, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
    heroTagline: { fontSize: 14, color: 'rgba(255,255,255,0.85)', marginTop: 6, lineHeight: 20 },
    scanHeroCTA: { marginTop: 20 },
    scanHeroBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10,
        backgroundColor: 'rgba(255,255,255,0.2)',
        borderRadius: Radius.full, paddingVertical: 14, paddingHorizontal: 28,
        borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.5)',
    },
    scanHeroBtnText: { color: '#fff', fontSize: 17, fontWeight: '800' },

    // Search
    searchRow: {
        marginHorizontal: Spacing.md,
        marginTop: -22,
        marginBottom: Spacing.md,
    },
    searchBox: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: Radius.full,
        paddingHorizontal: Spacing.md, height: 52,
        ...Shadow.md,
        gap: 10,
    },
    searchInput: { flex: 1, fontSize: 15, color: Colors.textPrimary },

    // Tip
    tipCard: {
        flexDirection: 'row', alignItems: 'flex-start', gap: 10,
        backgroundColor: '#fff',
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.md,
        borderRadius: Radius.lg,
        padding: Spacing.md,
        borderLeftWidth: 3, borderLeftColor: Colors.primary,
        ...Shadow.sm,
    },
    tipText: { flex: 1, fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

    // Category sections
    catSection: {
        backgroundColor: '#fff',
        marginHorizontal: Spacing.md,
        marginBottom: Spacing.md,
        borderRadius: Radius.xl,
        overflow: 'hidden',
        borderTopWidth: 3,
        ...Shadow.md,
    },
    catHeader: {
        flexDirection: 'row', alignItems: 'center',
        padding: Spacing.md, gap: 12,
    },
    catIconCircle: {
        width: 48, height: 48, borderRadius: 24,
        alignItems: 'center', justifyContent: 'center',
    },
    catLabel: { fontSize: 17, fontWeight: '900', color: Colors.textPrimary },
    catSub: { fontSize: 12, color: Colors.textMuted, marginTop: 2 },
    exploreBtn: {
        flexDirection: 'row', alignItems: 'center', gap: 4,
        paddingHorizontal: 14, paddingVertical: 8,
        borderRadius: Radius.full,
    },
    exploreBtnText: { color: '#fff', fontSize: 13, fontWeight: '800' },

    // Sub-category pills inside section
    subPillsRow: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        gap: 8,
    },
    subPill: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        paddingHorizontal: 12, paddingVertical: 6,
        borderRadius: Radius.full, borderWidth: 1,
        backgroundColor: Colors.background,
    },
    subPillText: { fontSize: 12, fontWeight: '700' },

    // Mini leaderboard inside section
    miniLeaderboard: {
        paddingHorizontal: Spacing.md,
        paddingBottom: Spacing.md,
        borderTopWidth: 1, borderTopColor: Colors.divider,
        paddingTop: Spacing.md,
    },
    miniLeaderHeader: {
        flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10,
    },
    miniLeaderTitle: { fontSize: 13, fontWeight: '800', letterSpacing: 0.5 },
    leaderRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1, borderBottomColor: Colors.divider,
        gap: 10,
    },
    medalEmoji: { fontSize: 18, width: 28, textAlign: 'center' },
    leaderImg: {
        width: 44, height: 44, borderRadius: 8,
        backgroundColor: '#f5f5f5', resizeMode: 'contain',
    },
    leaderInfo: { flex: 1 },
    leaderName: { fontSize: 13, fontWeight: '800', color: Colors.textPrimary },
    leaderBrand: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    miniBarBg: { height: 3, backgroundColor: Colors.divider, borderRadius: 2, marginTop: 5 },
    miniBarFill: { height: '100%', borderRadius: 2 },
    gradeDot: {
        width: 26, height: 26, borderRadius: 13,
        alignItems: 'center', justifyContent: 'center',
    },
    gradeDotText: { color: '#fff', fontWeight: '900', fontSize: 12 },

    viewAllBtn: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        marginTop: 14, paddingVertical: 10, borderRadius: Radius.full,
        borderWidth: 1.5, gap: 6,
    },
    viewAllText: { fontSize: 13, fontWeight: '800' },

    // Section headers
    sectionHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: Spacing.lg,
        marginTop: Spacing.sm, marginBottom: Spacing.sm,
    },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary },
    seeAll: { fontSize: 14, color: Colors.primary, fontWeight: '700' },

    // Recent scans
    recentItem: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', marginHorizontal: Spacing.md,
        borderRadius: Radius.md, padding: Spacing.md,
        marginBottom: Spacing.sm, gap: 12,
        ...Shadow.sm,
    },
    recentImg: {
        width: 48, height: 48, borderRadius: Radius.sm,
        backgroundColor: '#f9f9f9', resizeMode: 'contain',
    },
    recentImgPlaceholder: { alignItems: 'center', justifyContent: 'center', backgroundColor: '#f0f0f0' },
    recentInfo: { flex: 1 },
    recentName: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary },
    recentBrand: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});
