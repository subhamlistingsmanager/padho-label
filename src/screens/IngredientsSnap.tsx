import React, { useRef, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { updateProductInHistory } from '../services/history';
import { Camera, CheckCircle, XCircle } from 'lucide-react-native';
import { Colors, Spacing, Radius, Shadow } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'IngredientsSnap'>;

export default function IngredientsSnap({ route, navigation }: Props) {
    const { product } = route.params;
    const cameraRef = useRef<CameraView>(null);
    const [permission, requestPermission] = useCameraPermissions();
    const [saving, setSaving] = useState(false);
    const [captured, setCaptured] = useState(false);

    const handleCapture = async () => {
        if (!cameraRef.current || saving || captured) return;
        setSaving(true);
        try {
            const photo = await cameraRef.current.takePictureAsync({ quality: 0.7 });
            if (!photo?.uri) throw new Error('No photo URI');

            // Save the image URI to the product in history
            const updated = await updateProductInHistory(product.barcode, {
                ingredientsImageUri: photo.uri,
            });

            setCaptured(true);

            // Navigate back to result with updated product
            setTimeout(() => {
                navigation.navigate('Result', {
                    product: updated ?? { ...product, ingredientsImageUri: photo.uri },
                });
            }, 800);
        } catch (e) {
            console.error('Capture failed:', e);
            setSaving(false);
        }
    };

    if (!permission) return <View style={styles.container} />;

    if (!permission.granted) {
        return (
            <View style={styles.permContainer}>
                <Text style={styles.permTitle}>Camera Access Needed</Text>
                <Text style={styles.permDesc}>
                    Grant camera access to photograph the ingredients label.
                </Text>
                <TouchableOpacity style={styles.permButton} onPress={requestPermission}>
                    <Text style={styles.permButtonText}>Grant Permission</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} />

            {/* Instruction overlay */}
            <View style={styles.topOverlay}>
                <Text style={styles.instruction}>
                    Point at the ingredients label and tap capture
                </Text>
            </View>

            {/* Capture button */}
            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[
                        styles.captureButton,
                        captured && { backgroundColor: Colors.gradeA },
                    ]}
                    onPress={handleCapture}
                    disabled={saving || captured}
                    activeOpacity={0.8}
                >
                    {saving && !captured ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : captured ? (
                        <CheckCircle color="#fff" size={32} />
                    ) : (
                        <Camera color="#fff" size={32} />
                    )}
                </TouchableOpacity>
                <Text style={styles.captureLabel}>
                    {captured ? 'Saved!' : saving ? 'Saving…' : 'Capture'}
                </Text>
            </View>

            {/* Cancel */}
            <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => navigation.goBack()}
            >
                <XCircle color="#fff" size={26} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#000' },
    permContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.background,
        padding: Spacing.xl,
    },
    permTitle: { fontSize: 20, fontWeight: '700', color: Colors.textPrimary, marginBottom: Spacing.sm },
    permDesc: { fontSize: 14, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.xl },
    permButton: {
        backgroundColor: Colors.primary,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.xl,
        borderRadius: Radius.full,
    },
    permButtonText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    topOverlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.55)',
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.lg,
        paddingHorizontal: Spacing.lg,
        alignItems: 'center',
    },
    instruction: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
        textAlign: 'center',
    },
    bottomBar: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingBottom: Spacing.xxl,
        paddingTop: Spacing.lg,
        alignItems: 'center',
    },
    captureButton: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.4)',
        ...Shadow.md,
    },
    captureLabel: {
        color: '#fff',
        fontSize: 13,
        fontWeight: '600',
        marginTop: Spacing.sm,
    },
    cancelButton: {
        position: 'absolute',
        top: Spacing.xl + 8,
        right: Spacing.lg,
    },
});
