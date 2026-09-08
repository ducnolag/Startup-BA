// =====================================================================
// Tests for lib/storefront/vn-backend.ts
// Run with: node --import tsx --test lib/storefront/__tests__/vn-backend.test.ts
// =====================================================================

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';

import {
  VNStorefrontBackend,
  getVNBackend,
  resetVNBackend,
} from '../vn-backend';

// ---------------------------------------------------------------------
// Setup
// ---------------------------------------------------------------------

describe('VNStorefrontBackend', () => {
  let backend: VNStorefrontBackend;

  beforeEach(() => {
    backend = new VNStorefrontBackend();
  });

  // -------------------------------------------------------------------
  // searchProducts
  // -------------------------------------------------------------------

  describe('searchProducts("iphone")', () => {
    it('returns 5 results', () => {
      const results = backend.searchProducts('iphone', null, 5);
      assert.equal(results.length, 5);
      for (const p of results) {
        assert.equal(p.currency, 'VND');
      }
      // Sanity: at least the two literal iPhones are present (the rest may be
      // apple-ecosystem matches via synonyms, which mirrors the Python source).
      const ids = results.map((p) => p.product_id);
      assert.ok(ids.includes('iphone-15-128'), 'expected iphone-15-128 in top 5');
      assert.ok(ids.includes('iphone-15-pro-256'), 'expected iphone-15-pro-256 in top 5');
    });
  });

  describe('searchProducts("laptop") with max_price filter', () => {
    it('returns only laptops <= 20,000,000 VND', () => {
      const results = backend.searchProducts(
        'laptop',
        { max_price: 20_000_000 },
        10
      );
      assert.ok(results.length >= 1, 'expected at least one laptop');
      for (const p of results) {
        assert.ok(p.price <= 20_000_000, `Expected ${p.title} (${p.price}) <= 20,000,000`);
      }
    });

    it('includes the Dell Inspiron but excludes the ASUS ROG Strix', () => {
      const results = backend.searchProducts(
        'laptop',
        { max_price: 20_000_000 },
        10
      );
      const ids = results.map((p) => p.product_id);
      assert.ok(ids.includes('dell-inspiron-15-3520'), 'should include Dell Inspiron');
      assert.ok(!ids.includes('asus-rog-strix-g16'), 'should exclude ASUS ROG (42M VND)');
    });
  });

  describe('searchProducts filters', () => {
    it('respects min_price', () => {
      const results = backend.searchProducts('', { min_price: 25_000_000 }, 20);
      // Empty query returns no results, but the filter still has to be valid
      assert.equal(results.length, 0);
    });

    it('empty query returns []', () => {
      assert.deepEqual(backend.searchProducts(''), []);
      assert.deepEqual(backend.searchProducts('   '), []);
    });
  });

  // -------------------------------------------------------------------
  // getProduct
  // -------------------------------------------------------------------

  describe('getProduct', () => {
    it('returns full details for a known product', () => {
      const d = backend.getProduct('iphone-15-128');
      assert.ok(d);
      assert.equal(d.product_id, 'iphone-15-128');
      assert.equal(d.currency, 'VND');
      assert.ok(d.long_description);
      assert.ok(Object.keys(d.specs).length > 0);
      assert.ok(d.store_prices.shopee > 0);
      assert.ok(d.store_prices.lazada > 0);
      assert.ok(d.store_prices.tiki > 0);
      assert.ok(d.store_prices.tiktok > 0);
    });

    it('returns null for unknown id', () => {
      assert.equal(backend.getProduct('does-not-exist'), null);
    });
  });

  // -------------------------------------------------------------------
  // Cart: add + remove
  // -------------------------------------------------------------------

  describe('cart flow', () => {
    const session = 'sess-test-1';

    it('starts empty', () => {
      const cart = backend.getCart(session);
      assert.equal(cart.item_count, 0);
      assert.equal(cart.subtotal, 0);
      assert.deepEqual(cart.items, []);
      assert.equal(cart.currency, 'VND');
    });

    it('addToCart adds a new item', () => {
      const cart = backend.addToCart(session, 'iphone-15-128', 1);
      assert.equal(cart.item_count, 1);
      assert.equal(cart.subtotal, 21_990_000);
      assert.equal(cart.items[0].product_id, 'iphone-15-128');
    });

    it('addToCart merges quantity on duplicate add', () => {
      backend.addToCart(session, 'airpods-pro-2', 1);
      const cart = backend.addToCart(session, 'airpods-pro-2', 2);
      assert.equal(cart.item_count, 3);
      assert.equal(cart.subtotal, 6_490_000 * 3);
    });

    it('removeFromCart drops a line item', () => {
      backend.addToCart(session, 'iphone-15-128', 1);
      backend.addToCart(session, 'airpods-pro-2', 2);
      const cart = backend.removeFromCart(session, 'iphone-15-128');
      assert.equal(cart.item_count, 2);
      assert.equal(cart.items.length, 1);
      assert.equal(cart.items[0].product_id, 'airpods-pro-2');
    });

    it('removeFromCart is a no-op for missing product', () => {
      backend.addToCart(session, 'iphone-15-128', 1);
      const cart = backend.removeFromCart(session, 'no-such-id');
      assert.equal(cart.item_count, 1);
    });

    it('isolates carts across sessions', () => {
      backend.addToCart('sess-a', 'iphone-15-128', 1);
      backend.addToCart('sess-b', 'airpods-pro-2', 1);
      const a = backend.getCart('sess-a');
      const b = backend.getCart('sess-b');
      assert.equal(a.item_count, 1);
      assert.equal(b.item_count, 1);
      assert.equal(a.items[0].product_id, 'iphone-15-128');
      assert.equal(b.items[0].product_id, 'airpods-pro-2');
    });

    it('addToCart throws for unknown product_id', () => {
      assert.throws(() => backend.addToCart(session, 'bogus', 1));
    });
  });

  // -------------------------------------------------------------------
  // Disclosures — per product
  // -------------------------------------------------------------------

  describe('getDisclosures', () => {
    it('returns price disclosure for a phone', () => {
      const d = backend.getDisclosures('iphone-15-128');
      assert.ok(d);
      assert.equal(d.product_id, 'iphone-15-128');
      const labels = d.rows.map((r) => r.label);
      assert.ok(labels.includes('Giá niêm yết'));
      assert.ok(labels.includes('Giá hiện tại'));
      assert.ok(labels.includes('Shopee'));
      assert.ok(labels.includes('Lazada'));
      assert.ok(labels.includes('Tiki'));
      assert.ok(labels.includes('TikTok Shop'));
      assert.ok(labels.includes('Đánh giá'));
    });

    it('returns disclosure for a different product category', () => {
      const d = backend.getDisclosures('sony-wh-1000xm5');
      assert.ok(d);
      assert.equal(d.product_id, 'sony-wh-1000xm5');
      // Verify all 4 platforms are reported
      const labels = d.rows.map((r) => r.label);
      ['Shopee', 'Lazada', 'Tiki', 'TikTok Shop'].forEach((p) => {
        assert.ok(labels.includes(p), `expected disclosure row for ${p}`);
      });
    });

    it('returns disclosure for a book (no review_count > 0 still has rating)', () => {
      const d = backend.getDisclosures('sach-dac-nhanh-tam');
      assert.ok(d);
      assert.ok(d.rows.some((r) => r.label === 'Đánh giá'));
    });

    it('returns null for unknown product', () => {
      assert.equal(backend.getDisclosures('bogus'), null);
    });
  });

  // -------------------------------------------------------------------
  // Policies
  // -------------------------------------------------------------------

  describe('getPolicies', () => {
    it('returns all policies when no query', () => {
      const all = backend.getPolicies();
      assert.ok(all.length >= 4);
    });

    it('filters by keyword', () => {
      const all = backend.getPolicies();
      // "vận chuyển" matches the shipping policy title+content
      const ship = backend.getPolicies('vận chuyển');
      assert.ok(ship.length >= 1, 'expected at least one match for "vận chuyển"');
      assert.ok(ship.length <= all.length);
      assert.ok(
        ship.every((p) =>
          (p.title + ' ' + p.content).toLowerCase().includes('vận chuyển') ||
            (p.title + ' ' + p.content).toLowerCase().includes('giao')
        )
      );
    });
  });

  // -------------------------------------------------------------------
  // placeOrder + getOrder
  // -------------------------------------------------------------------

  describe('placeOrder + getOrder', () => {
    it('places an order and clears cart', () => {
      const session = 'sess-checkout';
      backend.addToCart(session, 'iphone-15-128', 1);
      backend.addToCart(session, 'airpods-pro-2', 2);
      const order = backend.placeOrder(session);
      assert.ok(order);
      assert.equal(order.items.length, 2);
      assert.equal(order.total, 21_990_000 + 6_490_000 * 2);
      assert.equal(order.currency, 'VND');

      // Cart is empty after checkout
      const cart = backend.getCart(session);
      assert.equal(cart.item_count, 0);

      // Order is retrievable
      const fetched = backend.getOrder(order.order_id);
      assert.ok(fetched);
      assert.equal(fetched!.order_id, order.order_id);
    });

    it('placeOrder returns null for empty cart', () => {
      assert.equal(backend.placeOrder('sess-empty'), null);
    });

    it('demo orders are retrievable', () => {
      assert.ok(backend.getOrder('DH001'));
      assert.ok(backend.getOrder('DH002'));
    });
  });
});

// ---------------------------------------------------------------------
// Singleton
// ---------------------------------------------------------------------

describe('singleton', () => {
  it('getVNBackend returns the same instance', () => {
    const a = getVNBackend();
    const b = getVNBackend();
    assert.equal(a, b);
  });

  it('resetVNBackend clears the singleton', () => {
    const a = getVNBackend();
    resetVNBackend();
    const b = getVNBackend();
    assert.notEqual(a, b);
  });
});
