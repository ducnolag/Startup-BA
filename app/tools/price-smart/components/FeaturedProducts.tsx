'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CATALOG } from '@/lib/price/data';
import { CATEGORIES } from '@/lib/constants';
import ProductCard from './ProductCard';
import type { ProductRecord } from '@/lib/price/types';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface Props {
  onPick: (p: ProductRecord) => void;
}

export default function FeaturedProducts({ onPick }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        sectionRef.current?.querySelector('.section-heading') ?? null,
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      const cards = gridRef.current?.querySelectorAll('.product-grid-card') ?? [];
      gsap.fromTo(
        cards,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.06,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 90%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20">
      <div className="container-page">
        <div className="section-heading mb-10 opacity-0">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep mb-3">
            Đang được quan tâm
          </div>
          <h2 className="font-display font-bold text-ink tracking-tight text-2xl md:text-3xl mb-2" style={{ letterSpacing: '-0.025em' }}>
            Sản phẩm phổ biến nhất hôm nay
          </h2>
          <p className="text-ink-muted">
            Click vào bất kỳ sản phẩm nào để xem phân tích chi tiết
          </p>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          <span className="text-[11px] uppercase tracking-wider text-ink-subtle mr-2">Danh mục</span>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                const p = CATALOG.find((x) => x.category === cat.id);
                if (p) onPick(p);
              }}
              className="text-xs px-3 py-1.5 rounded-full bg-surface-muted hover:bg-surface-subtle text-ink-muted hover:text-ink transition-colors"
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product grid */}
        <div ref={gridRef} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
          {CATALOG.map((p) => (
            <div key={p.id} className="product-grid-card opacity-0">
              <ProductCard product={p} onPick={onPick} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}