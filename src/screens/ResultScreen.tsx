import React, { useMemo } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image,
    TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { calculateNutriScore } from '../services/ratingEngine';
import { deriveFlags } from '../services/flagDerivation';
import {
    AlertTriangle, CheckCircle, Camera, ScanLine,
    HelpCircle, ChevronRight,
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const GRADES: Array<{ grade: 'A' | 'B' | 'C' | 'D' | 'E'; color: string }> = [
    { grade: 'A', color: Colors.gradeA },
    { grade: 'B', color: Colors.gradeB },
    { grade: 'C', color: Colors.gradeC },
    { grade: 'D', color: Colors.gradeD },
    { grade: 'E', color: Colors.gradeE },
];

const NOVA_LABELS: Record<number, { label: string; desc: string; color: string }> = {
    1: { label: 'NOVA 1', desc: 'Unprocessed / minimally processed', color: Colors.gradeA },
    2: { label: 'NOVA 2', desc: 'Processed culinary ingredients', color: Colors.gradeB },
    3: { label: 'NOVA 3', desc: 'Processed food', color: Colors.gradeC },
    4: { label: 'NOVA 4', desc: 'Ultra-processed', color: Colors.gradeE },
};

export default function ResultScreen({ route, navigation }: Props) {
    const { product } = route.params;

    const rating = useMemo(() => calculateNutriScore(product.nutrition), [product]);
    const flags = useMemo(() => deriveFlags(product.nutrition, product.nova_group), [product]);

    const redFlags = flags.filter(f => f.type === 'red');
    const greenFlags = flags.filter(f => f.type === 'green');
    const novaInfo = product.nova_group ? NOVA_LABELS[product.nova_group] : null;

    return (
        <View style={styles.wrapper}>
            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 110 }}>

                {/* ── Product Header ── */}
                <View style={styles.header}>
                    {product.image_url ? (
                        <Image source={{ uri: product.image_url }} style={styles.productImage} />
                    ) : (
                        <View style={[styles.productImage, styles.imagePlaceholder]}>
                            <Camera color={Colors.textMuted} size={28} />
                        </View>
                    )}
                    <View style={styles.headerText}>
                        <Text style={styles.productName}>{product.name}</Text>
                        {product.brand ? <Text style={styles.brand}>{product.brand}</Text> : null}
                        {product.barcode ? <Text style={styles.barcode}>#{product.barcode}</Text> : null}
                    </View>
                </View>

                {/* ── Nutri-Score ── */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>NUTRI-SCORE</Text>

                    {rating.hasData ? (
                        <>
                            <View style={styles.gradeBar}>
                                {GRADES.map(({ grade, color }) => (
                                    <View
                                        key={grade}
                                        style={[
                                            styles.gradeCell,
                                            { backgroundColor: color },
                                            rating.grade === grade && styles.gradeCellActive,
                                        ]}
                                    >
                                        <Text style={[
                                            styles.gradeCellText,
                                            rating.grade === grade && styles.gradeCellTextActive,
                                        ]}>
                                            {grade}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                            <Text style={styles.scoreDetail}>Score: {rating.score}</Text>
                        </>
                    ) : (
                        <View style={styles.noDataBox}>
                            <HelpCircle color={Colors.textMuted} size={28} />
                            <Text style={styles.noDataTitle}>No nutrition data in database</Text>
                            <Text style={styles.noDataSub}>
                                This product hasn't been fully catalogued on Open Food Facts.
                                Snap the ingredients label below to keep a record.
                            </Text>
                        </View>
                    )}

                    {/* NOVA Group */}
                    {novaInfo && (
                        <View style={[styles.novaBadge, { borderColor: novaInfo.color }]}>
                            <Text style={[styles.novaLabel, { color: novaInfo.color }]}>{novaInfo.label}</Text>
                            <Text style={[styles.novaDesc, { color: novaInfo.color }]}>{novaInfo.desc}</Text>
                        </View>
                    )}
                </View>

                {/* ── Flags ── */}
                {redFlags.length > 0 && (
                    <View style={styles.card}>
                        <Text style={[styles.sectionTitle, { color: Colors.gradeE }]}>⚠ Watch Out</Text>
                        {redFlags.map((flag, i) => (
                            <View key={i} style={[styles.flagItem, styles.flagItemRed]}>
                                <AlertTriangle color={Colors.gradeE} size={18} />
                                <View style={styles.flagText}>
                                    <Text style={styles.flagTitle}>{flag.title}</Text>
                                    <Text style={styles.flagDesc}>{flag.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                {greenFlags.length > 0 && (
                    <View style={styles.card}>
                        <Text style={[styles.sectionTitle, { color: Colors.gradeA }]}>✓ Good Points</Text>
                        {greenFlags.map((flag, i) => (
                            <View key={i} style={[styles.flagItem, styles.flagItemGreen]}>
                                <CheckCircle color={Colors.gradeA} size={18} />
                                <View style={styles.flagText}>
                                    <Text style={styles.flagTitle}>{flag.title}</Text>
                                    <Text style={styles.flagDesc}>{flag.description}</Text>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Nutrition Table ── */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Nutrition per 100g</Text>
                    {!rating.hasData && (
                        <View style={styles.missingDataBanner}>
                            <AlertTriangle color={Colors.warning} size={14} />
                            <Text style={styles.missingDataText}>
                                Values unavailable — snap the label below
                            </Text>
                        </View>
                    )}
                    <View style={styles.table}>
                        <NutritionRow label="Energy" value={product.nutrition.energy_100g} unit="kJ" level="neutral" />
                        <NutritionRow label="Carbs" value={product.nutrition.carbohydrates_100g} unit="g" level="neutral" />
                        <NutritionRow label="Sugar" value={product.nutrition.sugars_100g} unit="g" level={lvl('sugar', product.nutrition.sugars_100g)} />
                        <NutritionRow label="Fat" value={product.nutrition.fat_100g} unit="g" level="neutral" />
                        <NutritionRow label="Sat. Fat" value={product.nutrition.saturated_fat_100g} unit="g" level={lvl('satfat', product.nutrition.saturated_fat_100g)} />
                        <NutritionRow label="Fiber" value={product.nutrition.fiber_100g} unit="g" level={lvl('fiber', product.nutrition.fiber_100g)} />
                        <NutritionRow label="Protein" value={product.nutrition.proteins_100g} unit="g" level={lvl('protein', product.nutrition.proteins_100g)} />
                        <NutritionRow label="Salt" value={product.nutrition.salt_100g} unit="g" level={lvl('salt', product.nutrition.salt_100g)} />
                        {product.nutrition.cholesterol_mg_100g != null && (
                            <NutritionRow label="Cholesterol" value={product.nutrition.cholesterol_mg_100g} unit="mg" level="neutral" isLast />
                        )}
                    </View>
                </View>

                {/* ── Ingredients Text ── */}
                {product.ingredients ? (
                    <View style={styles.card}>
                        <Text style={styles.sectionTitle}>Ingredients</Text>
                        <Text style={styles.ingredientsText}>{product.ingredients}</Text>
                    </View>
                ) : null}

                {/* ── Ingredients Photo ── */}
                <View style={styles.card}>
                    <Text style={styles.sectionTitle}>Ingredients Label Photo</Text>
                    {product.ingredientsImageUri ? (
                        <>
                            <Image
                                source={{ uri: product.ingredientsImageUri }}
                                style={styles.ingredientsPhoto}
                                resizeMode="contain"
                            />
                            <TouchableOpacity
                                style={styles.reshootButton}
                                onPress={() => navigation.navigate('IngredientsSnap', { product })}
                            >
                                <Camera color={Colors.primary} size={16} />
                                <Text style={styles.reshootText}>Re-shoot</Text>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <TouchableOpacity
                            style={styles.snapButton}
                            onPress={() => navigation.navigate('IngredientsSnap', { product })}
                            activeOpacity={0.85}
                        >
                            <Camera color={Colors.primary} size={22} />
                            <View style={{ flex: 1, marginLeft: Spacing.md }}>
                                <Text style={styles.snapButtonTitle}>Snap Ingredients Label</Text>
                                <Text style={styles.snapButtonSub}>Photograph the back of the pack</Text>
                            </View>
                            <ChevronRight color={Colors.textMuted} size={18} />
                        </TouchableOpacity>
                    )}
                </View>

            </ScrollView>

            {/* ── Scan Again FAB ── */}
            <TouchableOpacity
                style={styles.fab}
                onPress={() => navigation.navigate('Scan')}
                activeOpacity={0.85}
            >
                <ScanLine color="#fff" size={22} />
                <Text style={styles.fabText}>Scan Again</Text>
            </TouchableOpacity>
        </View>
    );
}

// ─── Helpers ────────────────────────────────────────────────────────────────

type Level = 'good' | 'bad' | 'neutral';
const LEVEL_COLORS: Record<Level, string> = {
    good: Colors.gradeB,
    bad: Colors.gradeD,
    neutral: Colors.textMuted,
};

function lvl(type: string, val?: number): Level {
    if (val == null) return 'neutral';
    switch (type) {
        case 'sugar': return val > 15 ? 'bad' : val < 5 ? 'good' : 'neutral';
        case 'satfat': return val > 5 ? 'bad' : 'neutral';
        case 'salt': return val > 1.5 ? 'bad' : 'neutral';
        case 'fiber': return val > 6 ? 'good' : val > 3 ? 'neutral' : 'neutral';
        case 'protein': return val > 10 ? 'good' : 'neutral';
        default: return 'neutral';
    }
}

const NutritionRow = ({
    label, value, unit, level, isLast = false,
}: {
    label: string; value?: number; unit: string; level: Level; isLast?: boolean;
}) => (
    <View style={[styles.tableRow, isLast && { borderBottomWidth: 0 }]}>
        <View style={[styles.levelDot, { backgroundColor: LEVEL_COLORS[level] }]} />
        <Text style={styles.tableLabel}>{label}</Text>
        <Text style={[styles.tableValue, { color: LEVEL_COLORS[level] }]}>
            {value != null ? `${value} ${unit}` : `— ${unit}`}
        </Text>
    </View>
);

// ─── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background },
    container: { flex: 1 },

    header: {
        flexDirection: 'row',
        padding: Spacing.lg,
        backgroundColor: Colors.card,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    productImage: {
        width: 80, height: 80, borderRadius: Radius.md,
        backgroundColor: Colors.border, marginRight: Spacing.md,
    },
    imagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
    headerText: { flex: 1 },
    productName: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary, lineHeight: 24 },
    brand: { fontSize: 14, color: Colors.textSecondary, marginTop: 4 },
    barcode: { fontSize: 11, color: Colors.textMuted, marginTop: 4 },

    card: {
        backgroundColor: Colors.card,
        margin: Spacing.md,
        marginBottom: 0,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        ...Shadow.sm,
    },
    cardLabel: { ...Typography.label, marginBottom: Spacing.md },

    gradeBar: {
        flexDirection: 'row', borderRadius: Radius.full,
        overflow: 'hidden', width: '100%', height: 52,
    },
    gradeCell: {
        flex: 1, alignItems: 'center', justifyContent: 'center', opacity: 0.35,
    },
    gradeCellActive: { opacity: 1, transform: [{ scaleY: 1.12 }] },
    gradeCellText: { fontSize: 18, fontWeight: '900', color: '#fff' },
    gradeCellTextActive: { fontSize: 22 },
    scoreDetail: { ...Typography.caption, marginTop: Spacing.sm, textAlign: 'center' },

    noDataBox: {
        alignItems: 'center', padding: Spacing.lg,
        backgroundColor: Colors.background, borderRadius: Radius.md,
    },
    noDataTitle: {
        fontSize: 15, fontWeight: '600', color: Colors.textSecondary,
        marginTop: Spacing.sm, textAlign: 'center',
    },
    noDataSub: {
        fontSize: 13, color: Colors.textMuted, marginTop: Spacing.xs,
        textAlign: 'center', lineHeight: 18,
    },

    novaBadge: {
        flexDirection: 'row', alignItems: 'center',
        marginTop: Spacing.md, paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs, borderRadius: Radius.full,
        borderWidth: 1.5, gap: Spacing.sm, alignSelf: 'center',
    },
    novaLabel: { fontWeight: '800', fontSize: 13 },
    novaDesc: { fontSize: 12 },

    sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
    missingDataBanner: {
        flexDirection: 'row', alignItems: 'center', gap: Spacing.sm,
        backgroundColor: '#fffbeb', borderRadius: Radius.sm,
        padding: Spacing.sm, marginBottom: Spacing.md,
    },
    missingDataText: { fontSize: 12, color: Colors.warning, flex: 1 },

    flagItem: {
        flexDirection: 'row', marginBottom: Spacing.sm,
        alignItems: 'flex-start', padding: Spacing.sm, borderRadius: Radius.sm,
    },
    flagItemRed: { backgroundColor: '#fff5f5' },
    flagItemGreen: { backgroundColor: '#f0fdf4' },
    flagText: { marginLeft: Spacing.sm, flex: 1 },
    flagTitle: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
    flagDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

    table: { borderRadius: Radius.sm, overflow: 'hidden' },
    tableRow: {
        flexDirection: 'row', alignItems: 'center',
        paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border,
    },
    levelDot: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.sm },
    tableLabel: { flex: 1, fontSize: 14, color: Colors.textSecondary },
    tableValue: { fontSize: 14, fontWeight: '700' },

    ingredientsText: {
        fontSize: 13, color: Colors.textSecondary, lineHeight: 20,
    },
    ingredientsPhoto: {
        width: '100%', height: 220, borderRadius: Radius.md,
        backgroundColor: Colors.background, marginBottom: Spacing.sm,
    },
    snapButton: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.primaryLight, borderRadius: Radius.md,
        padding: Spacing.md, borderWidth: 1.5, borderColor: Colors.primary,
        borderStyle: 'dashed',
    },
    snapButtonTitle: { fontSize: 15, fontWeight: '600', color: Colors.primary },
    snapButtonSub: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
    reshootButton: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        gap: Spacing.xs, paddingVertical: Spacing.sm,
    },
    reshootText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },

    fab: {
        position: 'absolute', bottom: Spacing.xl, alignSelf: 'center',
        backgroundColor: Colors.primary, flexDirection: 'row',
        alignItems: 'center', paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl, borderRadius: Radius.full,
        ...Shadow.md, gap: Spacing.sm,
    },
    fabText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});
