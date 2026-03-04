import axios from 'axios';
import { Product, NutritionData } from '../types';

const PRIMARY_FOOD_URL = 'https://world.openfoodfacts.org/api/v2';
const BACKUP_FOOD_URL = 'https://it.openfoodfacts.org/api/v2';
const BEAUTY_URL = 'https://world.openbeautyfacts.org/api/v2';

const FIELDS = [
    'product_name',
    'brands',
    'image_url',
    'nutriments',
    'nutrition_grades',
    'nova_group',
    'ingredients_text',
    'ingredients_text_en',
    'additives_tags',
    'allergens_from_ingredients',
].join(',');

function safeNum(val: any): number | undefined {
    const n = parseFloat(val);
    return isNaN(n) ? undefined : n;
}

const performLookup = async (baseUrl: string, barcode: string) => {
    try {
        const response = await axios.get(`${baseUrl}/product/${barcode}.json`, {
            params: { fields: FIELDS },
            timeout: 8000,
        });
        if (response.data.status === 0 || !response.data.product) return null;
        return response.data.product;
    } catch (e) {
        return null;
    }
};

export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
    try {
        // 1. Try Primary Food API
        let productData = await performLookup(PRIMARY_FOOD_URL, barcode);

        // 2. Try Backup Food API if primary fails
        if (!productData) {
            productData = await performLookup(BACKUP_FOOD_URL, barcode);
        }

        // 3. Try Beauty Facts API if food fails
        let isCosmetic = false;
        if (!productData) {
            productData = await performLookup(BEAUTY_URL, barcode);
            if (productData) isCosmetic = true;
        }

        if (!productData) return null;

        const n = productData.nutriments || {};
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
            productData.ingredients_text_en ||
            productData.ingredients_text ||
            undefined;

        return {
            barcode,
            name: productData.product_name || 'Unknown Product',
            brand: productData.brands || undefined,
            image_url: productData.image_url || undefined,
            nutrition,
            nutriscore_grade: productData.nutrition_grades || undefined,
            nova_group: productData.nova_group || undefined,
            ingredients: ingredientsRaw
                ? String(ingredientsRaw).trim() || undefined
                : undefined,
            scannedAt: Date.now(),
            category: isCosmetic ? 'beauty' : 'food',
            allergens: productData.allergens_from_ingredients,
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};
