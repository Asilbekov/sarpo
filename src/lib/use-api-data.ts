'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, HeroSlide, Collection, fallbackProducts, fallbackHeroSlides, fallbackCollections, fallbackProductGallery } from '@/lib/sarpo-data';

const API_BASE = 'https://staging.lume.uz/api/commerce';
const VENDOR_ID = '9e830a58-8fc7-41c9-a470-3b9cc2446069';
const SALE_POINT_ID = '9e979274-baf3-457d-b5f8-3d25042ebaf4';

/** Auth headers required by the backend */
const AUTH_HEADERS: Record<string, string> = {
  'X-Auth-Vendor': VENDOR_ID,
  'X-Auth-Salepoint': SALE_POINT_ID,
  'Accept': 'application/json',
};

function buildApiUrl(endpoint: string, extra?: Record<string, string>): string {
  const url = new URL(`${API_BASE}/${endpoint}`);
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, v);
    });
  }
  return url.toString();
}

/* ──── Safe JSON fetch helper ──── */
async function safeFetchJson(url: string, label: string, extraHeaders?: Record<string, string>): Promise<unknown | null> {
  try {
    const res = await fetch(url, {
      headers: { ...AUTH_HEADERS, ...extraHeaders },
    });
    if (!res.ok) {
      console.warn(`[SARPO API] GET ${label} → ${res.status}`);
      return null;
    }
    return await res.json();
  } catch (err) {
    console.warn(`[SARPO API] GET ${label} failed:`, err);
    return null;
  }
}

