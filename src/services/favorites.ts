import AsyncStorage from '@react-native-async-storage/async-storage';

const FAVORITES_KEY = '@padho_label_favorites';

export type FavoriteItem = {
    barcode: string;
    name: string;
    brand?: string;
    image_url?: string;
    grade: string;
    score: number;
    category: 'food' | 'beauty';
    subCategory: string;
    savedAt: number;
};

export const saveFavorite = async (item: FavoriteItem): Promise<void> => {
    try {
        const existing = await getFavorites();
        const filtered = existing.filter(f => f.barcode !== item.barcode);
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify([item, ...filtered]));
    } catch (e) {
        console.error('Error saving favorite:', e);
    }
};

export const removeFavorite = async (barcode: string): Promise<void> => {
    try {
        const existing = await getFavorites();
        await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(existing.filter(f => f.barcode !== barcode)));
    } catch (e) {
        console.error('Error removing favorite:', e);
    }
};

export const getFavorites = async (): Promise<FavoriteItem[]> => {
    try {
        const json = await AsyncStorage.getItem(FAVORITES_KEY);
        return json ? JSON.parse(json) : [];
    } catch (e) {
        return [];
    }
};

export const isFavorite = async (barcode: string): Promise<boolean> => {
    const favs = await getFavorites();
    return favs.some(f => f.barcode === barcode);
};

export const toggleFavorite = async (item: FavoriteItem): Promise<boolean> => {
    const already = await isFavorite(item.barcode);
    if (already) {
        await removeFavorite(item.barcode);
        return false;
    } else {
        await saveFavorite(item);
        return true;
    }
};
