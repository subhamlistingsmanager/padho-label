import axios from 'axios';
import { Product } from '../types';

const BASE_URL = 'https://world.openfoodfacts.org/api/v2';

export const getProductByBarcode = async (barcode: string): Promise<Product | null> => {
    try {
        const response = await axios.get(`${BASE_URL}/product/${barcode}.json`, {
            params: {
                fields: 'product_name,brands,image_url,nutriments,nutrition_grades,nova_group'
            }
        });

        if (response.data.status === 0) {
            return null;
        }

        const { product } = response.data;
        const nutriments = product.nutriments || {};

        return {
            barcode,
            name: product.product_name || 'Unknown Product',
            brand: product.brands,
            image_url: product.image_url,
            nutrition: {
                energy_100g: nutriments['energy-kj_100g'] || nutriments['energy-kcal_100g'],
                sugars_100g: nutriments.sugars_100g,
                fat_100g: nutriments.fat_100g,
                saturated_fat_100g: nutriments['saturated-fat_100g'],
                salt_100g: nutriments.salt_100g,
                sodium_100g: nutriments.sodium_100g,
                fiber_100g: nutriments.fiber_100g,
                proteins_100g: nutriments.proteins_100g,
            },
            nutriscore_grade: product.nutrition_grades,
            nova_group: product.nova_group,
        };
    } catch (error) {
        console.error('Error fetching product:', error);
        throw error;
    }
};
