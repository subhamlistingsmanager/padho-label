import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
    ScrollView, Alert,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList, NutritionData } from '../types';
import { updateProductInHistory } from '../services/history';
import { runOCROnImage, parseNutritionFromText, mergeNutrition } from '../services/ocrNutrition';
import { calculateNutriScore } from '../services/ratingEngine';
import { Camera, CheckCircle, XCircle, RefreshCw, Zap } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IngredientsSnap'>;

type Stage = 'camera' | 'processing' | 'review' | 'error';

const FIELD_LABELS: Record<keyof NutritionData, string> = {
    energy_100g: 'Energy (kJ)',
    carbohydrates_100g: 'Carbohydrates (g)',
    sugars_100g: 'Sugar (g)',
    fat_100g: 'Fat (g)',
    saturated_fat_100g: 'Saturated Fat (g)',
    fiber_100g: 'Fibre (g)',
    proteins_100g: 'Protein (g)',
    salt_100g: 'Salt (g)',
    sodium_100g: 'Sodium (g)',
    cholesterol_mg_100g: 'Cholesterol (mg)',
};

export default function IngredientsSnap({ route, navigation }: Props) {
    const { product } = route.params;
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [stage, setStage] = useState<Stage>('camera');
    const [statusMsg, setStatusMsg] = useState('');
    const [imageUri, setImageUri] = useState<string | null>(null);
    const [extractedNutrition, setExtractedNutrition] = useState<Partial<NutritionData>>({});
    const [mergedNutrition, setMergedNutrition] = useState<NutritionData>(product.nutrition);

    const handleCapture = async () => {
        if (!cameraRef.current || stage !== 'camera') return;
        setStage('processing');

        try {
            // 1. Take photo
            setStatusMsg('Capturing image…');
            const photo = await cameraRef.current.takePictureAsync({
                quality: 0.75,
                base64: false,
            });
            if (!photo?.uri) throw new Error('No photo URI');
            setImageUri(photo.uri);

            // 2. Try OCR via Open Food Facts API
            setStatusMsg('Reading label with OCR…');
            let ocrText: string | null = null;
            try {
                ocrText = await runOCROnImage(photo.uri);
            } catch {
                // OCR API failed — continue with pure local parse
            }

            // 3. Always try local regex parse too (on any available text)
            setStatusMsg('Extracting nutrition values…');
            const ocrExtracted = ocrText ? parseNutritionFromText(ocrText) : {};

            // 4. Merge with existing product nutrition
            const merged = mergeNutrition(product.nutrition, ocrExtracted);

            setExtractedNutrition(ocrExtracted);
            setMergedNutrition(merged);

            // 5. Save image URI to history
            await updateProductInHistory(product.barcode, {
                ingredientsImageUri: photo.uri,
                nutrition: merged,
            });

            setStage('review');
        } catch (err: any) {
            console.error('IngredientsSnap error:', err);
            setStatusMsg(err?.message ?? 'Unknown error');
            setStage('error');
        }
    };

    const handleApply = () => {
        const updatedProduct = {
            ...product,
            ingredientsImageUri: imageUri ?? undefined,
            nutrition: mergedNutrition,
        };
        navigation.navigate('Result', { product: updatedProduct });
    };

    const handleRetry = () => {
        setStage('camera');
        setStatusMsg('');
        setExtractedNutrition({});
        setMergedNutrition(product.nutrition);
    };

    if (!permission) return <View style={styles.container} />;

    if (!permission.granted) {
        return (
            <View style={styles.permContainer}>
                <Text style={styles.permTitle}>Camera Access Needed</Text>
                <Text style={styles.permDesc}>Grant camera access to photograph the ingredients label.</Text>
                <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
                    <Text style={styles.permButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ── PROCESSING STAGE ────────────────────────────────────────────────────
    if (stage === 'processing') {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.processingText}>{statusMsg}</Text>
                <Text style={styles.processingSubText}>
                    Scanning for nutritional values…
                </Text>
            </View>
        );
    }

    // ── ERROR STAGE ─────────────────────────────────────────────────────────
    if (stage === 'error') {
        return (
            <View style={[styles.container, styles.centered, { backgroundColor: Colors.background }]}>
                <XCircle color={Colors.danger} size={48} />
                <Text style={styles.errorTitle}>Couldn't process label</Text>
                <Text style={styles.errorDesc}>{statusMsg}</Text>
                <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
                    <RefreshCw color="#fff" size={18} />
                    <Text style={styles.retryButtonText}>Try Again</Text>
                </TouchableOpacity>
            </View>
        );
    }

    // ── REVIEW STAGE ────────────────────────────────────────────────────────
    if (stage === 'review') {
        const newRating = calculateNutriScore(mergedNutrition);
        const prevRating = calculateNutriScore(product.nutrition);
        const foundCount = Object.keys(extractedNutrition).length;

        return (
            <ScrollView style={[styles.container, { backgroundColor: Colors.background }]}
                contentContainerStyle={{ padding: Spacing.lg, paddingBottom: 100 }}>

                {/* Result banner */}
                <View style={styles.resultBanner}>
                    <Zap color={Colors.primary} size={22} />
                    <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                        <Text style={styles.resultBannerTitle}>
                            {foundCount > 0
                                ? `Found ${foundCount} nutrition value${foundCount !== 1 ? 's' : ''}`
                                : 'No values extracted — label may be unclear'}
                        </Text>
                        <Text style={styles.resultBannerSub}>
                            {foundCount > 0
                                ? 'Review below and tap Apply to update the grade'
                                : 'Photo saved. You can reshoot for a clearer image.'}
                        </Text>
                    </View>
                </View>

                {/* Grade comparison */}
                {newRating.hasData && (
                    <View style={styles.gradeCompare}>
                        <View style={styles.gradeBox}>
                            <Text style={styles.gradeBoxLabel}>BEFORE</Text>
                            <View style={[styles.gradeBadge, {
                                backgroundColor: prevRating.hasData ? prevRating.color : Colors.textMuted
                            }]}>
                                <Text style={styles.gradeBadgeText}>
                                    {prevRating.grade ?? '?'}
                                </Text>
                            </View>
                        </View>
                        <Text style={styles.gradeArrow}>→</Text>
                        <View style={styles.gradeBox}>
                            <Text style={styles.gradeBoxLabel}>AFTER OCR</Text>
                            <View style={[styles.gradeBadge, { backgroundColor: newRating.color }]}>
                                <Text style={styles.gradeBadgeText}>{newRating.grade}</Text>
                            </View>
                        </View>
                    </View>
                )}

                {/* Extracted values */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Extracted Values</Text>
                    {(Object.keys(FIELD_LABELS) as (keyof NutritionData)[]).map(key => {
                        const extractedVal = extractedNutrition[key];
                        const existingVal = product.nutrition[key];
                        const finalVal = mergedNutrition[key];
                        const isNew = extractedVal != null && existingVal == null;
                        const hasValue = finalVal != null;
                        return (
                            <View key={key} style={[styles.tableRow, isNew && styles.tableRowHighlight]}>
                                <View style={styles.rowLeft}>
                                    <Text style={styles.rowLabel}>{FIELD_LABELS[key]}</Text>
                                    {isNew && (
                                        <View style={styles.newBadge}>
                                            <Text style={styles.newBadgeText}>NEW</Text>
                                        </View>
                                    )}
                                </View>
                                <Text style={[styles.rowValue, !hasValue && styles.rowValueMuted]}>
                                    {hasValue ? String(finalVal) : '—'}
                                </Text>
                            </View>
                        );
                    })}
                </View>

                {/* Buttons */}
                <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
                    <CheckCircle color="#fff" size={20} />
                    <Text style={styles.applyButtonText}>Apply & View Updated Results</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.reshootButton} onPress={handleRetry}>
                    <RefreshCw color={Colors.primary} size={16} />
                    <Text style={styles.reshootButtonText}>Reshoot Label</Text>
                </TouchableOpacity>
            </ScrollView>
        );
    }

    // ── CAMERA STAGE ────────────────────────────────────────────────────────
    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />

            <View style={styles.topOverlay}>
                <Text style={styles.instruction}>Point at the nutrition/ingredients label</Text>
                <Text style={styles.instructionSub}>
                    Make sure all text is clearly visible and in focus
                </Text>
            </View>

            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={styles.captureButton}
                    onPress={handleCapture}
                    activeOpacity={0.8}
                >
                    <Camera color="#fff" size={32} />
                </TouchableOpacity>
                <Text style={styles.captureLabel}>Capture & Analyse</Text>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                <XCircle color="#fff" size={26} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    centered: { justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
    permContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: Spacing.xl },
    permTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
    permDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
    permButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full },
    permButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

    processingText: { fontSize: 18, fontWeight: '700', color: '#fff', marginTop: Spacing.lg, textAlign: 'center' },
    processingSubText: { fontSize: 14, color: 'rgba(255,255,255,0.6)', marginTop: Spacing.sm, textAlign: 'center' },

    errorTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginTop: Spacing.lg },
    errorDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginTop: Spacing.sm, marginBottom: Spacing.xl },
    retryButton: { flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full, alignItems: 'center', gap: Spacing.sm },
    retryButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },

    resultBanner: {
        flexDirection: 'row', alignItems: 'flex-start',
        backgroundColor: Colors.primaryLight, borderRadius: Radius.lg,
        padding: Spacing.md, borderWidth: 1, borderColor: Colors.primary,
        marginBottom: Spacing.md,
    },
    resultBannerTitle: { fontSize: 15, fontWeight: '700', color: Colors.primary },
    resultBannerSub: { fontSize: 13, color: Colors.textSecondary, marginTop: 2 },

    gradeCompare: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
        backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg,
        marginBottom: Spacing.md, ...Shadow.sm,
    },
    gradeBox: { alignItems: 'center', flex: 1 },
    gradeBoxLabel: { fontSize: 11, fontWeight: '700', color: Colors.textMuted, letterSpacing: 1, marginBottom: Spacing.sm },
    gradeBadge: { width: 56, height: 56, borderRadius: 28, alignItems: 'center', justifyContent: 'center' },
    gradeBadgeText: { fontSize: 26, fontWeight: '900', color: '#fff' },
    gradeArrow: { fontSize: 28, color: Colors.textMuted, marginHorizontal: Spacing.lg },

    card: { backgroundColor: Colors.card, borderRadius: Radius.lg, padding: Spacing.lg, ...Shadow.sm, marginBottom: Spacing.md },
    cardTitle: { fontSize: 15, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.md },
    tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: Colors.border },
    tableRowHighlight: { backgroundColor: '#f0fdf4', marginHorizontal: -Spacing.md, paddingHorizontal: Spacing.md, borderRadius: Radius.sm },
    rowLeft: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
    rowLabel: { fontSize: 13, color: Colors.textSecondary },
    newBadge: { backgroundColor: Colors.gradeA, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 },
    newBadgeText: { fontSize: 9, color: '#fff', fontWeight: '800' },
    rowValue: { fontSize: 14, fontWeight: '700', color: Colors.textPrimary },
    rowValueMuted: { color: Colors.textMuted, fontWeight: '400' },

    applyButton: { backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md, borderRadius: Radius.full, ...Shadow.md, marginBottom: Spacing.sm },
    applyButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    reshootButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, paddingVertical: Spacing.md },
    reshootButtonText: { color: Colors.primary, fontWeight: '600', fontSize: 15 },

    topOverlay: { position: 'absolute', top: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.55)', paddingTop: Spacing.xl + 30, paddingBottom: Spacing.lg, paddingHorizontal: Spacing.lg, alignItems: 'center' },
    instruction: { color: '#fff', fontSize: 16, fontWeight: '700', textAlign: 'center' },
    instructionSub: { color: 'rgba(255,255,255,0.7)', fontSize: 13, textAlign: 'center', marginTop: 4 },
    bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.6)', paddingBottom: Spacing.xxl, paddingTop: Spacing.lg, alignItems: 'center' },
    captureButton: { width: 72, height: 72, borderRadius: 36, backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 4, borderColor: 'rgba(255,255,255,0.4)', ...Shadow.md },
    captureLabel: { color: '#fff', fontSize: 13, fontWeight: '600', marginTop: Spacing.sm },
    cancelButton: { position: 'absolute', top: Spacing.xl + 30, right: Spacing.lg },
});
