export type Product = {
    barcode: string;
    name: string;
    brand?: string;
    image_url?: string;
    nutrition: {
        energy_100g?: number;
        sugars_100g?: number;
        fat_100g?: number;
        saturated_fat_100g?: number;
        salt_100g?: number;
        sodium_100g?: number;
        fiber_100g?: number;
        proteins_100g?: number;
    };
    nutriscore_grade?: string;
    nova_group?: number;
};

export type RootStackParamList = {
    Home: undefined;
    Scan: undefined;
    Result: { product: Product };
    History: undefined;
    Settings: undefined;
};
