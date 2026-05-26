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
