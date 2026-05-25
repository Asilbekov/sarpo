'use client';

import { useState, useEffect, useRef } from 'react';
import { Product, HeroSlide, Collection, fallbackProducts, fallbackHeroSlides, fallbackCollections, fallbackProductGallery } from '@/lib/sarpo-data';

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
    const qp = new URLSearchParams();
    if (params?.search) qp.set('search', params.search);
    if (params?.collection) qp.set('collection', params.collection);
    if (params?.isNew) qp.set('isNew', 'true');
    if (params?.category) qp.set('category', params.category);
    if (params?.priceMin !== undefined) qp.set('priceMin', String(params.priceMin));
    if (params?.priceMax !== undefined) qp.set('priceMax', String(params.priceMax));
    if (params?.sort) qp.set('sort', params.sort);
    if (params?.page) qp.set('page', String(params.page));
    if (params?.limit) qp.set('limit', String(params.limit));

    const qs = qp.toString();
    const url = `/api/commerce/products${qs ? `?${qs}` : ''}`;
    const key = url;
    if (prevKeyRef.current === key) return;
    prevKeyRef.current = key;

    let cancelled = false;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const products = json.products || json.data || [];
          if (products.length > 0) {
            setData(products);
            setTotal(json.total ?? products.length);
          }
          // If API returns empty — keep fallback data
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
  const [data, setData] = useState<HeroSlide[]>(fallbackHeroSlides);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    fetch('/api/commerce/hero-slides')
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const slides = Array.isArray(json) ? json : (json.data || json.slides || []);
          if (slides.length > 0) setData(slides);
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
  const [data, setData] = useState<string[]>(fallbackCollections);
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    fetch('/api/commerce/collections')
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const raw = Array.isArray(json) ? json : (json.data || json.collections || []);
          if (raw.length > 0) {
            const names = raw.map((c: Collection | string) =>
              typeof c === 'string' ? c : (c.name || c.slug || '')
            ).filter(Boolean);
            setData(names);
          }
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

    fetch('/api/commerce/products/recommended')
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const products = Array.isArray(json) ? json : (json.data || json.products || []);
          if (products.length > 0) setData(products);
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
  const [data, setData] = useState<Product[]>(fallbackProducts.filter((p) => p.isNew));
  const [loading, setLoading] = useState(true);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    fetch('/api/commerce/products/new')
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) {
          const products = Array.isArray(json) ? json : (json.data || json.products || []);
          if (products.length > 0) setData(products);
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
