import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
    View, Text, StyleSheet, ScrollView, Image,
    TouchableOpacity, Modal, Dimensions,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { calculateNutriScore, RDA } from '../services/ratingEngine';
import { deriveFlags } from '../services/flagDerivation';
import { findAdditives } from '../services/additivesService';
import { findChemicals, calculateSafetyScore } from '../services/beautyService';
import { isFavorite as checkFav, toggleFavorite } from '../services/favorites';
import {
    AlertTriangle, CheckCircle, Camera, ScanLine,
    HelpCircle, ChevronRight, MessageCircle, Info,
    ArrowLeft, ThumbsUp, ThumbsDown, Package,
    Zap, Droplet, Coffee, Cookie, Activity, AlertCircle,
    Sparkles, ShieldCheck, FlaskConical, Heart
} from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Result'>;

const { width } = Dimensions.get('window');

const NUTRIENT_ICONS: Record<string, any> = {
    energy: Zap,
    sugars: Cookie,
    fat: Droplet,
    saturated_fat: Coffee,
    fiber: Activity,
    sodium: AlertCircle,
    proteins: Activity,
};

export default function ResultScreen({ route, navigation }: Props) {
    const { product } = route.params;
    const [isNutrientModalVisible, setIsNutrientModalVisible] = useState(false);
    const [activeTab, setActiveTab] = useState<'additives' | 'ingredients'>('ingredients');
    const [isFavState, setIsFavState] = useState(false);

    const isBeauty = product.category === 'beauty';
    const primaryColor = isBeauty ? '#E91E63' : Colors.primary;

    const rating = useMemo(() => isBeauty ? null : calculateNutriScore(product.nutrition), [product, isBeauty]);
    const ingredients = product.ingredients || 'Ingredients not available';
    const additives = useMemo(() => isBeauty ? [] : findAdditives(ingredients), [ingredients, isBeauty]);
    const chemicals = useMemo(() => isBeauty ? findChemicals(ingredients) : [], [ingredients, isBeauty]);
    const safetyScore = useMemo(() => isBeauty ? calculateSafetyScore(chemicals) : null, [chemicals, isBeauty]);

    const displayRating = isBeauty ? safetyScore : rating;
    const ratingLabel = isBeauty ? 'Safety Rating' : 'Health Rating';

    useEffect(() => {
        checkFav(product.barcode).then(setIsFavState);
    }, [product.barcode]);

    const handleToggleFav = useCallback(async () => {
        const nowFav = await toggleFavorite({
            barcode: product.barcode,
            name: product.name,
            brand: product.brand,
            image_url: product.image_url,
            grade: displayRating?.grade || '?',
            score: 50,
            category: product.category || 'food',
            subCategory: 'General',
            savedAt: Date.now(),
        });
        setIsFavState(nowFav);
    }, [product, displayRating]);


    const renderNutrientCard = (key: string, label: string) => {
        if (isBeauty || !rating) return null;
        const data = rating.nutrients[key];
        if (!data) return null;
        const Icon = NUTRIENT_ICONS[key] || Activity;
        const statusColor = Colors[`status${data.status.charAt(0).toUpperCase() + data.status.slice(1)}` as keyof typeof Colors] || Colors.textMuted;

        return (
            <View key={key} style={styles.nutrientCard}>
                <View style={[styles.iconCircle, { backgroundColor: statusColor + '15' }]}>
                    <Icon color={statusColor} size={20} />
                </View>
                <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={styles.navLabelSmall}>{label}</Text>
                    <Text style={styles.nutrientValMain}>{data.value} {data.unit}</Text>
                </View>
                <View style={styles.rdaPill}>
                    <Text style={[styles.rdaText, { color: statusColor }]}>{data.rdaPercentage}% RDA</Text>
                </View>
            </View>
        );
    };

    const renderChemicalCard = (chem: any) => (
        <View key={chem.name} style={styles.nutrientCard}>
            <View style={[styles.iconCircle, { backgroundColor: chem.level === 'high' ? Colors.danger + '15' : Colors.warning + '15' }]}>
                <FlaskConical color={chem.level === 'high' ? Colors.danger : Colors.warning} size={20} />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.navLabelSmall}>{chem.level.toUpperCase()} CONCERN</Text>
                <Text style={styles.nutrientValMain}>{chem.name}</Text>
                <Text style={styles.chemDesc}>{chem.description}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.wrapper}>
            {/* ── Custom Header ── */}
            <View style={[styles.header, { backgroundColor: primaryColor }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
                    <ArrowLeft color="#fff" size={24} />
                </TouchableOpacity>
                <Text style={styles.headerTitle} numberOfLines={1}>{product.name}</Text>
                <TouchableOpacity style={styles.shareBtn} onPress={handleToggleFav}>
                    <Heart
                        size={22}
                        color="#fff"
                        fill={isFavState ? '#fff' : 'transparent'}
                    />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 120 }}>
                {/* ── Product Hero ── */}
                <View style={styles.heroSection}>
                    <View style={styles.productImageContainer}>
                        {product.image_url ? (
                            <Image source={{ uri: product.image_url }} style={styles.productImage} />
                        ) : (
                            <View style={styles.imagePlaceholder}><Camera color={Colors.textMuted} size={40} /></View>
                        )}
                    </View>

                    <View style={styles.ratingCircleContainer}>
                        <View style={[styles.outerCircle, { borderColor: displayRating?.color }]}>
                            <View style={[styles.innerCircle, { backgroundColor: displayRating?.color }]}>
                                <Text style={styles.gradeTextBig}>{displayRating?.grade || '?'}</Text>
                            </View>
                        </View>
                        <Text style={[styles.ratingLabel, { color: displayRating?.color }]}>{ratingLabel}</Text>
                    </View>
                </View>

                {/* ── Key Highlights ── */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{isBeauty ? 'Chemicals to Watch' : 'Nutrient Highlights'}</Text>
                    <View style={styles.nutrientGrid}>
                        {isBeauty ? (
                            chemicals.length > 0 ? (
                                chemicals.map(renderChemicalCard)
                            ) : (
                                <View style={styles.cleanCard}>
                                    <ShieldCheck color={Colors.success} size={32} />
                                    <Text style={styles.cleanText}>No harmful chemicals detected!</Text>
                                </View>
                            )
                        ) : (
                            ['energy', 'sugars', 'saturated_fat', 'sodium'].map(k => renderNutrientCard(k, k.replace('_', ' ').toUpperCase()))
                        )}
                    </View>
                    {!isBeauty && (
                        <TouchableOpacity
                            style={styles.viewAllNutrients}
                            onPress={() => setIsNutrientModalVisible(true)}
                        >
                            <Text style={[styles.viewAllText, { color: primaryColor }]}>View All Nutrients</Text>
                            <ChevronRight color={primaryColor} size={18} />
                        </TouchableOpacity>
                    )}
                </View>

                {/* ── Tabs: Ingredients & Additives ── */}
                <View style={styles.tabSection}>
                    <View style={styles.tabHeader}>
                        <TouchableOpacity
                            style={[styles.tab, activeTab === 'ingredients' && styles.tabActive, activeTab === 'ingredients' && { borderBottomColor: primaryColor }]}
                            onPress={() => setActiveTab('ingredients')}
                        >
                            <Text style={[styles.tabText, activeTab === 'ingredients' && { color: primaryColor }]}>Ingredients</Text>
                        </TouchableOpacity>
                        {!isBeauty && (
                            <TouchableOpacity
                                style={[styles.tab, activeTab === 'additives' && styles.tabActive, activeTab === 'additives' && { borderBottomColor: primaryColor }]}
                                onPress={() => setActiveTab('additives')}
                            >
                                <Text style={[styles.tabText, activeTab === 'additives' && { color: primaryColor }]}>Additives ({additives.length})</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View style={styles.tabContent}>
                        {activeTab === 'ingredients' ? (
                            <Text style={styles.ingredientsText}>{ingredients}</Text>
                        ) : (
                            additives.length > 0 ? (
                                additives.map((add, i) => (
                                    <View key={i} style={styles.additiveRow}>
                                        <View style={[styles.statusDot, { backgroundColor: add.level === 'high' ? Colors.statusNegative : add.level === 'moderate' ? Colors.statusFair : Colors.statusPositive }]} />
                                        <View style={{ flex: 1 }}>
                                            <Text style={styles.additiveName}>{add.name}</Text>
                                            <Text style={styles.additiveStatus}>{add.level.toUpperCase()} CONCERN</Text>
                                        </View>
                                    </View>
                                ))
                            ) : (
                                <Text style={styles.emptyText}>No major additives found.</Text>
                            )
                        )}
                    </View>
                </View>

                {/* ── Recommendation ── */}
                <View style={[styles.recommendationCard, { backgroundColor: isBeauty ? '#FFF0F5' : Colors.primaryLight, borderColor: primaryColor + '30' }]}>
                    <View style={styles.recIcon}>
                        <ThumbsUp color={isBeauty ? '#E91E63' : Colors.accent} size={24} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.recTitle, { color: primaryColor }]}>{isBeauty ? 'Skin Safe' : 'Best in Class'}</Text>
                        <Text style={styles.recDesc}>{isBeauty ? 'This product is free from the most common irritating chemicals.' : 'This product has an excellent nutrient profile compared to others in its category.'}</Text>
                    </View>
                </View>

                {/* ── Feedback ── */}
                <View style={styles.feedbackSection}>
                    <Text style={styles.feedbackTitle}>{isBeauty ? 'Would you use this on your skin?' : 'Would you buy this product?'}</Text>
                    <View style={styles.feedbackButtons}>
                        <TouchableOpacity style={[styles.fBtn, { borderColor: Colors.success }]}>
                            <ThumbsUp color={Colors.success} size={20} />
                            <Text style={[styles.fBtnText, { color: Colors.success }]}>Yes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.fBtn, { borderColor: Colors.danger }]}>
                            <ThumbsDown color={Colors.danger} size={20} />
                            <Text style={[styles.fBtnText, { color: Colors.danger }]}>No</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* ── AI Bot FAB ── */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: primaryColor }]}
                onPress={() => navigation.navigate('Chat', { product })}
            >
                <MessageCircle color="#fff" size={28} />
            </TouchableOpacity>

            {/* ── All Nutrients Modal ── */}
            {!isBeauty && isNutrientModalVisible && (
                <Modal visible={isNutrientModalVisible} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalDragHandle} />
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Nutritional Facts</Text>
                                <TouchableOpacity onPress={() => setIsNutrientModalVisible(false)}>
                                    <Text style={[styles.closeBtn, { color: primaryColor }]}>Close</Text>
                                </TouchableOpacity>
                            </View>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                {rating && Object.keys(rating.nutrients).map(k => renderNutrientCard(k, k.replace('_', ' ').toUpperCase()))}
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: { flex: 1, backgroundColor: Colors.background },
    header: {
        backgroundColor: Colors.primary,
        height: 110,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingTop: 40,
        ...Shadow.md,
    },
    headerTitle: { flex: 1, marginHorizontal: 16, fontSize: 18, fontWeight: '800', color: '#fff' },
    backBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
    shareBtn: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },

    container: { flex: 1 },

    heroSection: {
        flexDirection: 'row',
        padding: Spacing.lg,
        backgroundColor: '#fff',
        borderBottomLeftRadius: Radius.xl,
        borderBottomRightRadius: Radius.xl,
        ...Shadow.sm,
    },
    productImageContainer: {
        width: 120,
        height: 120,
        borderRadius: Radius.lg,
        backgroundColor: '#f9f9f9',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: Colors.border,
    },
    productImage: { width: '100%', height: '100%', resizeMode: 'contain' },
    imagePlaceholder: { flex: 1, alignItems: 'center', justifyContent: 'center' },

    ratingCircleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    outerCircle: {
        width: 90,
        height: 90,
        borderRadius: 45,
        borderWidth: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    innerCircle: {
        width: 66,
        height: 66,
        borderRadius: 33,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadow.sm,
    },
    gradeTextBig: { fontSize: 32, fontWeight: '900', color: '#fff' },
    ratingLabel: { fontSize: 13, fontWeight: '700', letterSpacing: 0.5 },

    section: { padding: Spacing.lg },
    sectionTitle: { fontSize: 18, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
    nutrientGrid: { gap: 12 },
    nutrientCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 14,
        borderRadius: Radius.md,
        ...Shadow.sm,
    },
    iconCircle: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
    navLabelSmall: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 0.5 },
    nutrientValMain: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginTop: 2 },
    rdaPill: {
        backgroundColor: '#f0f0f0',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: Radius.full,
    },
    rdaText: { fontSize: 11, fontWeight: '800' },

    viewAllNutrients: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        gap: 4,
    },
    viewAllText: { fontSize: 15, fontWeight: '700', color: Colors.primary },

    tabSection: { marginHorizontal: Spacing.lg, backgroundColor: '#fff', borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.sm },
    tabHeader: { flexDirection: 'row', backgroundColor: '#F8F9F9' },
    tab: { flex: 1, paddingVertical: 14, alignItems: 'center', borderBottomWidth: 3, borderBottomColor: 'transparent' },
    tabActive: { borderBottomColor: Colors.primary, backgroundColor: '#fff' },
    tabText: { fontSize: 14, fontWeight: '700', color: Colors.textMuted },
    tabTextActive: { color: Colors.primary },
    tabContent: { padding: Spacing.lg },
    ingredientsText: { fontSize: 14, lineHeight: 22, color: Colors.textSecondary },
    emptyText: { textAlign: 'center', color: Colors.textMuted, padding: 20 },
    additiveRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 10, gap: 12, borderBottomWidth: 1, borderBottomColor: Colors.divider },
    statusDot: { width: 8, height: 8, borderRadius: 4 },
    additiveName: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    additiveStatus: { fontSize: 10, fontWeight: '800', color: Colors.textMuted, marginTop: 2 },

    recommendationCard: {
        margin: Spacing.lg,
        backgroundColor: Colors.primaryLight,
        borderRadius: Radius.lg,
        padding: Spacing.lg,
        flexDirection: 'row',
        gap: 16,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.primary + '30',
    },
    recIcon: { width: 48, height: 48, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', ...Shadow.sm },
    recTitle: { fontSize: 16, fontWeight: '800', color: Colors.primary },
    recDesc: { fontSize: 13, color: Colors.textSecondary, marginTop: 4, lineHeight: 18 },

    feedbackSection: { padding: Spacing.lg, alignItems: 'center', marginBottom: 20 },
    feedbackTitle: { fontSize: 16, fontWeight: '800', color: Colors.textPrimary, marginBottom: 16 },
    feedbackButtons: { flexDirection: 'row', gap: 16 },
    fBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingHorizontal: 24, paddingVertical: 12, borderRadius: Radius.full, borderWidth: 2 },
    fBtnText: { fontWeight: '800', fontSize: 15 },

    fab: {
        position: 'absolute', right: 20, bottom: 40,
        backgroundColor: Colors.primary, width: 64, height: 64,
        borderRadius: 32, alignItems: 'center', justifyContent: 'center',
        ...Shadow.lg,
    },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#fff', borderTopLeftRadius: Radius.xl, borderTopRightRadius: Radius.xl, height: '80%', padding: Spacing.lg },
    modalDragHandle: { width: 40, height: 5, backgroundColor: '#E0E0E0', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    modalTitle: { fontSize: 22, fontWeight: '900', color: Colors.textPrimary },
    closeBtn: { fontSize: 16, fontWeight: '700', color: Colors.primary },
    chemDesc: { fontSize: 12, color: Colors.textSecondary, marginTop: 4, lineHeight: 16 },
    cleanCard: { alignItems: 'center', justifyContent: 'center', padding: Spacing.xl, backgroundColor: '#f0fdf4', borderRadius: Radius.lg },
    cleanText: { fontSize: 16, fontWeight: '700', color: Colors.success, marginTop: 12 },
});
