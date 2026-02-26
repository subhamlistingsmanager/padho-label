import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product } from '../types';

const HISTORY_KEY = '@padho_label_history';

export const saveToHistory = async (product: Product) => {
    try {
        const existingHistory = await getHistory();
        // Check if product already exists (by barcode)
        const filteredHistory = existingHistory.filter(p => p.barcode !== product.barcode);
        const newHistory = [product, ...filteredHistory].slice(0, 50); // Keep last 50
        await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    } catch (error) {
        console.error('Error saving to history:', error);
    }
};

export const getHistory = async (): Promise<Product[]> => {
    try {
        const historyJson = await AsyncStorage.getItem(HISTORY_KEY);
        return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
        console.error('Error getting history:', error);
        return [];
    }
};

export const clearHistory = async () => {
    try {
        await AsyncStorage.removeItem(HISTORY_KEY);
    } catch (error) {
        console.error('Error clearing history:', error);
    }
};
