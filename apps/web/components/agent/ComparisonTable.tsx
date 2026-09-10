'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { Check, TrendingUp } from 'lucide-react';
import type { Product } from '@/lib/storefront/vn-backend';
import { formatVND, computeDelta, getStarRating, formatReviewCount, getCategoryMaterial } from '@/lib/agent/format';
import { cn } from '@/lib/utils';

interface ComparisonTableProps {
  products: Product[];
  bestPickIndex?: number;
  showDelta?: boolean;
  tiltEnabled?: boolean;
}

const MATERIAL_COLORS = [
  'from-blue-500/20',
  'from-green-500/20',
  'from-purple-500/20',
  'from-orange-500/20',
];

const MATERIAL_BORDER = [
  'border-blue-500/30',
  'border-green-500/30',
  'border-purple-500/30',
  'border-orange-500/30',
];

export default function ComparisonTable({
  products,
  bestPickIndex,
  showDelta = true,
  tiltEnabled = true,
}: ComparisonTableProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [animatedDeltas, setAnimatedDeltas] = useState<Record<string, number>>({});
  const deltaTargetsRef = useRef<Record<string, number>>({});

  // Auto-detect best price if not provided
  const effectiveBestIndex = bestPickIndex ?? (() => {
    let minIdx = 0;
    let minPrice = products[0]?.price ?? 0;
    products.forEach((p, i) => {
      if (p.price < minPrice) {
        minPrice = p.price;
        minIdx = i;
      }
    });
    return minIdx;
  })();

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
    if (!containerRef.current || reducedMotion) return;

    const columns = containerRef.current.querySelectorAll('.comparison-column');
    const ctx = gsap.context(() => {
      gsap.fromTo(
        columns,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.15,
          ease: 'power3.out',
        }
      );
    });

    return () => ctx.revert();
  }, [reducedMotion, products]);

  // Compute deltas
  const deltas = showDelta ? computeDelta(products, effectiveBestIndex) : {};

  // Count-up animation for deltas
  useEffect(() => {
    if (!showDelta || reducedMotion) {
      setAnimatedDeltas(deltas);
      return;
    }

    // Set targets
    deltaTargetsRef.current = { ...deltas };

    // Animate from 0 to target
    const newAnimated: Record<string, number> = {};
    for (const id of Object.keys(deltas)) {
      newAnimated[id] = 0;
    }
    setAnimatedDeltas(newAnimated);

    // Batch the animations
    const ctx = gsap.context(() => {
      for (const [productId, target] of Object.entries(deltas)) {
        gsap.to(
          { val: 0 },
          {
            val: target,
            duration: 0.8,
            delay: 0.3,
            ease: 'power2.out',
            onUpdate: function () {
              setAnimatedDeltas((prev) => ({
                ...prev,
                [productId]: Math.round(this.targets()[0].val),
              }));
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, [deltas, showDelta, reducedMotion]);

  // Mouse tilt effect on entire table
  useEffect(() => {
    if (!containerRef.current || reducedMotion || !tiltEnabled) return;

    const container = containerRef.current;
    const maxRotation = 6;

    const rotateX = gsap.quickTo(container, 'rotateX', { duration: 0.5, ease: 'power2.out' });
    const rotateY = gsap.quickTo(container, 'rotateY', { duration: 0.5, ease: 'power2.out' });

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      rotateX(-y * maxRotation);
      rotateY(x * maxRotation);
    };

    const handleMouseLeave = () => {
      rotateX(0);
      rotateY(0);
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion, tiltEnabled]);

  if (products.length === 0) {
    return (
      <div className="text-center py-8 text-ink-muted">
        Không có sản phẩm để so sánh
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div
        ref={containerRef}
        style={{ perspective: '1200px' }}
        className="inline-flex min-w-full gap-4 pb-4"
      >
        {products.map((product, index) => {
          const isBest = index === effectiveBestIndex;
          const delta = animatedDeltas[product.product_id] ?? 0;
          const hasDiscount = product.original_price !== null && product.original_price > product.price;
          const stars = getStarRating(product.rating);
          const material = getCategoryMaterial(product.category);
          const colorIdx = index % MATERIAL_COLORS.length;
          const bgGradient = MATERIAL_COLORS[colorIdx];
          const borderColor = MATERIAL_BORDER[colorIdx];

          return (
            <div
              key={product.product_id}
              className={cn(
                'comparison-column flex-1 min-w-[220px] max-w-[280px] rounded-[8px] border bg-white overflow-hidden transition-shadow',
                borderColor,
                isBest ? 'ring-2 ring-emerald-500/50 shadow-lg' : 'shadow-card'
              )}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Best pick header */}
              {isBest && (
                <div className="bg-emerald-500 text-white text-xs font-bold px-3 py-2 flex items-center gap-1.5">
                  <Check className="w-4 h-4" />
                  Đề xuất
                </div>
              )}

              {/* Product image */}
              <div className={cn('h-32 bg-gradient-to-br', bgGradient, 'flex items-center justify-center')}>
                {product.image_url ? (
                  <img
                    src={product.image_url}
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-5xl">
                    {product.category === 'Điện thoại' ? '📱' :
                     product.category === 'Laptop' ? '💻' :
                     product.category === 'Tai nghe' ? '🎧' :
                     product.category === 'Máy tính bảng' ? '📲' :
                     product.category === 'Đồng hồ thông minh' ? '⌚' :
                     product.category === 'Phụ kiện' ? '🔌' : '📦'}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                {/* Brand */}
                {product.brand && (
                  <div className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider mb-1">
                    {product.brand}
                  </div>
                )}

                {/* Title */}
                <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-2 mb-3">
                  {product.title}
                </h3>

                {/* Rating */}
                {stars.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <div className="flex">
                      {stars.map((star, i) => (
                        <span
                          key={i}
                          className={cn(
                            'w-3 h-3 text-xs',
                            star === 'filled' ? 'text-amber-400' :
                            star === 'half' ? 'text-amber-400/50' :
                            'text-slate-200'
                          )}
                        >
                          ★
                        </span>
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
                <div className="mb-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-lg font-bold font-mono text-ink">
                      {formatVND(product.price)}
                    </span>
                  </div>
                  {hasDiscount && product.original_price && (
                    <span className="text-xs text-ink-subtle line-through font-mono">
                      {formatVND(product.original_price)}
                    </span>
                  )}
                </div>

                {/* Delta indicator */}
                {showDelta && delta > 0 && (
                  <div className="flex items-center gap-1.5 px-2 py-1.5 bg-surface-muted rounded-md mb-3">
                    <TrendingUp className="w-3.5 h-3.5 text-danger" />
                    <span className="text-xs font-medium text-danger font-mono">
                      +{formatVND(delta)}
                    </span>
                    <span className="text-[10px] text-ink-subtle">đắt hơn</span>
                  </div>
                )}

                {/* Stock */}
                <div className={cn(
                  'text-xs font-medium',
                  product.in_stock ? 'text-emerald-600' : 'text-danger'
                )}>
                  {product.in_stock ? '✓ Còn hàng' : '✗ Hết hàng'}
                </div>

                {/* Category tag */}
                <div className="mt-3">
                  <span className="text-[10px] font-medium text-ink-subtle px-2 py-0.5 bg-surface-muted rounded">
                    {material.label}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
