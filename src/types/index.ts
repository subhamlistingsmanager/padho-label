export type NutritionData = {
    energy_100g?: number;
    sugars_100g?: number;
    fat_100g?: number;
    saturated_fat_100g?: number;
    salt_100g?: number;
    sodium_100g?: number;
    fiber_100g?: number;
    proteins_100g?: number;
    carbohydrates_100g?: number;
    cholesterol_mg_100g?: number;
};

export type Product = {
    barcode: string;
    name: string;
    brand?: string;
    image_url?: string;
    nutrition: NutritionData;
    nutriscore_grade?: string;
    nova_group?: number;
    ingredients?: string;
    ingredientsImageUri?: string;
    scannedAt?: number; // timestamp
    category?: 'food' | 'beauty';
    allergens?: string;
};

export type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Result: { product: Product };
    History: undefined;
    Settings: undefined;
    IngredientsSnap: { product: Product };
    Chat: { product: Product };
    Leaderboard: { category?: 'food' | 'beauty'; subCategory?: string } | undefined;
};
