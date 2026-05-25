'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, HeroSlide, Collection } from '@/lib/sarpo-data';

const API_BASE = 'https://staging.lume.uz/api/commerce';
const VENDOR_ID = '9e830a58-8fc7-41c9-a470-3b9cc2446069';
const SALE_POINT_ID = '9e979274-baf3-457d-b5f8-3d25042ebaf4';

function buildUrl(endpoint: string, extra?: Record<string, string>): string {
  const url = new URL(`${API_BASE}/${endpoint}`);
  url.searchParams.set('vendor_id', VENDOR_ID);
  url.searchParams.set('sale_point_id', SALE_POINT_ID);
  if (extra) {
    Object.entries(extra).forEach(([k, v]) => {
      if (v !== undefined && v !== '') url.searchParams.set(k, v);
    });
  }
  return url.toString();
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
  const [data, setData] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const prevKeyRef = useRef('');

  useEffect(() => {
    const extra: Record<string, string> = {};
    if (params?.search) extra.search = params.search;
    if (params?.collection) extra.collection = params.collection;
    if (params?.isNew) extra.isNew = 'true';
    if (params?.category) extra.category = params.category;
    if (params?.priceMin !== undefined) extra.priceMin = String(params.priceMin);
    if (params?.priceMax !== undefined) extra.priceMax = String(params.priceMax);
    if (params?.sort) extra.sort = params.sort;
    if (params?.page) extra.page = String(params.page);
    if (params?.limit) extra.limit = String(params.limit);

    const url = buildUrl('products', extra);
    const key = url;
    if (prevKeyRef.current === key) return;
    prevKeyRef.current = key;

    let cancelled = false;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const products = json.products || json.data || [];
          setData(products);
          setTotal(json.total ?? products.length);
        }
      })
      .catch(() => {})
      .finally(() => {
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
  const [data, setData] = useState<HeroSlide[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    fetch(buildUrl('hero-slides'))
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const slides = Array.isArray(json) ? json : (json.data || json.slides || []);
          setData(slides);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ──── Collections ──── */
export function useCollections() {
  const [data, setData] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    fetch(buildUrl('collections'))
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const raw = Array.isArray(json) ? json : (json.data || json.collections || []);
          const names = raw.map((c: Collection | string) =>
            typeof c === 'string' ? c : (c.name || c.slug || '')
          ).filter(Boolean);
          setData(names);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ──── Product Gallery (static placeholder) ──── */
export function useProductGallery() {
  return { data: [] as string[] };
}

/* ──── Recommended Products ──── */
export function useRecommendedProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    fetch(buildUrl('products/recommended'))
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const products = Array.isArray(json) ? json : (json.data || json.products || []);
          setData(products);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}

/* ──── New Products ──── */
export function useNewProducts() {
  const [data, setData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    fetch(buildUrl('products/new'))
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const products = Array.isArray(json) ? json : (json.data || json.products || []);
          setData(products);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { data, loading };
}
