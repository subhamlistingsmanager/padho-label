import React, { useMemo, useState } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image,
    TouchableOpacity, Modal,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { calculateNutriScore, RDA } from '../services/ratingEngine';
import { deriveFlags } from '../services/flagDerivation';
import { findAdditives } from '../services/additivesService';
import {
    AlertTriangle, CheckCircle, Camera, ScanLine,
    HelpCircle, ChevronRight, MessageCircle, Info,
    ArrowLeft, ThumbsUp, ThumbsDown, Package,
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

const STATUS_COLORS = {
    positive: Colors.statusPositive,
    negative: Colors.statusNegative,
    fair: Colors.statusFair,
    low: Colors.statusLow,
};

export default function ResultScreen({ route, navigation }: Props) {
    const { product } = route.params;
    const [isNutrientModalVisible, setIsNutrientModalVisible] = useState(false);
    const [perServing, setPerServing] = useState(false);

    const rating = useMemo(() => calculateNutriScore(product.nutrition), [product]);
    const flags = useMemo(() => deriveFlags(product.nutrition, product.nova_group), [product]);
    const additives = useMemo(() => findAdditives(product.ingredients || ''), [product]);

    const redFlags = flags.filter(f => f.type === 'red');
    const greenFlags = flags.filter(f => f.type === 'green');

    const renderNutrientRow = (key: string, label: string) => {
        const data = rating.nutrients[key];
        if (!data) return null;

        return (
            <View key={key} style={styles.nutrientListItem}>
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[data.status as keyof typeof STATUS_COLORS] }]} />
                <View style={styles.nutrientInfo}>
                    <Text style={styles.nutrientLabel}>{label}</Text>
                    <Text style={styles.nutrientValue}>
                        {(perServing ? (data.value * 0.3).toFixed(1) : data.value)} {data.unit}
                    </Text>
                </View>
                <View style={styles.rdaContainer}>
                    <Text style={styles.rdaValue}>{data.rdaPercentage}%</Text>
                    <TouchableOpacity style={styles.infoIcon}>
                        <ChevronRight color={Colors.textMuted} size={16} />
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.wrapper}>
            <View style={styles.navHeader}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <ArrowLeft color={Colors.textPrimary} size={24} />
                </TouchableOpacity>
                <View style={styles.navIcons}>
                    <TouchableOpacity style={styles.navIcon}><Info color={Colors.textPrimary} size={22} /></TouchableOpacity>
                    <TouchableOpacity style={styles.navIcon}><Package color={Colors.textPrimary} size={22} /></TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 110 }}>
                {/* ── Product Summary ── */}
                <View style={styles.productSummary}>
                    {renderNutrientRow('energy', 'Energy')}
                    {renderNutrientRow('sugars', 'Total Sugars')}
                    {renderNutrientRow('saturated_fat', 'Saturated Fat')}
                    <View style={styles.divider} />

                    <Text style={styles.subHeading}>What You’ll Like 🙂</Text>
                    {renderNutrientRow('fiber', 'Dietary Fiber')}
                    {renderNutrientRow('sodium', 'Sodium')}
                </View>

                {/* ── All Nutrients / Ingredients CTA ── */}
                <TouchableOpacity
                    style={styles.ctaCard}
                    onPress={() => setIsNutrientModalVisible(true)}
                >
                    <Text style={styles.ctaText}>All Nutrients</Text>
                    <ChevronRight color={Colors.textPrimary} size={20} />
                </TouchableOpacity>

                <TouchableOpacity style={styles.ctaCard}>
                    <Text style={styles.ctaText}>All Ingredients</Text>
                    <ChevronRight color={Colors.textPrimary} size={20} />
                </TouchableOpacity>

                {/* ── Additives Analysis ── */}
                {additives.length > 0 && (
                    <View style={styles.card}>
                        <View style={styles.tabHeader}>
                            <View style={[styles.tab, styles.tabActive]}>
                                <Text style={styles.tabTextActive}>Additives ({additives.length})</Text>
                            </View>
                            <View style={styles.tab}>
                                <Text style={styles.tabText}>Ingredients</Text>
                            </View>
                        </View>
                        {additives.map((add, i) => (
                            <View key={i} style={styles.additiveRow}>
                                <View style={[styles.statusDotSmall, { backgroundColor: add.level === 'high' ? Colors.statusNegative : add.level === 'moderate' ? Colors.statusFair : Colors.statusPositive }]} />
                                <Text style={styles.additiveName}>{add.name}</Text>
                                <Text style={[styles.concernLabel, { color: add.level === 'high' ? Colors.statusNegative : add.level === 'moderate' ? Colors.statusFair : Colors.statusPositive }]}>
                                    {add.level.charAt(0).toUpperCase() + add.level.slice(1)} Concern
                                </Text>
                                <ChevronRight color={Colors.textMuted} size={16} />
                            </View>
                        ))}
                    </View>
                )}

                {/* ── Recommendation ── */}
                <View style={styles.recommendationCard}>
                    <Text style={styles.recTitle}>Highest Rated Product</Text>
                    <Text style={styles.recSub}>This is already the best-rated product in its category within our database.</Text>
                </View>

                {/* ── Purchase Feedback ── */}
                <View style={styles.feedbackCard}>
                    <Text style={styles.feedbackTitle}>Would you buy this product?</Text>
                    <View style={styles.feedbackButtons}>
                        <TouchableOpacity style={[styles.btn, styles.btnYes]}><Text style={styles.btnTextYes}>Yes</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnNo]}><Text style={styles.btnTextNo}>No</Text></TouchableOpacity>
                        <TouchableOpacity style={[styles.btn, styles.btnAlready]}><Text style={styles.btnTextAlready}>Already Bought</Text></TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* ── AI Chat FAB ── */}
            <TouchableOpacity
                style={styles.chatFab}
                onPress={() => navigation.navigate('Chat', { product })}
            >
                <MessageCircle color="#fff" size={28} />
            </TouchableOpacity>

            {/* ── All Nutrients Modal ── */}
            <Modal visible={isNutrientModalVisible} animationType="slide" transparent>
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>All Nutrients</Text>
                            <TouchableOpacity onPress={() => setIsNutrientModalVisible(false)}><ArrowLeft color={Colors.textPrimary} size={24} /></TouchableOpacity>
                        </View>

                        <View style={styles.toggleContainer}>
                            <TouchableOpacity
                                style={[styles.toggleBtn, !perServing && styles.toggleBtnActive]}
                                onPress={() => setPerServing(false)}
                            >
                                <Text style={[styles.toggleBtnText, !perServing && styles.toggleBtnTextActive]}>Per 100g</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.toggleBtn, perServing && styles.toggleBtnActive]}
                                onPress={() => setPerServing(true)}
                            >
                                <Text style={[styles.toggleBtnText, perServing && styles.toggleBtnTextActive]}>Per 30g</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.legend}>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.statusPositive }]} /><Text style={styles.legendText}>Positive</Text></View>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.statusNegative }]} /><Text style={styles.legendText}>Negative</Text></View>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.statusFair }]} /><Text style={styles.legendText}>Fair</Text></View>
                            <View style={styles.legendItem}><View style={[styles.legendDot, { backgroundColor: Colors.statusLow }]} /><Text style={styles.legendText}>Low Value</Text></View>
                        </View>

                        <View style={styles.modalTable}>
                            <View style={styles.tableHeader}>
                                <Text style={styles.tableHeaderText}>Nutrient</Text>
                                <Text style={styles.tableHeaderText}>RDA%</Text>
                            </View>
                            <ScrollView>
                                {Object.keys(rating.nutrients).map(key => renderNutrientRow(key, key.replace('_', ' ').toUpperCase()))}
                            </ScrollView>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background },
    navHeader: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        paddingHorizontal: Spacing.lg, paddingTop: 60, paddingBottom: Spacing.md,
        backgroundColor: Colors.card,
    },
    navIcons: { flexDirection: 'row', gap: Spacing.md },
    navIcon: { opacity: 0.8 },
    container: { flex: 1 },

    productSummary: { backgroundColor: Colors.card, paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md },
    nutrientListItem: {
        flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md,
        borderBottomWidth: 1, borderBottomColor: Colors.divider,
    },
    statusDot: { width: 12, height: 12, borderRadius: 6, marginRight: Spacing.md },
    statusDotSmall: { width: 8, height: 8, borderRadius: 4, marginRight: Spacing.md },
    nutrientInfo: { flex: 1 },
    nutrientLabel: { fontSize: 16, fontWeight: '600', color: Colors.textPrimary },
    nutrientValue: { fontSize: 14, color: Colors.textSecondary, marginTop: 2 },
    rdaContainer: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    rdaValue: { fontSize: 16, fontWeight: '700', color: Colors.textPrimary },
    infoIcon: { padding: 4 },
    divider: { height: 1, backgroundColor: Colors.divider, marginVertical: Spacing.lg },
    subHeading: { fontSize: 20, fontWeight: '800', color: Colors.textPrimary, marginBottom: Spacing.md },

    ctaCard: {
        flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
        backgroundColor: Colors.card, padding: Spacing.lg, marginTop: Spacing.sm,
    },
    ctaText: { fontSize: 18, fontWeight: '700', color: Colors.textPrimary },

    card: { backgroundColor: Colors.card, marginTop: Spacing.sm, padding: Spacing.lg },
    tabHeader: { flexDirection: 'row', backgroundColor: '#f1f2f6', borderRadius: Radius.full, padding: 4, marginBottom: Spacing.lg },
    tab: { flex: 1, paddingVertical: 10, alignItems: 'center' },
    tabActive: { backgroundColor: Colors.chatBubbleUser, borderRadius: Radius.full },
    tabText: { fontWeight: '600', color: Colors.textSecondary },
    tabTextActive: { fontWeight: '600', color: '#fff' },
    additiveRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: Spacing.md, borderBottomWidth: 1, borderBottomColor: Colors.divider },
    additiveName: { flex: 1, fontSize: 15, fontWeight: '600' },
    concernLabel: { fontSize: 13, fontWeight: '600', marginRight: Spacing.sm },

    recommendationCard: { backgroundColor: Colors.card, marginTop: Spacing.sm, padding: Spacing.lg, alignItems: 'center' },
    recTitle: { fontSize: 16, fontWeight: '800', marginBottom: 8 },
    recSub: { textAlign: 'center', color: Colors.textSecondary, fontSize: 14, lineHeight: 20 },

    feedbackCard: { padding: Spacing.lg, alignItems: 'center', paddingBottom: 40 },
    feedbackTitle: { fontSize: 18, fontWeight: '700', color: Colors.chatBubbleUser, marginBottom: Spacing.lg },
    feedbackButtons: { flexDirection: 'row', gap: Spacing.sm },
    btn: { paddingVertical: 10, paddingHorizontal: 16, borderRadius: Radius.full, borderWidth: 1 },
    btnYes: { borderColor: Colors.statusPositive },
    btnNo: { borderColor: Colors.statusNegative },
    btnAlready: { borderColor: Colors.textMuted },
    btnTextYes: { color: Colors.statusPositive, fontWeight: '700' },
    btnTextNo: { color: Colors.statusNegative, fontWeight: '700' },
    btnTextAlready: { color: Colors.textMuted, fontWeight: '700' },

    chatFab: {
        position: 'absolute', right: 20, bottom: 40,
        backgroundColor: Colors.chatBubbleUser, width: 64, height: 64,
        borderRadius: 32, alignItems: 'center', justifyContent: 'center',
        ...Shadow.lg,
    },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: Colors.card, borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, height: '80%', padding: Spacing.lg },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.lg },
    modalTitle: { fontSize: 22, fontWeight: '800' },
    toggleContainer: { flexDirection: 'row', backgroundColor: '#f1f2f6', borderRadius: Radius.md, padding: 4, marginBottom: Spacing.lg },
    toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center' },
    toggleBtnActive: { backgroundColor: '#fff', borderRadius: Radius.sm, ...Shadow.sm },
    toggleBtnText: { fontWeight: '600', color: Colors.textMuted },
    toggleBtnTextActive: { color: Colors.textPrimary },
    legend: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.md, marginBottom: Spacing.lg },
    legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
    legendDot: { width: 10, height: 10, borderRadius: 5 },
    legendText: { fontSize: 12, color: Colors.textSecondary },
    modalTable: { flex: 1 },
    tableHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: Spacing.sm },
    tableHeaderText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
});
