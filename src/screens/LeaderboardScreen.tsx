import React, { useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, FlatList, Image,
    TouchableOpacity, Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { Heart, ArrowLeft, Award, Star } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import {
    LEADERBOARD_DATA, FOOD_SUB_CATEGORIES, BEAUTY_SUB_CATEGORIES,
    getTopBySubCategory, GRADE_COLOR, LeaderboardEntry
} from '../data/leaderboardData';
import { toggleFavorite, getFavorites } from '../services/favorites';

type Props = NativeStackScreenProps<RootStackParamList, 'Leaderboard'>;

const BEAUTY_COLOR = '#E91E63';
const FOOD_COLOR = Colors.primary;

export default function LeaderboardScreen({ route, navigation }: Props) {
    const initialCategory = route.params?.category || 'food';
    const initialSub = route.params?.subCategory || 'All';

    const [activeCategory, setActiveCategory] = useState<'food' | 'beauty'>(initialCategory);
    const [activeSub, setActiveSub] = useState(initialSub);
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [favAnimMap, setFavAnimMap] = useState<Record<string, Animated.Value>>({});

    const themeColor = activeCategory === 'beauty' ? BEAUTY_COLOR : FOOD_COLOR;
    const subCategories = activeCategory === 'food' ? FOOD_SUB_CATEGORIES : BEAUTY_SUB_CATEGORIES;
    const items = getTopBySubCategory(activeCategory, activeSub);

    useEffect(() => {
        (async () => {
            const favs = await getFavorites();
            setFavorites(new Set(favs.map(f => f.barcode)));
        })();
    }, []);

    const handleToggleFav = useCallback(async (item: LeaderboardEntry) => {
        const anim = favAnimMap[item.barcode] || new Animated.Value(1);
        if (!favAnimMap[item.barcode]) {
            setFavAnimMap(prev => ({ ...prev, [item.barcode]: anim }));
        }
        Animated.sequence([
            Animated.spring(anim, { toValue: 1.4, useNativeDriver: true, speed: 30 }),
            Animated.spring(anim, { toValue: 1, useNativeDriver: true, speed: 30 }),
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
        setFavorites(prev => {
            const next = new Set(prev);
            nowFav ? next.add(item.barcode) : next.delete(item.barcode);
            return next;
        });
    }, [favAnimMap]);

    const renderItem = ({ item, index }: { item: LeaderboardEntry; index: number }) => {
        const isFav = favorites.has(item.barcode);
        const anim = favAnimMap[item.barcode] || new Animated.Value(1);
        const isTop3 = index < 3;
        const medalColors = ['#FFD700', '#C0C0C0', '#CD7F32'];

        return (
            <View style={[styles.row, isTop3 && { borderLeftWidth: 3, borderLeftColor: themeColor }]}>
                <View style={[styles.rankBox, isTop3 && { backgroundColor: medalColors[index] }]}>
                    {isTop3
                        ? <Award color="#fff" size={14} />
                        : <Text style={styles.rankNum}>{index + 1}</Text>
                    }
                </View>

                <Image source={{ uri: item.image_url }} style={styles.productImg} />

                <View style={styles.rowInfo}>
                    <Text style={styles.rowName} numberOfLines={1}>{item.name}</Text>
                    <Text style={styles.rowBrand}>{item.brand}</Text>
                    <Text style={styles.rowReason} numberOfLines={1}>{item.reason}</Text>

                    {/* Score bar */}
                    <View style={styles.scoreBarBg}>
                        <View style={[styles.scoreBarFill, { width: `${item.score}%` as any, backgroundColor: themeColor }]} />
                    </View>
                </View>

                <View style={styles.rowRight}>
                    <View style={[styles.gradeBadge, { backgroundColor: GRADE_COLOR[item.grade] || Colors.gradeC }]}>
                        <Text style={styles.gradeText}>{item.grade}</Text>
                    </View>
                    <Text style={[styles.scoreNum, { color: themeColor }]}>{item.score}</Text>

                    <TouchableOpacity onPress={() => handleToggleFav(item)} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
                        <Animated.View style={{ transform: [{ scale: anim }] }}>
                            <Heart
                                size={20}
                                color={isFav ? '#E91E63' : Colors.textMuted}
                                fill={isFav ? '#E91E63' : 'transparent'}
                            />
                        </Animated.View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.wrapper}>
            {/* Header */}
            <View style={[styles.header, { backgroundColor: themeColor }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <View style={{ flex: 1 }}>
                    <Text style={styles.headerTitle}>📊 Leaderboard</Text>
                    <Text style={styles.headerSub}>Best rated in India</Text>
                </View>
            </View>

            {/* Category Tabs */}
            <View style={styles.catTabs}>
                {(['food', 'beauty'] as const).map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.catTab, activeCategory === cat && { backgroundColor: (cat === 'beauty' ? BEAUTY_COLOR : FOOD_COLOR) }]}
                        onPress={() => { setActiveCategory(cat); setActiveSub('All'); }}
                    >
                        <Text style={[styles.catTabText, activeCategory === cat && { color: '#fff' }]}>
                            {cat === 'food' ? '🍎 Food' : '💄 Beauty'}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Sub-category pills */}
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                data={subCategories}
                keyExtractor={s => s}
                contentContainerStyle={styles.subPills}
                renderItem={({ item: sub }) => (
                    <TouchableOpacity
                        style={[styles.pill, activeSub === sub && { backgroundColor: themeColor }]}
                        onPress={() => setActiveSub(sub)}
                    >
                        <Text style={[styles.pillText, activeSub === sub && { color: '#fff' }]}>{sub}</Text>
                    </TouchableOpacity>
                )}
            />

            {/* Ranked list */}
            <FlatList
                data={items}
                keyExtractor={i => i.barcode}
                renderItem={renderItem}
                contentContainerStyle={{ padding: Spacing.md, paddingBottom: 100 }}
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Star color={Colors.textMuted} size={48} />
                        <Text style={styles.emptyText}>No products in this sub-category yet.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background },

    header: {
        paddingTop: 52, paddingBottom: 16,
        paddingHorizontal: Spacing.lg,
        flexDirection: 'row', alignItems: 'center',
        ...Shadow.md,
    },
    backBtn: { marginRight: 12, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    headerTitle: { fontSize: 20, fontWeight: '900', color: '#fff' },
    headerSub: { fontSize: 13, color: 'rgba(255,255,255,0.85)', marginTop: 2 },

    catTabs: {
        flexDirection: 'row',
        margin: Spacing.md,
        backgroundColor: '#fff',
        borderRadius: Radius.full,
        padding: 4,
        ...Shadow.sm,
    },
    catTab: {
        flex: 1, paddingVertical: 10, borderRadius: Radius.full,
        alignItems: 'center',
    },
    catTabText: { fontSize: 15, fontWeight: '800', color: Colors.textMuted },

    subPills: { paddingHorizontal: Spacing.md, paddingBottom: Spacing.sm, gap: 8 },
    pill: {
        paddingHorizontal: 14, paddingVertical: 7,
        borderRadius: Radius.full, backgroundColor: '#fff',
        borderWidth: 1, borderColor: Colors.border,
        ...Shadow.sm,
    },
    pillText: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary },

    row: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: '#fff', borderRadius: Radius.lg,
        padding: 12, marginBottom: 10,
        ...Shadow.sm,
    },
    rankBox: {
        width: 28, height: 28, borderRadius: 14,
        backgroundColor: Colors.pillBackground,
        alignItems: 'center', justifyContent: 'center',
        marginRight: 10,
    },
    rankNum: { fontSize: 12, fontWeight: '900', color: Colors.textMuted },

    productImg: {
        width: 52, height: 52, borderRadius: Radius.sm,
        backgroundColor: '#f5f5f5', resizeMode: 'contain',
        marginRight: 10,
    },

    rowInfo: { flex: 1, marginRight: 8 },
    rowName: { fontSize: 14, fontWeight: '800', color: Colors.textPrimary },
    rowBrand: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    rowReason: { fontSize: 11, color: Colors.textSecondary, marginTop: 2, fontStyle: 'italic' },
    scoreBarBg: {
        height: 4, backgroundColor: Colors.divider,
        borderRadius: 2, marginTop: 6, overflow: 'hidden',
    },
    scoreBarFill: { height: '100%', borderRadius: 2 },

    rowRight: { alignItems: 'center', gap: 6 },
    gradeBadge: {
        width: 30, height: 30, borderRadius: 15,
        alignItems: 'center', justifyContent: 'center',
    },
    gradeText: { color: '#fff', fontWeight: '900', fontSize: 15 },
    scoreNum: { fontSize: 13, fontWeight: '900' },

    empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
    emptyText: { fontSize: 15, color: Colors.textMuted, textAlign: 'center' },
});
