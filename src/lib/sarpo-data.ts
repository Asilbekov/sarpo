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
