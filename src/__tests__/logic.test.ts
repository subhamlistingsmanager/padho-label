import { calculateNutriScore } from '../services/ratingEngine';
import { deriveFlags } from '../services/flagDerivation';

describe('Rating Engine', () => {
    test('calculates Nutri-Score A for healthy product', () => {
        const nutrition = {
            energy_100g: 100,
            saturated_fat_100g: 0,
            sugars_100g: 1,
            sodium_100g: 0.01,
            fiber_100g: 10,
            proteins_100g: 10,
        };
        const result = calculateNutriScore(nutrition);
        expect(result.grade).toBe('A');
    });

    test('calculates Nutri-Score E for unhealthy product', () => {
        const nutrition = {
            energy_100g: 2500,
            saturated_fat_100g: 20,
            sugars_100g: 40,
            sodium_100g: 1,
            fiber_100g: 0,
            proteins_100g: 1,
        };
        const result = calculateNutriScore(nutrition);
        expect(result.grade).toBe('E');
    });
});

describe('Flag Derivation', () => {
    test('identifies high sugar red flag', () => {
        const nutrition = { sugars_100g: 20 };
        const flags = deriveFlags(nutrition);
        expect(flags.some(f => f.title === 'High Sugar')).toBe(true);
    });

    test('identifies high fiber green flag', () => {
        const nutrition = { fiber_100g: 8 };
        const flags = deriveFlags(nutrition);
        expect(flags.some(f => f.title === 'High Fiber')).toBe(true);
    });
});
