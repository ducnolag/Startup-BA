// =====================================================================
// POST /api/storefront
// Body: { action: string, params?: Record<string, unknown> }
// Returns: { ok: true, data: ... } or { ok: false, error: string }
//
// Actions:
//   search          — params: { query, filters?, limit? } → Product[]
//   getProduct      — params: { productId }              → ProductDetails | null
//   getCart         — params: { sessionId }              → Cart
//   addToCart       — params: { sessionId, productId, quantity } → Cart
//   removeFromCart  — params: { sessionId, productId }   → Cart
//   placeOrder      — params: { sessionId }              → Order | null
//   getOrder        — params: { orderId }                → Order | null
//   getPolicies     — params: { query? }                 → Policy[]
//   getDisclosures  — params: { productId }              → Disclosure | null
// =====================================================================

import { NextResponse } from 'next/server';
import { vnBackend } from '@/lib/storefront/vn-backend';
import type { SearchFilters } from '@/lib/storefront/vn-backend';

export const dynamic = 'force-dynamic';
export const maxDuration = 10;

interface RequestBody {
  action?: string;
  params?: Record<string, unknown>;
}

function ok(data: unknown) {
  return NextResponse.json({ ok: true, data });
}

function fail(status: number, message: string) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

function asString(v: unknown, field: string): string {
  if (typeof v !== 'string' || !v.trim()) {
    throw new Error(`Missing or invalid "${field}"`);
  }
  return v.trim();
}

function asNumber(v: unknown, field: string, fallback?: number): number {
  const n = typeof v === 'number' ? v : Number(v);
  if (!Number.isFinite(n)) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing or invalid "${field}"`);
  }
  return n;
}

function asFilters(v: unknown): SearchFilters | undefined {
  if (!v || typeof v !== 'object') return undefined;
  const f = v as Record<string, unknown>;
  const out: SearchFilters = {};
  if (typeof f.min_price === 'number') out.min_price = f.min_price;
  if (typeof f.max_price === 'number') out.max_price = f.max_price;
  if (typeof f.category === 'string') out.category = f.category;
  return out;
}

export async function POST(request: Request) {
  let body: RequestBody;
  try {
    body = await request.json();
  } catch {
    return fail(400, 'Invalid JSON body');
  }

  const action = body?.action;
  const params = body?.params ?? {};

  try {
    switch (action) {
      case 'search': {
        const query = asString(params.query ?? '', 'query');
        const filters = asFilters(params.filters);
        const limit = params.limit !== undefined ? asNumber(params.limit, 'limit', 8) : 8;
        return ok(vnBackend.searchProducts(query, filters, limit));
      }

      case 'getProduct': {
        const productId = asString(params.productId, 'productId');
        const data = vnBackend.getProduct(productId);
        return ok(data);
      }

      case 'getCart': {
        const sessionId = asString(params.sessionId, 'sessionId');
        return ok(vnBackend.getCart(sessionId));
      }

      case 'addToCart': {
        const sessionId = asString(params.sessionId, 'sessionId');
        const productId = asString(params.productId, 'productId');
        const quantity = asNumber(params.quantity, 'quantity');
        if (quantity <= 0) return fail(400, 'quantity must be > 0');
        return ok(vnBackend.addToCart(sessionId, productId, quantity));
      }

      case 'removeFromCart': {
        const sessionId = asString(params.sessionId, 'sessionId');
        const productId = asString(params.productId, 'productId');
        return ok(vnBackend.removeFromCart(sessionId, productId));
      }

      case 'placeOrder': {
        const sessionId = asString(params.sessionId, 'sessionId');
        const order = vnBackend.placeOrder(sessionId);
        if (!order) return fail(400, 'Cart is empty');
        return ok(order);
      }

      case 'getOrder': {
        const orderId = asString(params.orderId, 'orderId');
        return ok(vnBackend.getOrder(orderId));
      }

      case 'getPolicies': {
        const query = typeof params.query === 'string' ? params.query : undefined;
        return ok(vnBackend.getPolicies(query));
      }

      case 'getDisclosures': {
        const productId = asString(params.productId, 'productId');
        return ok(vnBackend.getDisclosures(productId));
      }

      default:
        return fail(400, `Unknown action: ${String(action)}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return fail(400, message);
  }
}

// GET for quick testing — returns the list of supported actions
export async function GET() {
  return ok({
    actions: [
      'search',
      'getProduct',
      'getCart',
      'addToCart',
      'removeFromCart',
      'placeOrder',
      'getOrder',
      'getPolicies',
      'getDisclosures',
    ],
  });
}