/* ──── Products (with filters) ──── */
export function useProducts(params?: {
  search?: string;
  collection?: string;
  isNew?: boolean;
  category?: string;
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  page?: number;
  limit?: number;
}) {
  const [data, setData] = useState<Product[]>(fallbackProducts);
  const [total, setTotal] = useState(fallbackProducts.length);
  const [loading, setLoading] = useState(true);
  const prevKeyRef = useRef('');

  useEffect(() => {
    const extra: Record<string, string> = {};
    if (params?.search) extra.search = params.search;
    if (params?.collection) extra.collection = params.collection;
    if (params?.isNew) extra.isNew = '1';
    if (params?.category) extra.category = params.category;
    if (params?.priceMin !== undefined) extra.priceMin = String(params.priceMin);
    if (params?.priceMax !== undefined) extra.priceMax = String(params.priceMax);
    if (params?.sort) extra.sort = params.sort;
    if (params?.page) extra.page = String(params.page);
    if (params?.limit) extra.limit = String(params.limit);

    const url = buildApiUrl('products', extra);
    const key = url;
    if (prevKeyRef.current === key) return;
    prevKeyRef.current = key;

    let cancelled = false;

    safeFetchJson(url, 'products').then((json) => {
      if (!cancelled && json && typeof json === 'object') {
        const obj = json as Record<string, unknown>;
        const productsRaw = (obj.products || obj.data || []) as Record<string, unknown>[];
        if (Array.isArray(productsRaw) && productsRaw.length > 0) {
          const mapped: Product[] = productsRaw.map((item) => {
            const images = Array.isArray(item.images) ? item.images as string[] : [];
            const mainImage = item.image ? String(item.image) : (images[0] || '');
            return {
              id: String(item.id || ''),
              name: String(item.name || ''),
              price: Number(item.price) || 0,
              image: mainImage,
              images: images.length > 0 ? images : undefined,
              category: String(item.category || ''),
              collection: String(item.collection || ''),
              isNew: Boolean(item.isNew || item.is_new),
              description: item.description ? String(item.description) : undefined,
            };
          }).filter((p) => p.id && p.name);
          if (mapped.length > 0) {
            setData(mapped);
            setTotal((obj.total as number) ?? mapped.length);
          }
        }
      }
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, [
    params?.search, params?.collection, params?.isNew, params?.category,
    params?.priceMin, params?.priceMax, params?.sort, params?.page, params?.limit,
  ]);

  return { data, total, loading };
}

/* ──── Hero Slides ──── */
export function useHeroSlides() {
  const [data, setData] = useState<HeroSlide[]>(fallbackHeroSlides);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    safeFetchJson(buildApiUrl('hero-slides'), 'hero-slides').then((json) => {
      if (!cancelled && json) {
        const raw = Array.isArray(json) ? json : ((json as Record<string, unknown>)?.data || (json as Record<string, unknown>)?.slides || []);
        if (Array.isArray(raw) && raw.length > 0) {
          const mapped: HeroSlide[] = raw.map((item: Record<string, unknown>) => ({
            image: (item.image as string) || '',
            title: (item.title as string) || '',
            subtitle: (item.subtitle as string) || '',
          })).filter((s) => s.image); // only slides with images
          if (mapped.length > 0) setData(mapped);
        }
      }
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ──── Collections ──── */
export function useCollections() {
  const [data, setData] = useState<string[]>(fallbackCollections);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    safeFetchJson(buildApiUrl('collections'), 'collections').then((json) => {
      if (!cancelled && json) {
        const raw = Array.isArray(json) ? json : ((json as Record<string, unknown>)?.data || (json as Record<string, unknown>)?.collections || []);
        if (Array.isArray(raw) && raw.length > 0) {
          const names = raw.map((c: Collection | string) =>
            typeof c === 'string' ? c : (c.name || c.slug || '')
          ).filter(Boolean);
          if (names.length > 0) setData(names);
        }
      }
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ──── Product Gallery ──── */
export function useProductGallery() {
  return { data: fallbackProductGallery };
}

/* ──── Recommended Products ──── */
export function useRecommendedProducts() {
  const [data, setData] = useState<Product[]>(fallbackProducts.filter((p) => p.isNew).slice(0, 5));
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    safeFetchJson(buildApiUrl('products/recommended'), 'products/recommended').then((json) => {
      if (!cancelled && json) {
        const raw = Array.isArray(json) ? json : ((json as Record<string, unknown>)?.data || (json as Record<string, unknown>)?.products || []);
        if (Array.isArray(raw) && raw.length > 0) {
          const mapped: Product[] = raw.map((item: Record<string, unknown>) => {
            const imgs = Array.isArray(item.images) ? item.images as string[] : [];
            const mainImg = item.image ? String(item.image) : (imgs[0] || '');
            return {
              id: String(item.id || ''),
              name: String(item.name || ''),
              price: Number(item.price) || 0,
              image: mainImg,
              images: imgs.length > 0 ? imgs : undefined,
              category: String(item.category || ''),
              collection: String(item.collection || ''),
              isNew: Boolean(item.isNew || item.is_new),
              description: item.description ? String(item.description) : undefined,
            };
          }).filter((p) => p.id && p.name);
          if (mapped.length > 0) setData(mapped);
        }
      }
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ──── New Products ──── */
export function useNewProducts() {
  const [data, setData] = useState<Product[]>(fallbackProducts.filter((p) => p.isNew));
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    safeFetchJson(buildApiUrl('products/new'), 'products/new').then((json) => {
      if (!cancelled && json) {
        const raw = Array.isArray(json) ? json : ((json as Record<string, unknown>)?.data || (json as Record<string, unknown>)?.products || []);
        if (Array.isArray(raw) && raw.length > 0) {
          const mapped: Product[] = raw.map((item: Record<string, unknown>) => {
            const imgs = Array.isArray(item.images) ? item.images as string[] : [];
            const mainImg = item.image ? String(item.image) : (imgs[0] || '');
            return {
              id: String(item.id || ''),
              name: String(item.name || ''),
              price: Number(item.price) || 0,
              image: mainImg,
              images: imgs.length > 0 ? imgs : undefined,
              category: String(item.category || ''),
              collection: String(item.collection || ''),
              isNew: Boolean(item.isNew || item.is_new),
              description: item.description ? String(item.description) : undefined,
            };
          }).filter((p) => p.id && p.name);
          if (mapped.length > 0) setData(mapped);
        }
      }
    }).catch(() => {}).finally(() => {
      if (!cancelled) setLoading(false);
    });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ──── Direct API helpers (for orders, contact, etc.) ──── */
export function getApiUrl(endpoint: string, extra?: Record<string, string>): string {
  return buildApiUrl(endpoint, extra);
}

export async function apiPostDirect(endpoint: string, body: unknown): Promise<Response> {
  const url = buildApiUrl(endpoint);
  return fetch(url, {
    method: 'POST',
    headers: { ...AUTH_HEADERS, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}
