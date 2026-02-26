import React, { useState } from 'react';
import {
    View, Text, StyleSheet, Switch,
    TouchableOpacity, ScrollView, Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import { ChevronRight, Globe, Info, Trash2, ShieldCheck, Heart } from 'lucide-react-native';
import { clearHistory } from '../services/history';
import { Colors, Spacing, Radius, Shadow, Typography, APP_VERSION } from '../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export default function SettingsScreen({ navigation }: Props) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [region] = useState('India');

    const handleClearHistory = async () => {
        Alert.alert(
            'Clear History',
            'Are you sure you want to delete all scan history? This cannot be undone.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear',
                    style: 'destructive',
                    onPress: async () => {
                        await clearHistory();
                        Alert.alert('Done', 'Your scan history has been cleared.');
                    },
                },
            ]
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>

            {/* Preferences */}
            <Text style={styles.sectionHeader}>Preferences</Text>
            <View style={styles.card}>
                <View style={styles.settingItem}>
                    <View style={styles.itemLeft}>
                        <View style={[styles.iconWrap, { backgroundColor: '#e3f2fd' }]}>
                            <Info size={18} color={Colors.info} />
                        </View>
                        <Text style={styles.settingLabel}>Show Advanced Info</Text>
                    </View>
                    <Switch
                        value={showAdvanced}
                        onValueChange={setShowAdvanced}
                        trackColor={{ false: Colors.border, true: Colors.primary }}
                        thumbColor="#fff"
                    />
                </View>
                <View style={styles.divider} />
                <TouchableOpacity style={styles.settingItem}>
                    <View style={styles.itemLeft}>
                        <View style={[styles.iconWrap, { backgroundColor: Colors.primaryLight }]}>
                            <Globe size={18} color={Colors.primary} />
                        </View>
                        <Text style={styles.settingLabel}>Region</Text>
                    </View>
                    <View style={styles.itemRight}>
                        <Text style={styles.itemValue}>{region}</Text>
                        <ChevronRight size={18} color={Colors.textMuted} />
                    </View>
                </TouchableOpacity>
            </View>

            {/* Data */}
            <Text style={styles.sectionHeader}>Data</Text>
            <View style={styles.card}>
                <TouchableOpacity style={styles.settingItem} onPress={handleClearHistory}>
                    <View style={styles.itemLeft}>
                        <View style={[styles.iconWrap, { backgroundColor: '#fff5f5' }]}>
                            <Trash2 size={18} color={Colors.danger} />
                        </View>
                        <Text style={[styles.settingLabel, { color: Colors.danger }]}>Clear Scan History</Text>
                    </View>
                </TouchableOpacity>
            </View>

            {/* About */}
            <Text style={styles.sectionHeader}>About</Text>
            <View style={styles.card}>
                <View style={styles.settingItem}>
                    <View style={styles.itemLeft}>
                        <View style={[styles.iconWrap, { backgroundColor: Colors.primaryLight }]}>
                            <ShieldCheck size={18} color={Colors.primary} />
                        </View>
                        <Text style={styles.settingLabel}>Padho Label</Text>
                    </View>
                    <Text style={styles.itemValue}>v{APP_VERSION}</Text>
                </View>
                <View style={styles.divider} />
                <View style={styles.settingItem}>
                    <View style={styles.itemLeft}>
                        <View style={[styles.iconWrap, { backgroundColor: '#fce4ec' }]}>
                            <Heart size={18} color="#e91e63" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.settingLabel}>Nutrition Data</Text>
                            <Text style={styles.settingSubLabel}>Powered by Open Food Facts</Text>
                        </View>
                    </View>
                </View>
            </View>

            <Text style={styles.footer}>
                Padho Label helps you make informed food choices. Always consult a nutritionist for personalised advice.
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    sectionHeader: {
        ...Typography.label,
        marginHorizontal: Spacing.lg,
        marginTop: Spacing.lg,
        marginBottom: Spacing.sm,
    },
    card: {
        backgroundColor: Colors.card,
        marginHorizontal: Spacing.md,
        borderRadius: Radius.lg,
        ...Shadow.sm,
        overflow: 'hidden',
    },
    divider: {
        height: 1,
        backgroundColor: Colors.border,
        marginLeft: Spacing.md + 44,
    },
    settingItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.md,
    },
    itemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconWrap: {
        width: 34,
        height: 34,
        borderRadius: Radius.sm,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: Spacing.md,
    },
    settingLabel: {
        fontSize: 15,
        color: Colors.textPrimary,
        fontWeight: '500',
    },
    settingSubLabel: {
        fontSize: 12,
        color: Colors.textMuted,
        marginTop: 2,
    },
    itemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    itemValue: {
        fontSize: 14,
        color: Colors.textMuted,
    },
    footer: {
        fontSize: 12,
        color: Colors.textMuted,
        textAlign: 'center',
        marginTop: Spacing.xl,
        marginHorizontal: Spacing.xl,
        lineHeight: 18,
    },
});
