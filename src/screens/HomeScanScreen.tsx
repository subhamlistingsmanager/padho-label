import React, { useState, useEffect, useRef } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    TextInput, FlatList, Image, Animated,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, Product } from '../types';
import { Camera, Search, ChevronRight, Clock, Lightbulb, Shield } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadow, Typography } from '../theme';
import { getHistory, getHistoryCount } from '../services/history';
import { calculateNutriScore } from '../services/ratingEngine';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HEALTH_TIPS = [
    'High sugar (>15g/100g) is linked to weight gain and diabetes. Watch out for Grade D & E products.',
    'Fibre slows sugar absorption and keeps you full longer. Look for >6g/100g.',
    'Ultra-processed foods (NOVA 4) contain many additives. Prefer NOVA 1 & 2 when possible.',
    'Saturated fat raises LDL cholesterol. Keep below 5g/100g for heart health.',
    'Salt raises blood pressure. The NHS recommends less than 6g per day for adults.',
    'Protein keeps you full and supports muscle. Aim for >10g/100g in snacks.',
    'Read the ingredients: if the list is short and recognisable, it\'s usually healthier.',
    'A Nutri-Score of A or B doesn\'t mean eat unlimitedly — portion size still matters.',
];

const GRADE_GUIDE = [
    { grade: 'A', label: 'Excellent', color: Colors.gradeA },
    { grade: 'B', label: 'Good', color: Colors.gradeB },
    { grade: 'C', label: 'Average', color: Colors.gradeC },
    { grade: 'D', label: 'Poor', color: Colors.gradeD },
    { grade: 'E', label: 'Bad', color: Colors.gradeE },
];

