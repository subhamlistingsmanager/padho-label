import React, { useState, useRef, useEffect } from 'react';
import {
    Text, View, StyleSheet, TouchableOpacity,
    ActivityIndicator, Animated,
} from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { getProductByBarcode } from '../services/api';
import { saveToHistory } from '../services/history';
import { XCircle } from 'lucide-react-native';
import { Colors, Spacing, Radius, Typography } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Scan'>;

export default function ScanScreen({ navigation }: Props) {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // Animate the scan line
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

    const handleBarCodeScanned = async (result: BarcodeScanningResult) => {
        if (scanned || loading) return;
        setScanned(true);
        setLoading(true);
        setErrorMsg(null);

        try {
            const product = await getProductByBarcode(result.data);
            if (product) {
                await saveToHistory(product);
                navigation.navigate('Result', { product });
            } else {
                setErrorMsg('Product not found. Try a different barcode.');
                setScanned(false);
            }
        } catch {
            setErrorMsg('Connection error. Please check your internet.');
            setScanned(false);
        } finally {
            setLoading(false);
        }
    };

    if (!permission) {
        return <View style={styles.container} />;
    }

    if (!permission.granted) {
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

    const scanLineTranslateY = scanLineAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 180],
    });

    return (
        <View style={styles.container}>
            <CameraView
                style={StyleSheet.absoluteFill}
                onBarcodeScanned={(!scanned && !loading) ? handleBarCodeScanned : undefined}
                barcodeScannerSettings={{
                    barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
                }}
            />

            {/* Dark overlay – top, bottom, sides */}
            <View style={styles.overlay}>
                <View style={styles.overlayTop} />
                <View style={styles.overlayMiddle}>
                    <View style={styles.overlaySide} />
                    {/* Scan Frame */}
                    <View style={styles.scanFrame}>
                        {/* Corner brackets */}
                        <View style={[styles.corner, styles.cornerTL]} />
                        <View style={[styles.corner, styles.cornerTR]} />
                        <View style={[styles.corner, styles.cornerBL]} />
                        <View style={[styles.corner, styles.cornerBR]} />

                        {/* Scan line */}
                        {!loading && (
                            <Animated.View
                                style={[styles.scanLine, { transform: [{ translateY: scanLineTranslateY }] }]}
                            />
                        )}

                        {/* Loading inside frame */}
                        {loading && (
                            <View style={styles.loadingFrame}>
                                <ActivityIndicator size="large" color={Colors.primary} />
                            </View>
                        )}
                    </View>
                    <View style={styles.overlaySide} />
                </View>
                <View style={styles.overlayBottom}>
                    <Text style={styles.hint}>
                        {loading ? 'Fetching product…' : 'Align barcode within the frame'}
                    </Text>
                </View>
            </View>

            {/* Error Banner */}
            {errorMsg && (
                <View style={styles.errorBanner}>
                    <Text style={styles.errorText}>{errorMsg}</Text>
                    <TouchableOpacity onPress={() => setErrorMsg(null)}>
                        <XCircle color="#fff" size={20} />
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const FRAME_SIZE = 220;
const CORNER_SIZE = 24;
const CORNER_THICKNESS = 3;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
    },
    permissionContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: Spacing.xl,
    },
    permissionTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: Spacing.sm,
        textAlign: 'center',
    },
    permissionDesc: {
        fontSize: 15,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 22,
    },
    permissionButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: Radius.full,
    },
    permissionButtonText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        flexDirection: 'column',
    },
    overlayTop: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    overlayMiddle: {
        flexDirection: 'row',
        height: FRAME_SIZE,
    },
    overlaySide: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
    },
    scanFrame: {
        width: FRAME_SIZE,
        height: FRAME_SIZE,
        overflow: 'hidden',
        position: 'relative',
    },
    corner: {
        position: 'absolute',
        width: CORNER_SIZE,
        height: CORNER_SIZE,
        borderColor: Colors.primary,
    },
    cornerTL: {
        top: 0,
        left: 0,
        borderTopWidth: CORNER_THICKNESS,
        borderLeftWidth: CORNER_THICKNESS,
        borderTopLeftRadius: 4,
    },
    cornerTR: {
        top: 0,
        right: 0,
        borderTopWidth: CORNER_THICKNESS,
        borderRightWidth: CORNER_THICKNESS,
        borderTopRightRadius: 4,
    },
    cornerBL: {
        bottom: 0,
        left: 0,
        borderBottomWidth: CORNER_THICKNESS,
        borderLeftWidth: CORNER_THICKNESS,
        borderBottomLeftRadius: 4,
    },
    cornerBR: {
        bottom: 0,
        right: 0,
        borderBottomWidth: CORNER_THICKNESS,
        borderRightWidth: CORNER_THICKNESS,
        borderBottomRightRadius: 4,
    },
    scanLine: {
        position: 'absolute',
        top: 20,
        left: 12,
        right: 12,
        height: 2,
        backgroundColor: Colors.primary,
        borderRadius: 2,
        opacity: 0.9,
        shadowColor: Colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 6,
    },
    loadingFrame: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    overlayBottom: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: Spacing.xl,
    },
    hint: {
        color: 'rgba(255,255,255,0.75)',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
    errorBanner: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: Colors.danger,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: Spacing.lg,
        paddingVertical: Spacing.md,
        paddingBottom: Spacing.xl,
    },
    errorText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '500',
        flex: 1,
        marginRight: Spacing.sm,
    },
});
