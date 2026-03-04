export type LeaderboardEntry = {
    barcode: string;
    name: string;
    brand: string;
    image_url: string;
    grade: string;
    score: number; // 0-100
    category: 'food' | 'beauty';
    subCategory: string;
    reason: string; // Why it's rated this way
};

export const FOOD_SUB_CATEGORIES = ['All', 'Beverages', 'Snacks', 'Dairy', 'Breakfast', 'Condiments', 'Noodles'];
export const BEAUTY_SUB_CATEGORIES = ['All', 'Skincare', 'Haircare', 'Body Care', 'Oral Care'];

export const LEADERBOARD_DATA: LeaderboardEntry[] = [
    // ── FOOD: Beverages ──
    {
        barcode: '8906041690013', name: 'Paper Boat Aamras', brand: 'Paper Boat',
        image_url: 'https://m.media-amazon.com/images/I/71Zp+Y5vLV._AC_SL1500_.jpg',
        grade: 'B', score: 74, category: 'food', subCategory: 'Beverages',
        reason: 'Real fruit, low additives, moderate sugar'
    },
    {
        barcode: '8901058055481', name: 'Maaza Mango Drink', brand: 'Coca-Cola India',
        image_url: 'https://m.media-amazon.com/images/I/71twL+CWKWL._AC_SL1500_.jpg',
        grade: 'C', score: 55, category: 'food', subCategory: 'Beverages',
        reason: 'High sugar, but real mango pulp'
    },
    {
        barcode: '8906042190085', name: 'Raw Pressery Apple Juice', brand: 'Raw Pressery',
        image_url: 'https://m.media-amazon.com/images/I/61SLWuGJWXL._AC_SL1000_.jpg',
        grade: 'A', score: 85, category: 'food', subCategory: 'Beverages',
        reason: 'Cold-pressed, no preservatives, no added sugar'
    },
    {
        barcode: '8901063150027', name: 'Limca Sparkling Lime', brand: 'Coca-Cola India',
        image_url: 'https://m.media-amazon.com/images/I/61fA4QNFkLL._AC_SL1300_.jpg',
        grade: 'D', score: 30, category: 'food', subCategory: 'Beverages',
        reason: 'High sugar, artificial flavours, carbonated'
    },
    {
        barcode: '8904049900081', name: 'Amul Kool Milk Drink', brand: 'Amul',
        image_url: 'https://m.media-amazon.com/images/I/61Qy-6TWDML._AC_SL1000_.jpg',
        grade: 'B', score: 70, category: 'food', subCategory: 'Beverages',
        reason: 'Good protein, calcium, moderate sugar'
    },

    // ── FOOD: Snacks ──
    {
        barcode: '8906001760015', name: 'Baked Kurkure (Lime)', brand: 'PepsiCo',
        image_url: 'https://m.media-amazon.com/images/I/81C0R29aNkL._SL1500_.jpg',
        grade: 'C', score: 52, category: 'food', subCategory: 'Snacks',
        reason: 'Baked, lower fat than fried, but high sodium'
    },
    {
        barcode: '8904063200012', name: 'Haldirams Bhujia Sev', brand: "Haldiram's",
        image_url: 'https://m.media-amazon.com/images/I/81v7W5U2D9L._SL1500_.jpg',
        grade: 'D', score: 35, category: 'food', subCategory: 'Snacks',
        reason: 'Very high in saturated fat and sodium'
    },
    {
        barcode: '8906001760082', name: 'Yoga Bar Muesli Snack', brand: 'YogaBar',
        image_url: 'https://m.media-amazon.com/images/I/71wHzT-0xwL._SL1500_.jpg',
        grade: 'A', score: 82, category: 'food', subCategory: 'Snacks',
        reason: 'Whole grains, oats, high fibre, low GI'
    },
    {
        barcode: '8902519100110', name: 'Too Yumm Veggie Sticks', brand: 'Too Yumm',
        image_url: 'https://m.media-amazon.com/images/I/71FGXmx1uQL._SL1500_.jpg',
        grade: 'B', score: 68, category: 'food', subCategory: 'Snacks',
        reason: 'Baked, vegetable-based, lower fat'
    },
    {
        barcode: '8901499000194', name: 'Roasted Fox Nuts (Makhana)', brand: 'Farmley',
        image_url: 'https://m.media-amazon.com/images/I/71dZpCQZGIL._SL1500_.jpg',
        grade: 'A', score: 88, category: 'food', subCategory: 'Snacks',
        reason: 'High protein, low fat, only 3 ingredients'
    },

    // ── FOOD: Dairy ──
    {
        barcode: '8904049900012', name: 'Amul Greek Yogurt (Plain)', brand: 'Amul',
        image_url: 'https://m.media-amazon.com/images/I/71pQJXEVGZL._AC_SL1000_.jpg',
        grade: 'A', score: 91, category: 'food', subCategory: 'Dairy',
        reason: 'Very high protein, live cultures, no additives'
    },
    {
        barcode: '8901063123007', name: 'Amul Toned Milk (1L)', brand: 'Amul',
        image_url: 'https://m.media-amazon.com/images/I/61VnOL5VCVL._AC_SL1000_.jpg',
        grade: 'A', score: 89, category: 'food', subCategory: 'Dairy',
        reason: 'Low fat, high calcium, no additives'
    },
    {
        barcode: '8906084830010', name: 'Epigamia Greek Yogurt', brand: 'Epigamia',
        image_url: 'https://m.media-amazon.com/images/I/71dlVKRCZLL._SL1500_.jpg',
        grade: 'A', score: 86, category: 'food', subCategory: 'Dairy',
        reason: 'High protein, minimal ingredients'
    },

    // ── FOOD: Breakfast ──
    {
        barcode: '8906001250026', name: "Kellogg's Oats", brand: "Kellogg's",
        image_url: 'https://m.media-amazon.com/images/I/71CVtgOLHCL._SL1500_.jpg',
        grade: 'A', score: 90, category: 'food', subCategory: 'Breakfast',
        reason: 'Whole grain, high in beta-glucan, no sugar'
    },
    {
        barcode: '8901058002332', name: 'Maggi Oats Noodles', brand: 'Nestle',
        image_url: 'https://m.media-amazon.com/images/I/71ufX5OFE4L._SL1500_.jpg',
        grade: 'C', score: 48, category: 'food', subCategory: 'Breakfast',
        reason: 'Processed, high sodium, moderate fibre'
    },
    {
        barcode: '8906042810015', name: 'Saffola Masala Oats', brand: 'Marico',
        image_url: 'https://m.media-amazon.com/images/I/71bFXsrMGKL._SL1500_.jpg',
        grade: 'B', score: 65, category: 'food', subCategory: 'Breakfast',
        reason: 'Good fibre, but added salt and artificial flavour'
    },

    // ── FOOD: Condiments ──
    {
        barcode: '8906042550010', name: 'Organic Tattva Wild Honey', brand: 'Organic Tattva',
        image_url: 'https://m.media-amazon.com/images/I/61bksD2T8KL.jpg',
        grade: 'A', score: 87, category: 'food', subCategory: 'Condiments',
        reason: '100% raw, no additives, NMR tested'
    },
    {
        barcode: '8901058002001', name: 'Kissan Mixed Fruit Jam', brand: 'HUL',
        image_url: 'https://m.media-amazon.com/images/I/71jnApYfkXL._SL1500_.jpg',
        grade: 'D', score: 32, category: 'food', subCategory: 'Condiments',
        reason: 'Very high added sugar, minimal real fruit'
    },
    {
        barcode: '8906042551001', name: 'DiSano Olive Oil (Extra Virgin)', brand: 'DiSano',
        image_url: 'https://m.media-amazon.com/images/I/71k2eGf2seL._SL1500_.jpg',
        grade: 'A', score: 95, category: 'food', subCategory: 'Condiments',
        reason: 'Extra virgin, high polyphenols, single ingredient'
    },

    // ── FOOD: Noodles ──
    {
        barcode: '8901058000109', name: 'Maggi Masala Noodles', brand: 'Nestle',
        image_url: 'https://www.maggi.in/sites/default/files/styles/product_image_400x400/public/2021-02/Product%20Header%20-%20Masala_0.png',
        grade: 'D', score: 28, category: 'food', subCategory: 'Noodles',
        reason: 'Ultra-processed, very high sodium, refined wheat'
    },
    {
        barcode: '8901058002898', name: 'Maggi Atta Noodles', brand: 'Nestle',
        image_url: 'https://m.media-amazon.com/images/I/81L1-BVaJFL._SL1500_.jpg',
        grade: 'C', score: 50, category: 'food', subCategory: 'Noodles',
        reason: 'Whole wheat, better than original but still high sodium'
    },
    {
        barcode: '8906001501020', name: "Knorr Soupy Noodles", brand: 'HUL',
        image_url: 'https://m.media-amazon.com/images/I/81uS3APBVAL._SL1500_.jpg',
        grade: 'D', score: 25, category: 'food', subCategory: 'Noodles',
        reason: 'Highly processed, artificial flavours, very high sodium'
    },

    // ── BEAUTY: Skincare ──
    {
        barcode: '8964001000109', name: 'Cetaphil Gentle Skin Cleanser', brand: 'Cetaphil',
        image_url: 'https://m.media-amazon.com/images/I/61ZevPtXH2L._SL1000_.jpg',
        grade: 'A', score: 90, category: 'beauty', subCategory: 'Skincare',
        reason: 'Paraben-free, fragrance-free, dermatologist tested'
    },
    {
        barcode: '8964001010207', name: 'Minimalist 2% Salicylic Acid', brand: 'Minimalist',
        image_url: 'https://m.media-amazon.com/images/I/51OKmHAaGRL._SL1000_.jpg',
        grade: 'A', score: 93, category: 'beauty', subCategory: 'Skincare',
        reason: 'No sulfates, no parabens, targeted actives only'
    },
    {
        barcode: '8906018190016', name: 'Dot & Key Barrier Repair Moisturiser', brand: 'Dot & Key',
        image_url: 'https://m.media-amazon.com/images/I/61HrYMerDTL._SL1500_.jpg',
        grade: 'B', score: 76, category: 'beauty', subCategory: 'Skincare',
        reason: 'No parabens, light fragrance present'
    },
    {
        barcode: '8709785800180', name: 'Neutrogena Hydro Boost Gel', brand: 'Neutrogena',
        image_url: 'https://m.media-amazon.com/images/I/61ZKCjCh1YL._SL1000_.jpg',
        grade: 'B', score: 72, category: 'beauty', subCategory: 'Skincare',
        reason: 'Fragrance-free, no parabens, contains hyaluronic acid'
    },
    {
        barcode: '8901030803017', name: 'Himalaya Neem Face Wash', brand: 'Himalaya',
        image_url: 'https://m.media-amazon.com/images/I/61vhOTSiYWL._SL1000_.jpg',
        grade: 'C', score: 58, category: 'beauty', subCategory: 'Skincare',
        reason: 'Natural base but contains SLS'
    },

    // ── BEAUTY: Haircare ──
    {
        barcode: '8906022981015', name: "Indulekha Bringha Hair Oil", brand: 'Indulekha',
        image_url: 'https://m.media-amazon.com/images/I/71zIWMCnZRL._SL1500_.jpg',
        grade: 'A', score: 88, category: 'beauty', subCategory: 'Haircare',
        reason: 'Ayurvedic, no mineral oil, no sulfates'
    },
    {
        barcode: '8964001010150', name: 'Minimalist Multi-Peptide Serum', brand: 'Minimalist',
        image_url: 'https://m.media-amazon.com/images/I/61M3mJTeSZL._SL1000_.jpg',
        grade: 'A', score: 91, category: 'beauty', subCategory: 'Haircare',
        reason: 'No silicones, no parabens, science-backed actives'
    },
    {
        barcode: '4056800200153', name: 'L\'Oréal Extraordinary Oil Shampoo', brand: "L'Oréal",
        image_url: 'https://m.media-amazon.com/images/I/61LoCiIfZVL._SL1000_.jpg',
        grade: 'C', score: 54, category: 'beauty', subCategory: 'Haircare',
        reason: 'Contains SLS, silicones, artificial fragrance'
    },

    // ── BEAUTY: Body Care ──
    {
        barcode: '8901396094010', name: 'Dove Deeply Nourishing Body Wash', brand: 'Dove (HUL)',
        image_url: 'https://m.media-amazon.com/images/I/71sHkYL5i5L._SL1500_.jpg',
        grade: 'B', score: 68, category: 'beauty', subCategory: 'Body Care',
        reason: 'Gentle surfactants, moisturising, light fragrance'
    },
    {
        barcode: '8964001010306', name: "Plum BodyLovin Vanilla Lotion", brand: 'Plum',
        image_url: 'https://m.media-amazon.com/images/I/61tUMr1ZXQL._SL1000_.jpg',
        grade: 'A', score: 84, category: 'beauty', subCategory: 'Body Care',
        reason: 'Paraben-free, no mineral oil, cruelty-free'
    },

    // ── BEAUTY: Oral Care ──
    {
        barcode: '8901314601052', name: 'Colgate Vedshakti Toothpaste', brand: 'Colgate',
        image_url: 'https://m.media-amazon.com/images/I/71giqMoSDAL._SL1000_.jpg',
        grade: 'B', score: 70, category: 'beauty', subCategory: 'Oral Care',
        reason: 'No SLS, herbal ingredients, fluoride present'
    },
    {
        barcode: '8904100701078', name: 'Himalaya Complete Care Toothpaste', brand: 'Himalaya',
        image_url: 'https://m.media-amazon.com/images/I/61AGi4IJGRL._SL1000_.jpg',
        grade: 'A', score: 82, category: 'beauty', subCategory: 'Oral Care',
        reason: 'SLS-free, fluoride-free, herbal, no artificial sweeteners'
    },
    {
        barcode: '8901314000105', name: 'Colgate Max Fresh Toothpaste', brand: 'Colgate',
        image_url: 'https://m.media-amazon.com/images/I/61o-M8BNTZL._SL1000_.jpg',
        grade: 'C', score: 50, category: 'beauty', subCategory: 'Oral Care',
        reason: 'Contains SLS, artifical sweetener saccharin'
    },
];

export const getTopBySubCategory = (
    category: 'food' | 'beauty',
    subCategory: string,
    limit = 10
): LeaderboardEntry[] => {
    let items = LEADERBOARD_DATA.filter(item => item.category === category);
    if (subCategory !== 'All') {
        items = items.filter(item => item.subCategory === subCategory);
    }
    return items.sort((a, b) => b.score - a.score).slice(0, limit);
};

export const GRADE_COLOR: Record<string, string> = {
    A: '#1B5E20',
    B: '#4CAF50',
    C: '#FFC107',
    D: '#FF9800',
    E: '#D32F2F',
};