export default function HomeScanScreen({ navigation }: Props) {
    const [barcode, setBarcode] = useState('');
    const [recentScans, setRecentScans] = useState<Product[]>([]);
    const [scanCount, setScanCount] = useState(0);
    const [tipIndex] = useState(() => Math.floor(Math.random() * HEALTH_TIPS.length));
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    useEffect(() => {
        loadData();
        Animated.parallel([
            Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
            Animated.timing(slideAnim, { toValue: 0, duration: 450, useNativeDriver: true }),
        ]).start();
    }, []);

    const loadData = async () => {
        const history = await getHistory();
        setRecentScans(history.slice(0, 3));
        setScanCount(history.length);
    };

    const handleManualEntry = () => {
        if (!barcode.trim()) return;
        navigation.navigate('Scan');
    };

    return (
        <FlatList
            style={styles.container}
            data={recentScans}
            keyExtractor={(item) => item.barcode}
            ListHeaderComponent={
                <>
                    {/* ── Hero ── */}
                    <View style={styles.hero}>
                        <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                            <Text style={styles.heroTitle}>Padho Label</Text>
                            <Text style={styles.heroTagline}>Read the label before you eat.</Text>
                            {scanCount > 0 && (
                                <View style={styles.statPill}>
                                    <Shield color="rgba(255,255,255,0.85)" size={13} />
                                    <Text style={styles.statText}>
                                        {scanCount} product{scanCount !== 1 ? 's' : ''} scanned
                                    </Text>
                                </View>
                            )}
                        </Animated.View>
                    </View>

                    {/* ── Scan Card ── */}
                    <View style={styles.actionsCard}>
                        <TouchableOpacity
                            style={styles.scanButton}
                            onPress={() => navigation.navigate('Scan')}
                            activeOpacity={0.85}
                        >
                            <View style={styles.scanButtonIcon}>
                                <Camera color="#fff" size={28} />
                            </View>
                            <View style={styles.scanButtonText}>
                                <Text style={styles.scanButtonTitle}>Scan Barcode</Text>
                                <Text style={styles.scanButtonSub}>Point camera at any product</Text>
                            </View>
                            <ChevronRight color="rgba(255,255,255,0.7)" size={20} />
                        </TouchableOpacity>

                        <View style={styles.manualRow}>
                            <Search color={Colors.textMuted} size={18} />
                            <TextInput
                                style={styles.manualInput}
                                placeholder="Or enter barcode number…"
                                placeholderTextColor={Colors.textMuted}
                                value={barcode}
                                onChangeText={setBarcode}
                                keyboardType="numeric"
                                returnKeyType="search"
                                onSubmitEditing={handleManualEntry}
                            />
                            {barcode.length > 0 && (
                                <TouchableOpacity onPress={handleManualEntry} style={styles.goButton}>
                                    <Text style={styles.goButtonText}>Go</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* ── Daily Tip ── */}
                    <View style={styles.tipCard}>
                        <View style={styles.tipHeader}>
                            <Lightbulb color={Colors.gradeC} size={16} />
                            <Text style={styles.tipLabel}>HEALTH TIP</Text>
                        </View>
                        <Text style={styles.tipText}>{HEALTH_TIPS[tipIndex]}</Text>
                    </View>

                    {/* ── Grade Guide ── */}
                    <View style={styles.gradeCard}>
                        <Text style={styles.gradeCardTitle}>Nutri-Score Guide</Text>
                        <View style={styles.gradeRow}>
                            {GRADE_GUIDE.map(({ grade, label, color }) => (
                                <View key={grade} style={styles.gradeItem}>
                                    <View style={[styles.gradeBadge, { backgroundColor: color }]}>
                                        <Text style={styles.gradeBadgeText}>{grade}</Text>
                                    </View>
                                    <Text style={styles.gradeItemLabel}>{label}</Text>
                                </View>
                            ))}
                        </View>
                    </View>

                    {/* ── Recent Scans header ── */}
                    {recentScans.length > 0 && (
                        <View style={styles.recentHeader}>
                            <Clock color={Colors.textMuted} size={14} />
                            <Text style={styles.recentTitle}>Recent Scans</Text>
                        </View>
                    )}
                </>
            }
            renderItem={({ item }) => {
                const rating = calculateNutriScore(item.nutrition);
                return (
                    <TouchableOpacity
                        style={styles.recentItem}
                        onPress={() => navigation.navigate('Result', { product: item })}
                        activeOpacity={0.8}
                    >
                        {item.image_url ? (
                            <Image source={{ uri: item.image_url }} style={styles.recentImage} />
                        ) : (
                            <View style={[styles.recentImage, styles.recentImagePlaceholder]}>
                                <Camera color={Colors.textMuted} size={16} />
                            </View>
                        )}
                        <View style={styles.recentInfo}>
                            <Text style={styles.recentName} numberOfLines={1}>{item.name}</Text>
                            <Text style={styles.recentBrand} numberOfLines={1}>
                                {item.brand || 'Unknown brand'}
                            </Text>
                        </View>
                        {rating.hasData ? (
                            <View style={[styles.recentGrade, { backgroundColor: rating.color }]}>
                                <Text style={styles.recentGradeText}>{rating.grade}</Text>
                            </View>
                        ) : (
                            <View style={[styles.recentGrade, { backgroundColor: Colors.textMuted }]}>
                                <Text style={styles.recentGradeText}>?</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                );
            }}
            ListFooterComponent={
                recentScans.length > 0 ? (
                    <TouchableOpacity
                        onPress={() => navigation.navigate('History')}
                        style={styles.viewAllButton}
                    >
                        <Text style={styles.viewAllText}>View all history</Text>
                    </TouchableOpacity>
                ) : null
            }
            contentContainerStyle={{ paddingBottom: Spacing.xl }}
        />
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    hero: {
        backgroundColor: Colors.primary,
        paddingHorizontal: Spacing.lg,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.xxl,
    },
    heroTitle: { fontSize: 34, fontWeight: '900', color: '#fff', letterSpacing: -0.5 },
    heroTagline: { fontSize: 15, color: 'rgba(255,255,255,0.75)', marginTop: 4, fontStyle: 'italic' },
    statPill: {
        flexDirection: 'row', alignItems: 'center', gap: 5,
        marginTop: Spacing.md, backgroundColor: 'rgba(255,255,255,0.2)',
        alignSelf: 'flex-start', paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs, borderRadius: Radius.full,
    },
    statText: { color: '#fff', fontSize: 12, fontWeight: '600' },

    actionsCard: {
        backgroundColor: Colors.card, marginHorizontal: Spacing.md,
        marginTop: -Spacing.lg, borderRadius: Radius.lg,
        padding: Spacing.md, ...Shadow.md,
    },
    scanButton: {
        backgroundColor: Colors.primary, borderRadius: Radius.md,
        flexDirection: 'row', alignItems: 'center',
        padding: Spacing.md, marginBottom: Spacing.md,
    },
    scanButtonIcon: {
        width: 48, height: 48, borderRadius: Radius.sm,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center', justifyContent: 'center', marginRight: Spacing.md,
    },
    scanButtonText: { flex: 1 },
    scanButtonTitle: { fontSize: 17, fontWeight: '700', color: '#fff' },
    scanButtonSub: { fontSize: 13, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
    manualRow: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.background, borderRadius: Radius.md,
        paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm,
        borderWidth: 1, borderColor: Colors.border,
    },
    manualInput: {
        flex: 1, fontSize: 15, color: Colors.textPrimary,
        marginLeft: Spacing.sm, paddingVertical: 6,
    },
    goButton: {
        backgroundColor: Colors.primary, paddingHorizontal: Spacing.md,
        paddingVertical: Spacing.xs, borderRadius: Radius.full,
    },
    goButtonText: { color: '#fff', fontWeight: '700', fontSize: 14 },

    tipCard: {
        backgroundColor: '#fffbeb', marginHorizontal: Spacing.md,
        marginTop: Spacing.md, borderRadius: Radius.lg,
        padding: Spacing.md, borderLeftWidth: 4, borderLeftColor: Colors.gradeC,
    },
    tipHeader: {
        flexDirection: 'row', alignItems: 'center',
        gap: Spacing.xs, marginBottom: Spacing.xs,
    },
    tipLabel: { ...Typography.label, color: Colors.gradeC, fontSize: 11 },
    tipText: { fontSize: 13, color: Colors.textSecondary, lineHeight: 19 },

    gradeCard: {
        backgroundColor: Colors.card, marginHorizontal: Spacing.md,
        marginTop: Spacing.md, borderRadius: Radius.lg,
        padding: Spacing.md, ...Shadow.sm,
    },
    gradeCardTitle: { fontSize: 13, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.md },
    gradeRow: { flexDirection: 'row', justifyContent: 'space-between' },
    gradeItem: { alignItems: 'center', flex: 1 },
    gradeBadge: {
        width: 36, height: 36, borderRadius: 18,
        alignItems: 'center', justifyContent: 'center', marginBottom: 4,
    },
    gradeBadgeText: { color: '#fff', fontWeight: '900', fontSize: 16 },
    gradeItemLabel: { fontSize: 10, color: Colors.textMuted, textAlign: 'center' },

    recentHeader: {
        flexDirection: 'row', alignItems: 'center',
        marginHorizontal: Spacing.md, marginTop: Spacing.lg, marginBottom: Spacing.sm,
        gap: Spacing.xs,
    },
    recentTitle: { ...Typography.label },
    recentItem: {
        flexDirection: 'row', alignItems: 'center',
        backgroundColor: Colors.card, marginHorizontal: Spacing.md,
        borderRadius: Radius.md, padding: Spacing.sm + 2,
        marginBottom: Spacing.xs, ...Shadow.sm,
    },
    recentImage: { width: 44, height: 44, borderRadius: Radius.sm, backgroundColor: Colors.border },
    recentImagePlaceholder: { alignItems: 'center', justifyContent: 'center' },
    recentInfo: { flex: 1, marginHorizontal: Spacing.sm },
    recentName: { fontSize: 15, fontWeight: '600', color: Colors.textPrimary },
    recentBrand: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
    recentGrade: {
        width: 30, height: 30, borderRadius: 15,
        alignItems: 'center', justifyContent: 'center',
    },
    recentGradeText: { color: '#fff', fontWeight: '900', fontSize: 14 },
    viewAllButton: { alignItems: 'center', paddingVertical: Spacing.lg },
    viewAllText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
});
