/**
 * ocrNutrition.ts
 *
 * Sends an image to the Open Food Facts OCR API to extract text,
 * then parses the text with regex patterns to extract nutritional values.
 *
 * Falls back to pure local regex if the API call fails (offline/error).
 */

import axios from 'axios';
import { NutritionData } from '../types';

// ─── OCR via Open Food Facts ────────────────────────────────────────────────

/**
 * Call the Open Food Facts OCR endpoint with a base64 image.
 * Returns the full recognised text string, or null on failure.
 */
export const runOCROnImage = async (imageUri: string): Promise<string | null> => {
    try {
        // Fetch the image as a blob and convert to base64
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const base64 = await blobToBase64(blob);

        // Open Food Facts OCR endpoint (free, no auth needed)
        const ocrResponse = await axios.post(
            'https://world.openfoodfacts.org/cgi/product_jqm2.pl',
            {
                // We fire the image as a temporary ingredient scan
                imgupload_ingredients: base64,
                code: '0000000000000', // dummy barcode for OCR-only use
                comment: 'Padho Label OCR scan',
            },
            {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                timeout: 15000,
            }
        );

        // Extract text from the OCR response
        const ocrText: string | undefined = ocrResponse.data?.ingredients_text_with_allergens
            ?? ocrResponse.data?.ingredients_text
            ?? undefined;

        return ocrText || null;
    } catch {
        return null;
    }
};

/** Convert a blob to base64 string. */
const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const result = reader.result as string;
            // Strip the data URL prefix (data:image/jpeg;base64,...)
            resolve(result.split(',')[1] ?? result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });

// ─── Regex Nutrition Parser ─────────────────────────────────────────────────

/**
 * Parse raw OCR text (from a nutrition label) into a NutritionData object.
 * Handles common label formats from major markets.
 */
export const parseNutritionFromText = (text: string): Partial<NutritionData> => {
    const t = text.toLowerCase().replace(/\s+/g, ' ');
    const result: Partial<NutritionData> = {};

    const num = (pattern: RegExp): number | undefined => {
        const m = t.match(pattern);
        if (!m) return undefined;
        const n = parseFloat(m[1].replace(',', '.'));
        return isNaN(n) ? undefined : n;
    };

    // Energy — kJ preferred; fallback kcal (multiply by 4.184)
    const energyKj = num(/energ(?:y|ie)[^\d]*(\d+[\.,]?\d*)\s*kj/);
    const energyKcal = num(/(?:energ(?:y|ie)|calories?)[^\d]*(\d+[\.,]?\d*)\s*kcal/);
    if (energyKj != null) result.energy_100g = energyKj;
    else if (energyKcal != null) result.energy_100g = Math.round(energyKcal * 4.184);

    // Fat
    result.fat_100g = num(/(?:^|[^a-z])fat[^\d]*(\d+[\.,]?\d*)\s*g/);

    // Saturated fat — "saturates", "saturated fat", "sat. fat"
    result.saturated_fat_100g =
        num(/saturat(?:es?|ed fat)[^\d]*(\d+[\.,]?\d*)\s*g/) ??
        num(/sat\.?\s*fat[^\d]*(\d+[\.,]?\d*)\s*g/);

    // Carbohydrates
    result.carbohydrates_100g =
        num(/carbohydrat(?:e|es)[^\d]*(\d+[\.,]?\d*)\s*g/) ??
        num(/carbs?[^\d]*(\d+[\.,]?\d*)\s*g/);

    // Sugars — "of which sugars", "sugars"
    result.sugars_100g =
        num(/of which[^,]*sugar[^\d]*(\d+[\.,]?\d*)\s*g/) ??
        num(/sugar[s]?[^\d]*(\d+[\.,]?\d*)\s*g/);

    // Fibre / Fiber
    result.fiber_100g =
        num(/dieta(?:ry)?\s*fib(?:re|er)[^\d]*(\d+[\.,]?\d*)\s*g/) ??
        num(/fib(?:re|er)[^\d]*(\d+[\.,]?\d*)\s*g/);

    // Protein
    result.proteins_100g = num(/protein[s]?[^\d]*(\d+[\.,]?\d*)\s*g/);

    // Salt — use if explicit, else derive from sodium
    const saltVal = num(/salt[^\d]*(\d+[\.,]?\d*)\s*g/);
    const sodiumVal = num(/sodium[^\d]*(\d+[\.,]?\d*)\s*(?:g|mg)/);

    if (saltVal != null) {
        result.salt_100g = saltVal;
    } else if (sodiumVal != null) {
        // If value >1 it's probably mg; if < 0.1 it's probably already in g
        result.sodium_100g = sodiumVal > 1 ? sodiumVal / 1000 : sodiumVal;
        result.salt_100g = sodiumVal > 1
            ? parseFloat((sodiumVal * 2.5 / 1000).toFixed(3))
            : parseFloat((sodiumVal * 2.5).toFixed(3));
    }

    // Cholesterol
    const cholMg = num(/cholesterol[^\d]*(\d+[\.,]?\d*)\s*mg/);
    if (cholMg != null) result.cholesterol_mg_100g = cholMg;

    return result;
};

/**
 * Merge OCR-extracted nutrition into existing product nutrition.
 * Existing API values are kept; OCR values fill in the gaps.
 */
export const mergeNutrition = (
    existing: NutritionData,
    ocr: Partial<NutritionData>
): NutritionData => {
    const merged: NutritionData = { ...(existing || {}) };
    if (!ocr) return merged;
    (Object.keys(ocr) as (keyof NutritionData)[]).forEach(key => {
        if ((!existing || existing[key] == null) && ocr[key] != null) {
            (merged as any)[key] = ocr[key];
        }
    });
    return merged;
};
