import axios from 'axios';
import { Product, NutritionData } from '../types';

const BASE_URL = 'https://world.openfoodfacts.org/api/v2';

const FIELDS = [
    'product_name',
    'brands',
    'image_url',
    'nutriments',
    'nutrition_grades',
    'nova_group',
    'ingredients_text',
    'ingredients_text_en',
].join(',');

function safeNum(val: any): number | undefined {
    const n = parseFloat(val);
    return isNaN(n) ? undefined : n;
}

export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/product/${barcode}.json`, {
            params: { fields: FIELDS },
            timeout: 10000,
        });

        if (response.data.status === 0 || !response.data.product) {
            return null;
        }

        const { product } = response.data;
        const n = product.nutriments || {};

        const nutrition: NutritionData = {
            energy_100g: safeNum(n['energy-kj_100g']) ?? safeNum(n['energy-kcal_100g']),
            sugars_100g: safeNum(n.sugars_100g),
            fat_100g: safeNum(n.fat_100g),
            saturated_fat_100g: safeNum(n['saturated-fat_100g']),
            salt_100g: safeNum(n.salt_100g),
            sodium_100g: safeNum(n.sodium_100g),
            fiber_100g: safeNum(n.fiber_100g),
            proteins_100g: safeNum(n.proteins_100g),
            carbohydrates_100g: safeNum(n.carbohydrates_100g),
            cholesterol_mg_100g: safeNum(n['cholesterol_100g'])
                ? safeNum(n['cholesterol_100g'])! * 1000
                : undefined,
        };

        const ingredientsRaw =
            product.ingredients_text_en ||
            product.ingredients_text ||
            undefined;

        return {
            barcode,
            name: product.product_name || 'Unknown Product',
            brand: product.brands || undefined,
            image_url: product.image_url || undefined,
            nutrition,
            nutriscore_grade: product.nutrition_grades || undefined,
            nova_group: product.nova_group || undefined,
            ingredients: ingredientsRaw
                ? String(ingredientsRaw).trim() || undefined
                : undefined,
            scannedAt: Date.now(),
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};
