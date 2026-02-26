import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
    grade: string;
    color: string;
    size?: 'small' | 'large';
}

export const RatingBadge = ({ grade, color, size = 'large' }: Props) => {
    const badgeSize = size === 'large' ? 100 : 40;
    const fontSize = size === 'large' ? 48 : 18;

    return (
        <View style={[
            styles.badge,
            { backgroundColor: color, width: badgeSize, height: badgeSize, borderRadius: badgeSize / 2 }
        ]}>
            <Text style={[styles.text, { fontSize }]}>{grade}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    badge: {
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    text: {
        fontWeight: '900',
        color: '#fff',
    },
});
