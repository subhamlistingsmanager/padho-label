import { NutritionData } from '../types';

export type RatingResult = {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'E' | null;
    color: string;
    hasData: boolean;
};

const KEY_FIELDS: (keyof NutritionData)[] = [
    'energy_100g',
    'sugars_100g',
    'fat_100g',
    'saturated_fat_100g',
    'proteins_100g',
    'salt_100g',
];

/**
 * Returns true only when at least 3 of the 6 key nutritional fields
 * are present and non-zero. Prevents a score of 0 from appearing as "B".
 */
export const hasValidNutritionData = (nutrition: NutritionData): boolean => {
    const presentCount = KEY_FIELDS.filter(
        k => nutrition[k] !== undefined && nutrition[k] !== null
    ).length;
    return presentCount >= 3;
};

/**
 * RDA Standards (Typical Adult, approx. 2000 kcal)
 * Values based on general nutrition guidelines.
 */
export const RDA = {
    energy: 2000, // kcal
    fat: 70, // g
    saturated_fat: 20, // g
    carbohydrates: 260, // g
    sugars: 50, // g
    proteins: 50, // g
    fiber: 30, // g
    salt: 6, // g
    sodium: 2400, // mg
};

export type NutrientStatus = 'positive' | 'negative' | 'fair' | 'low';

export type EnhancedRatingResult = RatingResult & {
    nutrients: Record<string, {
        value: number;
        unit: string;
        rdaPercentage: number;
        status: NutrientStatus;
    }>;
};

/**
 * Classifies a nutrient's value into a status.
 */
export const getNutrientStatus = (type: string, val: number): NutrientStatus => {
    switch (type) {
        case 'sugars': return val > 15 ? 'negative' : val < 5 ? 'positive' : 'fair';
        case 'saturated_fat': return val > 5 ? 'negative' : val < 1.5 ? 'positive' : 'fair';
        case 'salt': return val > 1.5 ? 'negative' : val < 0.3 ? 'positive' : 'fair';
        case 'fiber': return val > 6 ? 'positive' : val > 3 ? 'fair' : 'low';
        case 'proteins': return val > 10 ? 'positive' : 'fair';
        case 'energy': return val > 400 ? 'negative' : val < 100 ? 'positive' : 'fair';
        default: return 'fair';
    }
};

/** Nutri-Score computation (simplified official algorithm) + RDA + Status. */
export const calculateNutriScore = (nutrition: NutritionData): EnhancedRatingResult => {
    if (!hasValidNutritionData(nutrition)) {
        return { score: 0, grade: null, color: '#b2bec3', hasData: false, nutrients: {} };
    }

    let negative = 0;

    // Energy (kJ) — 1 pt per 335 kJ, max 10
    const energyKj = nutrition.energy_100g || 0;
    if (energyKj > 0) negative += Math.min(10, Math.floor(energyKj / 335));

    // Saturated fat — 1 pt per 1 g, max 10
    const satFat = nutrition.saturated_fat_100g || 0;
    if (satFat > 0) negative += Math.min(10, Math.floor(satFat));

    // Sugars — 1 pt per 4.5 g, max 10
    const sugars = nutrition.sugars_100g || 0;
    if (sugars > 0) negative += Math.min(10, Math.floor(sugars / 4.5));

    // Sodium (converted from salt: salt_100g * 0.4 = sodium) — 1 pt per 90 mg, max 10
    const sodiumMg =
        nutrition.sodium_100g != null
            ? nutrition.sodium_100g * 1000
            : nutrition.salt_100g != null
                ? nutrition.salt_100g * 400
                : 0;
    if (sodiumMg > 0) negative += Math.min(10, Math.floor(sodiumMg / 90));

    let positive = 0;

    // Fiber — 1 pt per 0.7 g, max 5
    const fiber = nutrition.fiber_100g || 0;
    if (fiber > 0) positive += Math.min(5, Math.floor(fiber / 0.7));

    // Protein — 1 pt per 1.6 g, max 5
    const proteins = nutrition.proteins_100g || 0;
    if (proteins > 0) positive += Math.min(5, Math.floor(proteins / 1.6));

    const score = negative - positive;

    let grade: 'A' | 'B' | 'C' | 'D' | 'E';
    let color: string;

    if (score <= -1) { grade = 'A'; color = '#1b5e20'; }
    else if (score <= 2) { grade = 'B'; color = '#4caf50'; }
    else if (score <= 10) { grade = 'C'; color = '#fbc02d'; }
    else if (score <= 18) { grade = 'D'; color = '#f57c00'; }
    else { grade = 'E'; color = '#d32f2f'; }

    // Enhanced Nutrient Data
    const nutrients: EnhancedRatingResult['nutrients'] = {};
    const kcal = Math.round(energyKj / 4.184);

    nutrients['energy'] = {
        value: kcal,
        unit: 'kcal',
        rdaPercentage: Math.round((kcal / RDA.energy) * 100),
        status: getNutrientStatus('energy', kcal),
    };
    nutrients['fat'] = {
        value: nutrition.fat_100g || 0,
        unit: 'g',
        rdaPercentage: Math.round(((nutrition.fat_100g || 0) / RDA.fat) * 100),
        status: 'fair',
    };
    nutrients['saturated_fat'] = {
        value: satFat,
        unit: 'g',
        rdaPercentage: Math.round((satFat / RDA.saturated_fat) * 100),
        status: getNutrientStatus('saturated_fat', satFat),
    };
    nutrients['sugars'] = {
        value: sugars,
        unit: 'g',
        rdaPercentage: Math.round((sugars / RDA.sugars) * 100),
        status: getNutrientStatus('sugars', sugars),
    };
    nutrients['proteins'] = {
        value: proteins,
        unit: 'g',
        rdaPercentage: Math.round((proteins / RDA.proteins) * 100),
        status: getNutrientStatus('proteins', proteins),
    };
    nutrients['fiber'] = {
        value: fiber,
        unit: 'g',
        rdaPercentage: Math.round((fiber / RDA.fiber) * 100),
        status: getNutrientStatus('fiber', fiber),
    };
    nutrients['sodium'] = {
        value: sodiumMg,
        unit: 'mg',
        rdaPercentage: Math.round((sodiumMg / RDA.sodium) * 100),
        status: getNutrientStatus('salt', (nutrition.salt_100g || 0)), // Use salt threshold for status
    };

    return { score, grade, color, hasData: true, nutrients };
};
