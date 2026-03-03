/**
 * additivesService.ts
 *
 * Scans ingredients text for known food additives (E-numbers and names)
 * and categorizes them by concern level.
 */

export type ConcernLevel = 'minimal' | 'moderate' | 'high';

export type Additive = {
    id: string; // E-number or common name
    name: string;
    level: ConcernLevel;
    description: string;
};

const ADDITIVES_DB: Additive[] = [
    { id: 'E500', name: 'Sodium Carbonates', level: 'minimal', description: 'Common leavening agent (baking soda). Generally safe.' },
    { id: 'E503', name: 'Ammonium Carbonates', level: 'minimal', description: 'Leavening agent used in crackers and cookies.' },
    { id: 'E330', name: 'Citric Acid', level: 'minimal', description: 'Natural preservative/acidifier found in citrus fruits.' },
    { id: 'E322', name: 'Lecithins', level: 'minimal', description: 'Natural emulsifier often derived from soy or sunflower.' },
    { id: 'E440', name: 'Pectins', level: 'minimal', description: 'Natural thickener derived from fruits.' },
    { id: 'E415', name: 'Xanthan Gum', level: 'minimal', description: 'Common thickener produced by fermentation.' },

    { id: 'E621', name: 'Monosodium Glutamate', level: 'moderate', description: 'Flavor enhancer (MSG). Some people may be sensitive to it.' },
    { id: 'E211', name: 'Sodium Benzoate', level: 'moderate', description: 'Preservative. Some studies suggest a link to hyperactivity when combined with certain colors.' },
    { id: 'E202', name: 'Potassium Sorbate', level: 'minimal', description: 'Common preservative used to inhibit mold growth.' },
    { id: 'E150c', name: 'Ammonia Caramel', level: 'moderate', description: 'Coloring agent. Some concerns over byproducts formed during manufacture.' },

    { id: 'E102', name: 'Tartrazine', level: 'high', description: 'Artificial yellow dye. Linked to hyperactivity in children; requires warning in EU.' },
    { id: 'E110', name: 'Sunset Yellow', level: 'high', description: 'Artificial orange dye. Linked to hyperactivity in children.' },
    { id: 'E129', name: 'Allura Red', level: 'high', description: 'Artificial red dye. Linked to hyperactivity in children.' },
    { id: 'E951', name: 'Aspartame', level: 'moderate', description: 'Artificial sweetener. Extensively studied; some controversy but generally considered safe in moderate amounts.' },
    { id: 'E250', name: 'Sodium Nitrite', level: 'high', description: 'Preservative used in processed meats. Linked to increased risk of certain cancers.' },
];

/**
 * Scans a string for additives in the database.
 */
export const findAdditives = (ingredientsText: string): Additive[] => {
    const text = ingredientsText.toLowerCase();
    const found: Additive[] = [];

    // Find by ID (E-number) or Name
    ADDITIVES_DB.forEach(additive => {
        const idRegex = new RegExp(`\\b${additive.id}\\b`, 'i');
        const nameRegex = new RegExp(`\\b${additive.name}\\b`, 'i');

        if (idRegex.test(text) || nameRegex.test(text)) {
            found.push(additive);
        }
    });

    return found;
};
