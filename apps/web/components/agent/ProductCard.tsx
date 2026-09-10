'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ShoppingCart, Star, Tag } from 'lucide-react';
import type { Product } from '@/lib/storefront/vn-backend';
import { formatVND, formatDiscount, getStarRating, formatReviewCount } from '@/lib/agent/format';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: Product;
  isBestPrice?: boolean;
  tiltEnabled?: boolean;
  onSelect?: (product: Product) => void;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({
  product,
  isBestPrice = false,
  tiltEnabled = true,
  onSelect,
  onAddToCart,
}: ProductCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Check prefers-reduced-motion
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(mql.matches);
    update();
    if (mql.addEventListener) {
      mql.addEventListener('change', update);
      return () => mql.removeEventListener('change', update);
    }
    mql.addListener(update);
    return () => mql.removeListener(update);
  }, []);

  // Entrance animation
  useEffect(() => {
    if (!cardRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: reducedMotion ? 0.2 : 0.6, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, [reducedMotion]);

  // Mouse tilt effect
  useEffect(() => {
    if (!cardRef.current || reducedMotion || !tiltEnabled) return;

    const card = cardRef.current;
    const maxRotation = 10;

    const rotateX = gsap.quickTo(card, 'rotateX', { duration: 0.4, ease: 'power2.out' });
    const rotateY = gsap.quickTo(card, 'rotateY', { duration: 0.4, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX(-y * maxRotation);
      rotateY(x * maxRotation);
    };

    const handleMouseLeave = () => {
      rotateX(0);
      rotateY(0);
      setIsHovered(false);
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion, tiltEnabled]);

  const hasDiscount = product.original_price !== null && product.original_price > product.price;
  const discount = hasDiscount
    ? formatDiscount(product.original_price!, product.price)
    : null;

  const stars = getStarRating(product.rating);

  const handleClick = () => {
    onSelect?.(product);
  };

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  return (
    <div
      ref={cardRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      style={{ perspective: '1000px' }}
      className={cn(
        'relative cursor-pointer transition-shadow',
        isHovered && tiltEnabled && !reducedMotion ? 'shadow-card-hover' : 'shadow-card',
        'rounded-[6px] bg-white border border-line overflow-hidden group',
        isBestPrice && 'ring-2 ring-emerald-500/50 ring-offset-1'
      )}
    >
      {/* Best price glow */}
      {isBestPrice && (
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none z-10" />
      )}

      {/* Image placeholder */}
      <div className="relative h-36 bg-surface-muted overflow-hidden">
        {product.image_url ? (
          <img
            src={product.image_url}
            alt={product.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-lg bg-surface-subtle flex items-center justify-center text-3xl">
              {product.category === 'Điện thoại' ? '📱' :
               product.category === 'Laptop' ? '💻' :
               product.category === 'Tai nghe' ? '🎧' :
               product.category === 'Máy tính bảng' ? '📲' :
               product.category === 'Đồng hồ thông minh' ? '⌚' :
               product.category === 'Phụ kiện' ? '🔌' : '📦'}
            </div>
          </div>
        )}

        {/* Labels */}
        {product.labels.length > 0 && (
          <div className="absolute top-2 left-2 flex flex-wrap gap-1">
            {product.labels.slice(0, 2).map((label) => (
              <span
                key={label}
                className="px-1.5 py-0.5 text-[10px] font-medium bg-white/90 backdrop-blur-sm rounded text-ink"
              >
                {label}
              </span>
            ))}
          </div>
        )}

        {/* Discount badge */}
        {discount && (
          <div className="absolute top-2 right-2 px-1.5 py-0.5 bg-danger text-white text-[10px] font-bold rounded">
            {discount}
          </div>
        )}

        {/* Best price badge */}
        {isBestPrice && (
          <div className="absolute bottom-2 left-2 px-2 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded flex items-center gap-1">
            <Tag className="w-3 h-3" />
            Giá tốt nhất
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        {/* Brand */}
        {product.brand && (
          <div className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider mb-1">
            {product.brand}
          </div>
        )}

        {/* Title */}
        <h3 className="text-sm font-medium text-ink leading-snug line-clamp-2 mb-2">
          {product.title}
        </h3>

        {/* Rating */}
        {stars.length > 0 && (
          <div className="flex items-center gap-1.5 mb-2">
            <div className="flex">
              {stars.map((star, i) => (
                <Star
                  key={i}
                  className={cn(
                    'w-3 h-3',
                    star === 'filled' ? 'fill-amber-400 text-amber-400' :
                    star === 'half' ? 'fill-amber-400/50 text-amber-400' :
                    'text-slate-200'
                  )}
                />
              ))}
            </div>
            {product.rating && (
              <span className="text-[10px] text-ink-muted font-mono">
                {product.rating.toFixed(1)}
              </span>
            )}
            {product.review_count && (
              <span className="text-[10px] text-ink-subtle">
                ({formatReviewCount(product.review_count)})
              </span>
            )}
          </div>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-3">
          <span className="text-base font-bold font-mono text-ink">
            {formatVND(product.price)}
          </span>
          {hasDiscount && product.original_price && (
            <span className="text-xs text-ink-subtle line-through font-mono">
              {formatVND(product.original_price)}
            </span>
          )}
        </div>

        {/* Stock indicator */}
        <div className="flex items-center justify-between">
          <span className={cn(
            'text-[10px] font-medium',
            product.in_stock ? 'text-emerald-600' : 'text-danger'
          )}>
            {product.in_stock ? 'Còn hàng' : 'Hết hàng'}
          </span>

          {/* Add to cart button */}
          {onAddToCart && product.in_stock && (
            <button
              onClick={handleCartClick}
              className="p-1.5 rounded-md bg-brand/10 text-brand hover:bg-brand hover:text-white transition-colors"
              aria-label="Thêm vào giỏ hàng"
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
