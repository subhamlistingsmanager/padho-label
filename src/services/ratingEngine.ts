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

/** Nutri-Score computation (simplified official algorithm). */
export const calculateNutriScore = (nutrition: NutritionData): RatingResult => {
    if (!hasValidNutritionData(nutrition)) {
        return { score: 0, grade: null, color: '#b2bec3', hasData: false };
    }

    let negative = 0;

    // Energy (kJ) — 1 pt per 335 kJ, max 10
    if (nutrition.energy_100g != null && nutrition.energy_100g > 0)
        negative += Math.min(10, Math.floor(nutrition.energy_100g / 335));

    // Saturated fat — 1 pt per 1 g, max 10
    if (nutrition.saturated_fat_100g != null && nutrition.saturated_fat_100g > 0)
        negative += Math.min(10, Math.floor(nutrition.saturated_fat_100g));

    // Sugars — 1 pt per 4.5 g, max 10
    if (nutrition.sugars_100g != null && nutrition.sugars_100g > 0)
        negative += Math.min(10, Math.floor(nutrition.sugars_100g / 4.5));

    // Sodium (converted from salt: salt_100g * 0.4 = sodium) — 1 pt per 90 mg, max 10
    const sodiumMg =
        nutrition.sodium_100g != null
            ? nutrition.sodium_100g * 1000
            : nutrition.salt_100g != null
                ? nutrition.salt_100g * 400 // salt → sodium
                : 0;
    if (sodiumMg > 0)
        negative += Math.min(10, Math.floor(sodiumMg / 90));

    let positive = 0;

    // Fiber — 1 pt per 0.7 g, max 5
    if (nutrition.fiber_100g != null && nutrition.fiber_100g > 0)
        positive += Math.min(5, Math.floor(nutrition.fiber_100g / 0.7));

    // Protein — 1 pt per 1.6 g, max 5
    if (nutrition.proteins_100g != null && nutrition.proteins_100g > 0)
        positive += Math.min(5, Math.floor(nutrition.proteins_100g / 1.6));

    const score = negative - positive;

    let grade: 'A' | 'B' | 'C' | 'D' | 'E';
    let color: string;

    if (score <= -1) { grade = 'A'; color = '#1b5e20'; }
    else if (score <= 2) { grade = 'B'; color = '#4caf50'; }
    else if (score <= 10) { grade = 'C'; color = '#fbc02d'; }
    else if (score <= 18) { grade = 'D'; color = '#f57c00'; }
    else { grade = 'E'; color = '#d32f2f'; }

    return { score, grade, color, hasData: true };
};
