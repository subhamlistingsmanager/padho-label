import React, { useState, useRef, useEffect } from 'react';
import {
    Text, View, StyleSheet, TouchableOpacity,
    ActivityIndicator, Animated,
} from 'react-native';
import {
    Camera,
    useCameraDevice,
    useCameraPermission,
    useCodeScanner,
} from 'react-native-vision-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getProductByBarcode } from '../services/api';
import { saveToHistory } from '../services/history';
import { XCircle, RefreshCw } from 'lucide-react-native';
import { Colors, Spacing, Radius } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = [0, 1000, 2500];
const sleep = (ms: number) => new Promise(res => setTimeout(res, ms));

type ErrType = 'timeout' | 'notfound' | 'generic';

export default function ScanScreen({ navigation }: Props) {
    const { hasPermission, requestPermission } = useCameraPermission();
    const device = useCameraDevice('back');

    const [active, setActive] = useState(true);
    const [loading, setLoading] = useState(false);
    const [attempt, setAttempt] = useState(0);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [errorType, setErrorType] = useState<ErrType | null>(null);
    const lastBarcode = useRef<string | null>(null);
    const scanLineAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const loop = Animated.loop(
            Animated.sequence([
                Animated.timing(scanLineAnim, { toValue: 1, duration: 1800, useNativeDriver: true }),
                Animated.timing(scanLineAnim, { toValue: 0, duration: 1800, useNativeDriver: true }),
            ])
        );
        loop.start();
        return () => loop.stop();
    }, []);

    const fetchWithRetry = async (barcode: string) => {
        let lastError: Error | null = null;
        for (let i = 0; i < MAX_RETRIES; i++) {
            if (i > 0) {
                setAttempt(i + 1);
                setErrorMsg(`Network error — retry ${i + 1}/${MAX_RETRIES}`);
                await sleep(RETRY_DELAY_MS[i] ?? 2500);
            }
            try {
                const product = await getProductByBarcode(barcode);
                return { product, error: null };
            } catch (err: any) {
                lastError = err;
                const msg = (err?.message ?? '').toLowerCase();
                if (!msg.includes('timeout') && !msg.includes('network') && !msg.includes('econnreset')) break;
            }
        }
        return { product: null, error: lastError };
    };

    // Vision Camera V4 code scanner hook — runs on the native thread, fast
    const codeScanner = useCodeScanner({
        codeTypes: ['ean-13', 'ean-8', 'upc-a', 'upc-e'],
        onCodeScanned: async (codes) => {
            if (!active || loading || codes.length === 0) return;
            const barcode = codes[0].value;
            if (!barcode) return;

            lastBarcode.current = barcode;
            setActive(false);
            setLoading(true);
            setErrorMsg(null);
            setErrorType(null);
            setAttempt(1);

            const { product, error } = await fetchWithRetry(barcode);

            if (product) {
                await saveToHistory(product);
                navigation.navigate('Result', { product });
            } else if (error) {
                const isTimeout = (error.message ?? '').toLowerCase().includes('timeout');
                setErrorType(isTimeout ? 'timeout' : 'generic');
                setErrorMsg(
                    isTimeout
                        ? 'Connection timed out. Check your internet and tap Retry.'
                        : `Error: ${error.message || 'Unknown'}. Tap Retry.`
                );
                setActive(false);
            } else {
                setErrorType('notfound');
                setErrorMsg('Product not found in database. Try snapping the ingredients label from the Results screen.');
                setActive(false);
            }
            setLoading(false);
            setAttempt(0);
        },
    });

    const handleRetry = () => {
        setErrorMsg(null);
        setErrorType(null);
        setActive(true);
        if (lastBarcode.current) {
            // trigger fresh lookup on the same barcode
            setActive(false);
            setLoading(true);
            fetchWithRetry(lastBarcode.current).then(async ({ product, error }) => {
                if (product) {
                    await saveToHistory(product);
                    navigation.navigate('Result', { product });
                } else {
                    setErrorMsg(error?.message ?? 'Unknown error. Tap Retry.');
                    setErrorType('generic');
                }
                setActive(true);
                setLoading(false);
            });
        }
    };

    // ── Permission gate ──────────────────────────────────────────────────────
    if (!hasPermission) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionTitle}>Camera Access Needed</Text>
                <Text style={styles.permissionDesc}>
                    Padho Label needs your camera to scan product barcodes.
                </Text>
                <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
                    <Text style={styles.permissionButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    if (!device) {
        return (
            <View style={styles.permissionContainer}>
                <Text style={styles.permissionTitle}>No Camera Found</Text>
                <Text style={styles.permissionDesc}>Could not access a back-facing camera.</Text>
            </View>
        );
    }

    const scanLineTranslateY = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 180],
    });

    return (
        <View style={styles.container}>
            {/* ── Vision Camera ── */}
            <Camera
                style={StyleSheet.absoluteFill}
                device={device}
                isActive={active && !loading}
                codeScanner={codeScanner}
            />

            {/* ── Dark overlay ── */}
            <View style={styles.overlay}>
                <View style={styles.overlayTop} />
                <View style={styles.overlayMiddle}>
                    <View style={styles.overlaySide} />
                    <View style={styles.scanFrame}>
                        <View style={[styles.corner, styles.cornerTL]} />
                        <View style={[styles.corner, styles.cornerTR]} />
                        <View style={[styles.corner, styles.cornerBL]} />
                        <View style={[styles.corner, styles.cornerBR]} />
                        {!loading && (
                            <Animated.View
                                style={[styles.scanLine, { transform: [{ translateY: scanLineTranslateY }] }]}
                            />
                        )}
                        {loading && (
                            <View style={styles.loadingFrame}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                                {attempt > 1 && (
                                    <Text style={styles.retryLabel}>Retry {attempt}/{MAX_RETRIES}</Text>
                                )}
                            </View>
                        )}
                    </View>
                    <View style={styles.overlaySide} />
                </View>
                <View style={styles.overlayBottom}>
                    <Text style={styles.hint}>
                        {loading
                            ? attempt > 1 ? `Retrying… (${attempt}/${MAX_RETRIES})` : 'Fetching product…'
                            : 'Align barcode within the frame'}
                    </Text>
                </View>
            </View>

            {/* ── Error Banner ── */}
            {errorMsg && (
                <View style={[
                    styles.errorBanner,
                    errorType === 'notfound' && styles.errorBannerWarn,
                ]}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                    <View style={styles.errorActions}>
                        {errorType !== 'notfound' && (
                            <TouchableOpacity onPress={handleRetry} style={styles.retryBtn}>
                                <RefreshCw color="#fff" size={16} />
                                <Text style={styles.retryBtnText}>Retry</Text>
                            </TouchableOpacity>
                        )}
                        <TouchableOpacity onPress={() => {
                            setErrorMsg(null); setErrorType(null); setActive(true);
                        }}>
                            <XCircle color="#fff" size={20} />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </View>
    );
}

const FRAME_SIZE = 220;
const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: Colors.background, padding: Spacing.xl },
    permissionTitle: { fontSize: 22, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm, textAlign: 'center' },
    permissionDesc: { fontSize: 15, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl, lineHeight: 22 },
    permissionButton: { backgroundColor: Colors.primary, paddingVertical: Spacing.md, paddingHorizontal: Spacing.xl, borderRadius: Radius.full },
    permissionButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    overlay: { ...StyleSheet.absoluteFillObject, flexDirection: 'column' },
    overlayTop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    overlayMiddle: { flexDirection: 'row', height: FRAME_SIZE },
    overlaySide: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
    scanFrame: { width: FRAME_SIZE, height: FRAME_SIZE, overflow: 'hidden', position: 'relative' },
    corner: { position: 'absolute', width: CORNER_SIZE, height: CORNER_SIZE, borderColor: Colors.primary },
    cornerTL: { top: 0, left: 0, borderTopWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderTopLeftRadius: 4 },
    cornerTR: { top: 0, right: 0, borderTopWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderTopRightRadius: 4 },
    cornerBL: { bottom: 0, left: 0, borderBottomWidth: CORNER_THICKNESS, borderLeftWidth: CORNER_THICKNESS, borderBottomLeftRadius: 4 },
    cornerBR: { bottom: 0, right: 0, borderBottomWidth: CORNER_THICKNESS, borderRightWidth: CORNER_THICKNESS, borderBottomRightRadius: 4 },
    scanLine: {
        position: 'absolute', top: 20, left: 12, right: 12, height: 2,
        backgroundColor: Colors.primary, borderRadius: 2, opacity: 0.9,
        shadowColor: Colors.primary, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 6,
    },
    loadingFrame: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    retryLabel: { color: Colors.primary, fontSize: 12, fontWeight: '600', marginTop: 8 },
    overlayBottom: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'flex-start', paddingTop: Spacing.xl },
    hint: { color: 'rgba(255,255,255,0.75)', fontSize: 14, fontWeight: '500', textAlign: 'center' },
    errorBanner: {
        position: 'absolute', bottom: 0, left: 0, right: 0,
        backgroundColor: Colors.danger, flexDirection: 'row',
        alignItems: 'center', justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, paddingBottom: Spacing.xl,
    },
    errorBannerWarn: { backgroundColor: Colors.warning },
    errorText: { color: '#fff', fontSize: 14, fontWeight: '500', flex: 1, marginRight: Spacing.sm },
    errorActions: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
    retryBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: Spacing.sm, paddingVertical: 4, borderRadius: Radius.sm, backgroundColor: 'rgba(255,255,255,0.25)' },
    retryBtnText: { color: '#fff', fontSize: 12, fontWeight: '700' },
});
