export type Flag = {
    type: 'red' | 'green';
    title: string;
    description: string;
};

export const deriveFlags = (nutrition: any, novaGroup?: number): Flag[] => {
    const flags: Flag[] = [];

    // Red Flags
    if (nutrition.sugars_100g > 15) {
        flags.push({
            type: 'red',
            title: 'High Sugar',
            description: `${nutrition.sugars_100g}g per 100g is very high.`
        });
    }

    if (nutrition.salt_100g > 1.5) {
        flags.push({
            type: 'red',
            title: 'High Salt',
            description: `Contains ${nutrition.salt_100g}g of salt per 100g.`
        });
    }

    if (novaGroup === 4) {
        flags.push({
            type: 'red',
            title: 'Ultra-Processed',
            description: 'Contains many additives and industrial ingredients.'
        });
    }

    // Green Flags
    if (nutrition.fiber_100g > 6) {
        flags.push({
            type: 'green',
            title: 'High Fiber',
            description: 'Excellent source of dietary fiber.'
        });
    }

    if (nutrition.proteins_100g > 10) {
        flags.push({
            type: 'green',
            title: 'High Protein',
            description: 'Good source of protein.'
        });
    }

    if (nutrition.sugars_100g < 5) {
        flags.push({
            type: 'green',
            title: 'Low Sugar',
            description: 'This product is low in sugar.'
        });
    }

    return flags;
};
