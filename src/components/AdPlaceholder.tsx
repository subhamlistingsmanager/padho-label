import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const AdBannerPlaceholder = () => (
    <View style={styles.banner}>
        <Text style={styles.text}>Ad Banner Placeholder</Text>
    </View>
);

const styles = StyleSheet.create({
    banner: {
        width: '100%',
        height: 60,
        backgroundColor: '#dfe6e9',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 10,
        borderWidth: 1,
        borderColor: '#b2bec3',
        borderStyle: 'dashed',
    },
    text: {
        color: '#636e72',
        fontSize: 12,
        fontWeight: 'bold',
    },
});
