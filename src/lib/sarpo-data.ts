export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  collection: string;
  isNew?: boolean;
  description?: string;
}

/** Format price in UZS (sums) with space separators */
export function formatPrice(price: number): string {
  return price.toLocaleString('ru-RU') + ' сум';
}

export interface HeroSlide {
  image: string;
  title: string;
  subtitle: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
}

export const fallbackProducts: Product[] = [
  {
    id: '1',
    name: 'Cable Knit Jumper Dress',
    price: 35.99,
    image: '/images/ai-generated/product_blue_grey.jpg',
    category: "Women's Tops",
    collection: 'Осенняя коллекция',
    isNew: true,
    description: 'Lo\'gay rangli zamonaviy uslubdagi an’anaviy ko‘ylak — Toshkentning eng yaxshi tikuvchilaridan.',
  },
  {
    id: '2',
    name: 'V-Neck Graphic Sweater',
    price: 42.00,
    image: '/images/ai-generated/product_white_gold.jpg',
    category: "Women's Tops",
    collection: 'Осенняя коллекция',
    isNew: true,
    description: 'Oq tusli, oltin tikuvli klassika — har qanday tantanaga mos.',
  },
  {
    id: '3',
    name: 'Short Sleeve Knit Tee',
    price: 28.50,
    image: '/images/ai-generated/product_black_embroidered.jpg',
    category: "Women's Tops",
    collection: 'Летняя коллекция',
    isNew: true,
    description: 'Qora rangli, rang-barang naqshli ko‘ylak — kechki yig‘ilishlar uchun.',
  },
  {
    id: '4',
    name: 'Donegal Sweater',
    price: 55.00,
    image: '/images/ai-generated/product_mint_gold.jpg',
    category: "Women's Tops",
    collection: 'Весенняя коллекция',
    isNew: true,
    description: 'Mint yashil, oltin chiziqli — bahor uchun yorqin tanlov.',
  },
  {
    id: '5',
    name: 'Soft Hybrid Round Neck Top',
    price: 30.00,
    image: '/images/ai-generated/product_green.jpg',
    category: "Women's Tops",
    collection: 'Летняя коллекция',
    isNew: true,
    description: 'Yorqin yashil, qulay va engil mato — yozgi kunlar uchun.',
  },
  {
    id: '6',
    name: 'Low Count Crew Neck T-shirt',
    price: 24.99,
    image: '/images/ai-generated/product_burgundy_sheer.jpg',
    category: "Women's Tops",
    collection: 'Летняя коллекция',
    description: 'Burgundi rangli, shabnam yengli ko‘ylak.',
  },
  {
    id: '7',
    name: 'Boyfriend Long Tee',
    price: 29.99,
    image: '/images/ai-generated/product_white_cape.jpg',
    category: "Women's Tops",
    collection: 'Весенняя коллекция',
    description: 'Erkin kesim, plash-uslubdagi yengli oq ko‘ylak.',
  },
  {
    id: '8',
    name: 'Oversize Heavy T-shirt',
    price: 32.00,
    image: '/images/ai-generated/product_green.jpg',
    category: "Women's Tops",
    collection: 'Летняя коллекция',
    description: 'Erkin shakl, yorqin yashil rang.',
  },
  {
    id: '9',
    name: 'Cream Wool Rag Jumper',
    price: 65.00,
    image: '/images/ai-generated/product_beige_embroidered.jpg',
    category: "Women's Tops",
    collection: 'Зимняя коллекция',
    description: 'Bejli, qo\'l ishi tikuvli — qish uchun maxsus.',
  },
  {
    id: '10',
    name: 'Rainbow Elbow Patch Jumper',
    price: 49.00,
    image: '/images/ai-generated/product_burgundy_dress.jpg',
    category: "Women's Tops",
    collection: 'Осенняя коллекция',
    description: 'To\'liq bo\'yli burgundi ko\'ylak — kuzgi yig\'ilishlar uchun.',
  },
  {
    id: '11',
    name: 'Velvet Festive Set',
    price: 78.00,
    image: '/images/ai-generated/product_burgundy_sheer.jpg',
    category: "Women's Tops",
    collection: 'Зимняя коллекция',
    isNew: true,
    description: 'Baxmal mato, bayram uchun moslashgan.',
  },
  {
    id: '12',
    name: 'Gold Embroidered Tunic',
    price: 58.00,
    image: '/images/ai-generated/product_white_gold.jpg',
    category: "Women's Tops",
    collection: 'Весенняя коллекция',
    description: 'Oltin tikuvli, an’anaviy uslubdagi tunika.',
  },
];

export const fallbackHeroSlides: HeroSlide[] = [
  {
    image: '/images/hero_three_women.jpg',
    title: 'SARPO — Baxt ulashamiz!',
    subtitle: 'Toshkent bo\'ylab keng tarmoqli filiallarimizda sizni eng baxtli lahzalaringiz uchun hamroh bo\'ladigan liboslar kutmoqda. Biz bilan o\'zingizga bo\'lgan ishonchni his eting.',
  },
  {
    image: '/images/hero_sage_green.jpg',
    title: 'Yangi mavsum — Yangi ohanglar',
    subtitle: 'Klassik naqshlar va zamonaviy chiziqlar uyg\'unligi. Har bir libos — siz uchun maxsus tikilgan tarix.',
  },
  {
    image: '/images/hero_pink_seated.jpg',
    title: 'Tantana uchun yaratilgan',
    subtitle: 'Eng nozik gulli tikuvlar, qo\'l ishi naqshlari — bayram va to\'y kunlaringiz uchun.',
  },
];

export const fallbackCollections: string[] = [
  'Весенняя коллекция',
  'Летняя коллекция',
  'Осенняя коллекция',
  'Зимняя коллекция',
  'Новинки',
];

export const fallbackProductGallery: string[] = [
  '/images/ai-generated/product_blue_grey.jpg',
  '/images/ai-generated/product_white_gold.jpg',
  '/images/ai-generated/product_mint_gold.jpg',
  '/images/ai-generated/product_green.jpg',
];
