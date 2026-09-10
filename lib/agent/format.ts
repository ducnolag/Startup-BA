// =====================================================================
// Shopping Agent — Format helpers
// =====================================================================

import type { Product } from '@/lib/storefront/vn-backend';

// ---------------------------------------------------------------------------
// Price formatting
// ---------------------------------------------------------------------------

/**
 * Format VND price: 21990000 → "21.990.000 ₫"
 */
export function formatVND(price: number): string {
  return new Intl.NumberFormat('vi-VN').format(price) + ' ₫';
}

/**
 * Format discount percentage: original=100, current=80 → "-20%"
 */
export function formatDiscount(original: number, current: number): string {
  const pct = Math.round((1 - current / original) * 100);
  return `-${pct}%`;
}

/**
 * Short VND format for badges: 21990000 → "21.9M"
 */
export function formatVNDShort(price: number): string {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)}M`;
  }
  if (price >= 1_000) {
    return `${Math.round(price / 1_000)}K`;
  }
  return `${price}`;
}

// ---------------------------------------------------------------------------
// Comparison helpers
// ---------------------------------------------------------------------------

/**
 * Compute delta (price difference) from best price.
 * Returns a map of product_id → delta (positive = more expensive).
 */
export function computeDelta(
  products: Product[],
  bestIdx: number
): Record<string, number> {
  const best = products[bestIdx].price;
  return Object.fromEntries(
    products.map((p) => [p.product_id, p.price - best])
  );
}

/**
 * Find the best (lowest) price index in a product array.
 */
export function findBestPriceIndex(products: Product[]): number {
  if (products.length === 0) return 0;
  let minIdx = 0;
  let minPrice = products[0].price;
  for (let i = 1; i < products.length; i++) {
    if (products[i].price < minPrice) {
      minPrice = products[i].price;
      minIdx = i;
    }
  }
  return minIdx;
}

// ---------------------------------------------------------------------------
// Category → material color mapping for ComparisonTable
// ---------------------------------------------------------------------------

export const CATEGORY_MATERIALS: Record<string, { color: string; label: string; border: string }> = {
  'Điện thoại': { color: 'from-blue-500/20', label: 'Di động', border: 'border-blue-500/30' },
  laptop:        { color: 'from-green-500/20', label: 'Công nghệ', border: 'border-green-500/30' },
  'Laptop':      { color: 'from-green-500/20', label: 'Công nghệ', border: 'border-green-500/30' },
  'Tai nghe':    { color: 'from-purple-500/20', label: 'Âm thanh', border: 'border-purple-500/30' },
  'Máy tính bảng': { color: 'from-orange-500/20', label: 'Tablet', border: 'border-orange-500/30' },
  'Đồng hồ thông minh': { color: 'from-rose-500/20', label: 'Đồng hồ', border: 'border-rose-500/30' },
  'Phụ kiện':    { color: 'from-cyan-500/20', label: 'Phụ kiện', border: 'border-cyan-500/30' },
  'Ổ cứng':      { color: 'from-amber-500/20', label: 'Lưu trữ', border: 'border-amber-500/30' },
  'Thời trang':  { color: 'from-pink-500/20', label: 'Thời trang', border: 'border-pink-500/30' },
  'Sách':        { color: 'from-emerald-500/20', label: 'Sách', border: 'border-emerald-500/30' },
  default:       { color: 'from-slate-500/20', label: 'Sản phẩm', border: 'border-slate-500/30' },
};

/**
 * Get material config for a product category.
 */
export function getCategoryMaterial(category: string | null): typeof CATEGORY_MATERIALS['default'] {
  if (!category) return CATEGORY_MATERIALS['default'];
  return CATEGORY_MATERIALS[category] ?? CATEGORY_MATERIALS['default'];
}

// ---------------------------------------------------------------------------
// Rating helpers
// ---------------------------------------------------------------------------

/**
 * Render star rating as filled/half/empty.
 * Returns an array of 'filled' | 'half' | 'empty'.
 */
export function getStarRating(rating: number | null): Array<'filled' | 'half' | 'empty'> {
  if (rating === null) return [];
  const stars: Array<'filled' | 'half' | 'empty'> = [];
  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push('filled');
    } else if (rating >= i - 0.5) {
      stars.push('half');
    } else {
      stars.push('empty');
    }
  }
  return stars;
}

// ---------------------------------------------------------------------------
// Review count formatting
// ---------------------------------------------------------------------------

/**
 * Format review count: 12847 → "12.8K"
 */
export function formatReviewCount(count: number | null): string {
  if (count === null) return '';
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}
