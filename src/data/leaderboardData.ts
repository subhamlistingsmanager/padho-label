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
        barcode: '8901177000109', name: 'Tata Tea Gold', brand: 'Tata Consumer',
        image_url: 'https://m.media-amazon.com/images/I/61Nl-N+uWLL._SL1500_.jpg',
        grade: 'A', score: 92, category: 'food', subCategory: 'Beverages',
        reason: 'Natural tea leaves, zero additives, high antioxidants'
    },
    {
        barcode: '8906042190085', name: 'Raw Pressery Apple Juice', brand: 'Raw Pressery',
        image_url: 'https://m.media-amazon.com/images/I/61SLWuGJWXL._AC_SL1000_.jpg',
        grade: 'A', score: 85, category: 'food', subCategory: 'Beverages',
        reason: 'Cold-pressed, no preservatives, no added sugar'
    },
    {
        barcode: '8901058850024', name: 'Nescafe Classic Coffee', brand: 'Nestle',
        image_url: 'https://m.media-amazon.com/images/I/61+9F70gR6L._SL1500_.jpg',
        grade: 'A', score: 92, category: 'food', subCategory: 'Beverages',
        reason: 'Zero sugar, pure coffee, high antioxidants'
    },
    {
        barcode: '8901030691234', name: 'Bru Instant Coffee', brand: 'HUL',
        image_url: 'https://m.media-amazon.com/images/I/61M3mJTeSZL._SL1000_.jpg',
        grade: 'A', score: 90, category: 'food', subCategory: 'Beverages',
        reason: 'Pure coffee-chicory blend, no added sugar'
    },
    {
        barcode: '8904049900081', name: 'Amul Kool Milk Drink', brand: 'Amul',
        image_url: 'https://m.media-amazon.com/images/I/61Qy-6TWDML._AC_SL1000_.jpg',
        grade: 'B', score: 70, category: 'food', subCategory: 'Beverages',
        reason: 'Good protein, calcium, moderate sugar'
    },
    {
        barcode: '8906017290076', name: 'Bislery Mineral Water', brand: 'Bisleri',
        image_url: 'https://m.media-amazon.com/images/I/51r5I9i5SXL._SL1000_.jpg',
        grade: 'A', score: 100, category: 'food', subCategory: 'Beverages',
        reason: 'Pure mineral water, zero calories, zero additives'
    },
    {
        barcode: '8901491501004', name: 'Himalayan Natural Mineral Water', brand: 'Tata',
        image_url: 'https://m.media-amazon.com/images/I/51o-M8BNTZL._SL1000_.jpg',
        grade: 'A', score: 100, category: 'food', subCategory: 'Beverages',
        reason: 'Naturally sourced, balanced minerals'
    },

    // ── FOOD: Snacks ──
    {
        barcode: '8906001760082', name: 'Yoga Bar Muesli Snack', brand: 'YogaBar',
        image_url: 'https://m.media-amazon.com/images/I/71wHzT-0xwL._SL1500_.jpg',
        grade: 'A', score: 82, category: 'food', subCategory: 'Snacks',
        reason: 'Whole grains, oats, high fibre, low GI'
    },
    {
        barcode: '8901499000194', name: 'Roasted Fox Nuts (Makhana)', brand: 'Farmley',
        image_url: 'https://m.media-amazon.com/images/I/71dZpCQZGIL._SL1500_.jpg',
        grade: 'A', score: 88, category: 'food', subCategory: 'Snacks',
        reason: 'High protein, low fat, only 3 ingredients'
    },
    {
        barcode: '8901231780010', name: 'Happilo Premium Almonds', brand: 'Happilo',
        image_url: 'https://m.media-amazon.com/images/I/71s9V3J+JDL._SL1500_.jpg',
        grade: 'A', score: 96, category: 'food', subCategory: 'Snacks',
        reason: 'Raw almonds, high protein, healthy fats'
    },
    {
        barcode: '8906001760000', name: 'Yoga Bar Protein Bar', brand: 'Yoga Bar',
        image_url: 'https://m.media-amazon.com/images/I/71wHzT-0xwL._SL1500_.jpg',
        grade: 'A', score: 85, category: 'food', subCategory: 'Snacks',
        reason: 'High protein, no soy, no artificial sweeteners'
    },
    {
        barcode: '8902519100110', name: 'Too Yumm Veggie Sticks', brand: 'Too Yumm',
        image_url: 'https://m.media-amazon.com/images/I/71FGXmx1uQL._SL1500_.jpg',
        grade: 'B', score: 68, category: 'food', subCategory: 'Snacks',
        reason: 'Baked, vegetable-based, lower fat'
    },
    {
        barcode: '8906001760015', name: 'Baked Kurkure (Lime)', brand: 'PepsiCo',
        image_url: 'https://m.media-amazon.com/images/I/81C0R29aNkL._SL1500_.jpg',
        grade: 'C', score: 52, category: 'food', subCategory: 'Snacks',
        reason: 'Baked, lower fat than fried, but high sodium'
    },
    {
        barcode: '8901207040405', name: 'Parle-G Biscuits', brand: 'Parle',
        image_url: 'https://m.media-amazon.com/images/I/61U0Mv0KOWL._SL1500_.jpg',
        grade: 'D', score: 32, category: 'food', subCategory: 'Snacks',
        reason: 'Refined wheat flour, high sugar, palm oil'
    },
    {
        barcode: '8901058860016', name: 'KitKat 2 Finger', brand: 'Nestle',
        image_url: 'https://m.media-amazon.com/images/I/61Nl5U+bUWL._SL1500_.jpg',
        grade: 'D', score: 32, category: 'food', subCategory: 'Snacks',
        reason: 'High sugar and saturated fat'
    },
    {
        barcode: '8901063004009', name: 'Haldiram\'s Aloo Bhujia', brand: 'Haldiram\'s',
        image_url: 'https://m.media-amazon.com/images/I/81x1nQ2d20L._SL1500_.jpg',
        grade: 'E', score: 20, category: 'food', subCategory: 'Snacks',
        reason: 'Very high sodium and saturated fat'
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
        barcode: '8904049900029', name: 'Amul Masti Spiced Buttermilk', brand: 'Amul',
        image_url: 'https://m.media-amazon.com/images/I/61Qy-6TWDML._AC_SL1000_.jpg',
        grade: 'A', score: 88, category: 'food', subCategory: 'Dairy',
        reason: 'Low calorie, probiotic, natural spices'
    },
    {
        barcode: '8906084830010', name: 'Epigamia Greek Yogurt', brand: 'Epigamia',
        image_url: 'https://m.media-amazon.com/images/I/71dlVKRCZLL._SL1500_.jpg',
        grade: 'A', score: 86, category: 'food', subCategory: 'Dairy',
        reason: 'High protein, minimal ingredients'
    },
    {
        barcode: '8904049900456', name: 'Amul Paneer (Frozen)', brand: 'Amul',
        image_url: 'https://m.media-amazon.com/images/I/71pQJXEVGZL._AC_SL1000_.jpg',
        grade: 'B', score: 78, category: 'food', subCategory: 'Dairy',
        reason: 'High protein, calcium, but moderate saturated fat'
    },
    {
        barcode: '8964001010101', name: 'Patanjali Cow Ghee', brand: 'Patanjali',
        image_url: 'https://m.media-amazon.com/images/I/71k2eGf2seL._SL1500_.jpg',
        grade: 'B', score: 68, category: 'food', subCategory: 'Dairy',
        reason: 'Pure cow ghee, good for digestion in small amounts'
    },
    {
        barcode: '8901063141124', name: 'Amul Butter', brand: 'Amul',
        image_url: 'https://m.media-amazon.com/images/I/61+y2qFw2fL._SL1000_.jpg',
        grade: 'D', score: 38, category: 'food', subCategory: 'Dairy',
        reason: 'Extremely high saturated fat and sodium'
    },

    // ── FOOD: Breakfast ──
    {
        barcode: '8901458021451', name: 'Bagrrys Rolled Oats', brand: 'Bagrrys',
        image_url: 'https://m.media-amazon.com/images/I/71F7JkI6Z7L._SL1500_.jpg',
        grade: 'A', score: 94, category: 'food', subCategory: 'Breakfast',
        reason: '100% whole grain, zero processing, high fiber'
    },
    {
        barcode: '8901458021000', name: 'Bagrrys White Oats', brand: 'Bagrrys',
        image_url: 'https://m.media-amazon.com/images/I/71F7JkI6Z7L._SL1500_.jpg',
        grade: 'A', score: 92, category: 'food', subCategory: 'Breakfast',
        reason: 'Whole grain, high fiber, heart healthy'
    },
    {
        barcode: '8904124000000', name: 'True Elements Quinoa', brand: 'True Elements',
        image_url: 'https://m.media-amazon.com/images/I/71s9V3J+JDL._SL1500_.jpg',
        grade: 'A', score: 98, category: 'food', subCategory: 'Breakfast',
        reason: 'Superfood, high protein, all essential amino acids'
    },
    {
        barcode: '8901058001234', name: 'Aashirvaad Multigrain Atta', brand: 'ITC',
        image_url: 'https://m.media-amazon.com/images/I/81L1-BVaJFL._SL1500_.jpg',
        grade: 'A', score: 89, category: 'food', subCategory: 'Breakfast',
        reason: 'High fiber, contains 6 grains, nutrient dense'
    },
    {
        barcode: '8906042810015', name: 'Saffola Masala Oats', brand: 'Marico',
        image_url: 'https://m.media-amazon.com/images/I/71bFXsrMGKL._SL1500_.jpg',
        grade: 'B', score: 65, category: 'food', subCategory: 'Breakfast',
        reason: 'Good fibre, but added salt and artificial flavour'
    },

    // ── FOOD: Condiments ──
    {
        barcode: '8906042551001', name: 'DiSano Olive Oil (Extra Virgin)', brand: 'DiSano',
        image_url: 'https://m.media-amazon.com/images/I/71k2eGf2seL._SL1500_.jpg',
        grade: 'A', score: 95, category: 'food', subCategory: 'Condiments',
        reason: 'Extra virgin, high polyphenols, single ingredient'
    },
    {
        barcode: '8906042550010', name: 'Organic Tattva Wild Honey', brand: 'Organic Tattva',
        image_url: 'https://m.media-amazon.com/images/I/61bksD2T8KL.jpg',
        grade: 'A', score: 87, category: 'food', subCategory: 'Condiments',
        reason: '100% raw, no additives, NMR tested'
    },
    {
        barcode: '8901712513410', name: 'Dabur Honey (Squeezable)', brand: 'Dabur',
        image_url: 'https://m.media-amazon.com/images/I/71B9vV7I-hL._SL1500_.jpg',
        grade: 'B', score: 65, category: 'food', subCategory: 'Condiments',
        reason: 'Natural sweetener, but high sugar content per serving'
    },
    {
        barcode: '8901491101831', name: 'Tata Salt (Vacuum Evaporated)', brand: 'Tata',
        image_url: 'https://m.media-amazon.com/images/I/61H+Vf5V5XL._SL1500_.jpg',
        grade: 'C', score: 50, category: 'food', subCategory: 'Condiments',
        reason: 'Pure sodium chloride, essential in moderation but high risk'
    },
    {
        barcode: '8901058002001', name: 'Kissan Mixed Fruit Jam', brand: 'HUL',
        image_url: 'https://m.media-amazon.com/images/I/71jnApYfkXL._SL1500_.jpg',
        grade: 'D', score: 32, category: 'food', subCategory: 'Condiments',
        reason: 'Very high added sugar, minimal real fruit'
    },
    {
        barcode: '8901058001000', name: 'Maggi Tomato Ketchup', brand: 'Nestle',
        image_url: 'https://m.media-amazon.com/images/I/61Nl5U+bUWL._SL1500_.jpg',
        grade: 'D', score: 30, category: 'food', subCategory: 'Condiments',
        reason: 'High in added sugar and sodium'
    },

    // ── FOOD: Noodles ──
    {
        barcode: '8901058002898', name: 'Maggi Atta Noodles', brand: 'Nestle',
        image_url: 'https://m.media-amazon.com/images/I/81L1-BVaJFL._SL1500_.jpg',
        grade: 'C', score: 50, category: 'food', subCategory: 'Noodles',
        reason: 'Whole wheat, better than original but still high sodium'
    },
    {
        barcode: '8901058000109', name: 'Maggi Masala Noodles', brand: 'Nestle',
        image_url: 'https://www.maggi.in/sites/default/files/styles/product_image_400x400/public/2021-02/Product%20Header%20-%20Masala_0.png',
        grade: 'D', score: 28, category: 'food', subCategory: 'Noodles',
        reason: 'Ultra-processed, very high sodium, refined wheat'
    },
    {
        barcode: '8901058000000', name: 'Maggi Pazzta Cheese', brand: 'Nestle',
        image_url: 'https://m.media-amazon.com/images/I/71ufX5OFE4L._SL1500_.jpg',
        grade: 'D', score: 38, category: 'food', subCategory: 'Noodles',
        reason: 'Processed wheat, high sodium, artificial cheese flavor'
    },

    // ── BEAUTY: Skincare ──
    {
        barcode: '8964001010207', name: 'Minimalist 2% Salicylic Acid', brand: 'Minimalist',
        image_url: 'https://m.media-amazon.com/images/I/51OKmHAaGRL._SL1000_.jpg',
        grade: 'A', score: 93, category: 'beauty', subCategory: 'Skincare',
        reason: 'No sulfates, no parabens, targeted actives only'
    },
    {
        barcode: '8904052400000', name: 'Forest Essentials Facial Cleanser', brand: 'Forest Essentials',
        image_url: 'https://m.media-amazon.com/images/I/51OKmHAaGRL._SL1000_.jpg',
        grade: 'A', score: 94, category: 'beauty', subCategory: 'Skincare',
        reason: 'Natural ingredients, no synthetic colors or fragrances'
    },
    {
        barcode: '8806173000000', name: 'Innisfree Green Tea Seed Serum', brand: 'Innisfree',
        image_url: 'https://m.media-amazon.com/images/I/61HrYMerDTL._SL1500_.jpg',
        grade: 'A', score: 86, category: 'beauty', subCategory: 'Skincare',
        reason: 'Natural extract based, no mineral oil'
    },
    {
        barcode: '8906018190000', name: 'The Derma Co 10% Vitamin C', brand: 'The Derma Co',
        image_url: 'https://m.media-amazon.com/images/I/61HrYMerDTL._SL1500_.jpg',
        grade: 'A', score: 88, category: 'beauty', subCategory: 'Skincare',
        reason: 'Effective stable Vitamin C, no parabens'
    },
    {
        barcode: '8908000000000', name: 'Cetaphil Gentle Cleanser', brand: 'Galderma',
        image_url: 'https://m.media-amazon.com/images/I/51r5I9i5SXL._SL1000_.jpg',
        grade: 'A', score: 90, category: 'beauty', subCategory: 'Skincare',
        reason: 'Soap-free, non-comedogenic, safe for sensitive skin'
    },
    {
        barcode: '8901030700000', name: 'Pond\'s Super Light Gel', brand: 'HUL',
        image_url: 'https://m.media-amazon.com/images/I/61vhOTSiYWL._SL1000_.jpg',
        grade: 'B', score: 78, category: 'beauty', subCategory: 'Skincare',
        reason: 'Non-oily formula, contains Vitamin E and Hyaluronic Acid'
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
        barcode: '8906022980000', name: 'Parachute Coconut Oil', brand: 'Marico',
        image_url: 'https://m.media-amazon.com/images/I/71zIWMCnZRL._SL1500_.jpg',
        grade: 'A', score: 100, category: 'beauty', subCategory: 'Haircare',
        reason: '100% pure coconut oil, no additives'
    },
    {
        barcode: '8904052433333', name: 'Kama Ayurveda Bringadi Oil', brand: 'Kama Ayurveda',
        image_url: 'https://m.media-amazon.com/images/I/71zIWMCnZRL._SL1500_.jpg',
        grade: 'A', score: 95, category: 'beauty', subCategory: 'Haircare',
        reason: 'Traditional processing, high quality sesame oil base'
    },
    {
        barcode: '8964001010150', name: 'Minimalist Multi-Peptide Serum', brand: 'Minimalist',
        image_url: 'https://m.media-amazon.com/images/I/61M3mJTeSZL._SL1000_.jpg',
        grade: 'A', score: 91, category: 'beauty', subCategory: 'Haircare',
        reason: 'No silicones, no parabens, science-backed actives'
    },
    {
        barcode: '8906022981015', name: "Indulekha Bringha Hair Oil", brand: 'Indulekha',
        image_url: 'https://m.media-amazon.com/images/I/71zIWMCnZRL._SL1500_.jpg',
        grade: 'A', score: 88, category: 'beauty', subCategory: 'Haircare',
        reason: 'Ayurvedic, no mineral oil, no sulfates'
    },
    {
        barcode: '8904052422222', name: 'Biotique Ocean Kelp Shampoo', brand: 'Biotique',
        image_url: 'https://m.media-amazon.com/images/I/61M3mJTeSZL._SL1000_.jpg',
        grade: 'B', score: 80, category: 'beauty', subCategory: 'Haircare',
        reason: 'Ayurvedic recipe, no parabens, very gentle'
    },

    // ── BEAUTY: Body Care ──
    {
        barcode: '8964001010306', name: "Plum BodyLovin Vanilla Lotion", brand: 'Plum',
        image_url: 'https://m.media-amazon.com/images/I/61tUMr1ZXQL._SL1000_.jpg',
        grade: 'A', score: 84, category: 'beauty', subCategory: 'Body Care',
        reason: 'Paraben-free, no mineral oil, cruelty-free'
    },
    {
        barcode: '8901030005555', name: 'Pears Pure & Gentle', brand: 'HUL',
        image_url: 'https://m.media-amazon.com/images/I/71B9vV7I-hL._SL1500_.jpg',
        grade: 'B', score: 82, category: 'beauty', subCategory: 'Body Care',
        reason: 'High glycerin content, paraben-free'
    },
    {
        barcode: '8901396094010', name: 'Dove Deeply Nourishing Body Wash', brand: 'Dove (HUL)',
        image_url: 'https://m.media-amazon.com/images/I/71sHkYL5i5L._SL1500_.jpg',
        grade: 'B', score: 68, category: 'beauty', subCategory: 'Body Care',
        reason: 'Gentle surfactants, moisturising, light fragrance'
    },
    {
        barcode: '8901526004003', name: 'Nivea Soft Cream', brand: 'Nivea',
        image_url: 'https://m.media-amazon.com/images/I/61vhOTSiYWL._SL1000_.jpg',
        grade: 'B', score: 75, category: 'beauty', subCategory: 'Body Care',
        reason: 'Lightweight, contains Jojoba oil and Vitamin E'
    },
    {
        barcode: '8901526001002', name: 'Nivea Body Milk', brand: 'Nivea',
        image_url: 'https://m.media-amazon.com/images/I/61ZKCjCh1YL._SL1000_.jpg',
        grade: 'B', score: 72, category: 'beauty', subCategory: 'Body Care',
        reason: 'Rich hydration, but contains alcohol and perfume'
    },

    // ── BEAUTY: Oral Care ──
    {
        barcode: '8901234567890', name: 'Vicco Vajradanti Paste', brand: 'Vicco',
        image_url: 'https://m.media-amazon.com/images/I/71B9vV7I-hL._SL1500_.jpg',
        grade: 'A', score: 94, category: 'beauty', subCategory: 'Oral Care',
        reason: 'Pure herbal, no sugar, no SLS'
    },
    {
        barcode: '8901234567891', name: 'Meswak Toothpaste', brand: 'Dabur',
        image_url: 'https://m.media-amazon.com/images/I/71giqMoSDAL._SL1000_.jpg',
        grade: 'A', score: 88, category: 'beauty', subCategory: 'Oral Care',
        reason: 'Rare Meswak herb, no SLS, high quality'
    },
    {
        barcode: '8904100701078', name: 'Himalaya Complete Care Toothpaste', brand: 'Himalaya',
        image_url: 'https://m.media-amazon.com/images/I/61AGi4IJGRL._SL1000_.jpg',
        grade: 'A', score: 82, category: 'beauty', subCategory: 'Oral Care',
        reason: 'SLS-free, fluoride-free, herbal, no artificial sweeteners'
    },
    {
        barcode: '8901234567892', name: 'Sensodyne Fresh Mint', brand: 'GSK',
        image_url: 'https://m.media-amazon.com/images/I/61AGi4IJGRL._SL1000_.jpg',
        grade: 'B', score: 76, category: 'beauty', subCategory: 'Oral Care',
        reason: 'Specialised for sensitivity, contains fluoride'
    },
    {
        barcode: '8901314601052', name: 'Colgate Vedshakti Toothpaste', brand: 'Colgate',
        image_url: 'https://m.media-amazon.com/images/I/71giqMoSDAL._SL1000_.jpg',
        grade: 'B', score: 70, category: 'beauty', subCategory: 'Oral Care',
        reason: 'No SLS, herbal ingredients, fluoride present'
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
