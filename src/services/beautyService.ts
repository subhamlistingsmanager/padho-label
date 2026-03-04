export type ChemicalConcern = 'low' | 'moderate' | 'high';

export type Chemical = {
    name: string;
    level: ChemicalConcern;
    description: string;
};

const CHEMICAL_DB: Record<string, { level: ChemicalConcern, desc: string }> = {
    'paraben': { level: 'high', desc: 'Possible endocrine disruptor.' },
    'sulfate': { level: 'moderate', desc: 'Can be drying or irritating to skin.' },
    'sodium lauryl sulfate': { level: 'high', desc: 'Strong skin irritant.' },
    'fragrance': { level: 'moderate', desc: 'Common allergen and irritant.' },
    'perfum': { level: 'moderate', desc: 'Common allergen and irritant.' },
    'phthalate': { level: 'high', desc: 'Linked to hormonal issues.' },
    'mineral oil': { level: 'low', desc: 'Can clog pores in some skin types.' },
    'alcohol denat': { level: 'moderate', desc: 'Can be very drying to skin.' },
    'silicone': { level: 'low', desc: 'Provides smooth feel, but can trap sweat.' },
    'dimethicone': { level: 'low', desc: 'Common silicone, generally safe.' },
    'phenoxyethanol': { level: 'moderate', desc: 'Preservative, can be irritating in high concentrations.' },
};

export function findChemicals(ingredientsText: string): Chemical[] {
    const found: Chemical[] = [];
    const lowerText = ingredientsText.toLowerCase();

    for (const [name, info] of Object.entries(CHEMICAL_DB)) {
        if (lowerText.includes(name)) {
            found.push({
                name: name.charAt(0).toUpperCase() + name.slice(1),
                level: info.level,
                description: info.desc
            });
        }
    }
    return found;
}

export function calculateSafetyScore(chemicals: Chemical[]) {
    const highCount = chemicals.filter(c => c.level === 'high').length;
    const moderateCount = chemicals.filter(c => c.level === 'moderate').length;

    if (highCount > 0) return { grade: 'D', color: '#D32F2F', label: 'Unsafe' };
    if (moderateCount > 2) return { grade: 'C', color: '#FF9800', label: 'Average' };
    if (moderateCount > 0) return { grade: 'B', color: '#4CAF50', label: 'Safe' };
    return { grade: 'A', color: '#1B5E20', label: 'Very Safe' };
}
