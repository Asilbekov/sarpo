/**
 * Commerce API proxy — server-side
 * Forwards requests to the external Laravel backend
 */

const API_BASE = 'https://staging.lume.uz/api/commerce';
const VENDOR_ID = '9e830a58-8fc7-41c9-a470-3b9cc2446069';
const SALE_POINT_ID = '9e979274-baf3-457d-b5f8-3d25042ebaf4';
const TIMEOUT = 8000;

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

export async function apiGet(endpoint: string, extra?: Record<string, string>): Promise<Response> {
  const url = buildUrl(endpoint, extra);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    const res = await fetch(url, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch {
    return new Response(JSON.stringify({ error: 'API unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

export async function apiPost(endpoint: string, body: unknown): Promise<Response> {
  const url = buildUrl(endpoint);
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT);
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    });
    clearTimeout(timer);
    return res;
  } catch {
    return new Response(JSON.stringify({ error: 'API unavailable' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
