export type RatingResult = {
    score: number;
    grade: 'A' | 'B' | 'C' | 'D' | 'E';
    color: string;
};

// Simplified Nutri-Score calculation
export const calculateNutriScore = (nutrition: any): RatingResult => {
    let score = 0;

    // Negative points (Higher is worse)
    // Energy (kJ/100g): 1pt per 335kJ
    if (nutrition.energy_100g) score += Math.min(10, Math.floor(nutrition.energy_100g / 335));

    // Saturated Fat (g/100g): 1pt per 1g
    if (nutrition.saturated_fat_100g) score += Math.min(10, Math.floor(nutrition.saturated_fat_100g));

    // Sugars (g/100g): 1pt per 4.5g
    if (nutrition.sugars_100g) score += Math.min(10, Math.floor(nutrition.sugars_100g / 4.5));

    // Sodium (mg/100g): 1pt per 90mg
    if (nutrition.sodium_100g) score += Math.min(10, Math.floor((nutrition.sodium_100g * 1000) / 90));

    // Positive points (Higher is better)
    let positivePoints = 0;
    // Fiber (g/100g): 1pt per 0.7g
    if (nutrition.fiber_100g) positivePoints += Math.min(5, Math.floor(nutrition.fiber_100g / 0.7));

    // Protein (g/100g): 1pt per 1.6g
    if (nutrition.proteins_100g) positivePoints += Math.min(5, Math.floor(nutrition.proteins_100g / 1.6));

    score -= positivePoints;

    // Map score to A-E
    let grade: 'A' | 'B' | 'C' | 'D' | 'E';
    let color: string;

    if (score <= -1) {
        grade = 'A';
        color = '#1b5e20'; // Dark Green
    } else if (score <= 2) {
        grade = 'B';
        color = '#4caf50'; // Light Green
    } else if (score <= 10) {
        grade = 'C';
        color = '#fbc02d'; // Yellow
    } else if (score <= 18) {
        grade = 'D';
        color = '#f57c00'; // Orange
    } else {
        grade = 'E';
        color = '#d32f2f'; // Red
    }

    return { score, grade, color };
};
