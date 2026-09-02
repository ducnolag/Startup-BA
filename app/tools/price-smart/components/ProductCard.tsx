'use client';

import type { ProductRecord } from '@/lib/price/types';
import { cn } from '@/lib/utils';
import ProductImage from './ProductImage';

interface Props {
  product: ProductRecord;
  onPick?: (p: ProductRecord) => void;
  variant?: 'default' | 'compact';
}

/**
 * Product card e-commerce style.
 * - Hình ảnh lớn phía trên (4:5 ratio)
 * - Discount badge góc trái trên
 * - Sold count góc phải dưới (overlay ảnh)
 * - Brand + name + rating
 * - Price lớn (current) + original gạch ngang + % giảm
 * - Verdict chip nhỏ
 */
export default function ProductCard({ product, onPick, variant = 'default' }: Props) {
  const discount = product.discountPct ?? Math.round(((product.originalPrice - product.currentPrice) / product.originalPrice) * 100);
  const savings = product.originalPrice - product.currentPrice;

  const verdictLabel: Record<string, { label: string; color: string }> = {
    'mua-ngay': { label: 'Mua ngay', color: 'text-emerald-700 bg-emerald-50' },
    'doi-them': { label: 'Đợi thêm', color: 'text-amber-700 bg-amber-50' },
    'gia-ao': { label: 'Giá ảo', color: 'text-red-700 bg-red-50' },
  };
  const verdict = verdictLabel[product.recommendation];

  return (
    <button
      onClick={() => onPick?.(product)}
      className={cn(
        'group bg-white rounded-2xl overflow-hidden text-left',
        'border border-line hover:border-line-strong',
        'transition-all duration-300',
        'hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1',
        variant === 'default' ? 'p-0' : 'p-0'
      )}
    >
      {/* Image */}
      <div className="relative aspect-[4/5] overflow-hidden">
        <ProductImage
          src={product.imageUrl}
          alt={product.name}
          emoji={product.image}
          brand={product.brand}
          gradient={product.gradient}
          className="absolute inset-0"
        />

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
            -{discount}%
          </div>
        )}

        {/* Verdict badge (top-right) */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md backdrop-blur-md',
              verdict.color
            )}
          >
            {verdict.label}
          </span>
        </div>

        {/* Sold count (bottom-left overlay) */}
        {product.soldCount && product.soldCount > 0 && (
          <div className="absolute bottom-3 left-3 right-3 flex justify-end">
            <span className="text-[10px] text-white bg-black/40 backdrop-blur-md px-2 py-0.5 rounded-md font-medium">
              Đã bán {product.soldCount > 1000 ? `${(product.soldCount / 1000).toFixed(1)}k` : product.soldCount}
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className={cn('p-4', variant === 'compact' && 'p-3')}>
        {/* Brand */}
        <div className="text-[11px] font-medium text-ink-subtle uppercase tracking-wider mb-1">
          {product.brand}
        </div>

        {/* Name */}
        <h3
          className={cn(
            'font-medium text-ink leading-snug line-clamp-2 mb-2',
            variant === 'default' ? 'text-sm' : 'text-xs'
          )}
        >
          {product.name}
        </h3>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3 text-xs">
          <span className="text-amber-500 text-[10px]">★</span>
          <span className="font-medium text-ink">{product.rating}</span>
          <span className="text-ink-subtle">({product.reviewCount > 1000 ? `${(product.reviewCount / 1000).toFixed(1)}k` : product.reviewCount})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="font-bold text-ink text-lg tabular-nums">
            {product.currentPrice.toLocaleString('vi-VN')}
            <span className="text-sm font-medium">đ</span>
          </span>
          {product.originalPrice > product.currentPrice && (
            <span className="text-xs text-ink-subtle line-through tabular-nums">
              {product.originalPrice.toLocaleString('vi-VN')}đ
            </span>
          )}
        </div>
        {savings > 0 && (
          <div className="text-[10px] text-emerald-600 font-medium mt-0.5">
            Tiết kiệm {savings.toLocaleString('vi-VN')}đ
          </div>
        )}
      </div>
    </button>
  );
}