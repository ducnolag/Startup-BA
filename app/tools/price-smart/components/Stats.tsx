'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STATS = [
  { value: '4', label: 'Sàn TMĐT VN', desc: 'Shopee, Lazada, Tiki, TikTok Shop' },
  { value: '30', label: 'Ngày lịch sử', desc: 'Theo dõi xu hướng giá mỗi ngày' },
  { value: '18+', label: 'Sản phẩm', desc: 'Catalog đang được giám sát' },
  { value: '<2s', label: 'Tốc độ AI', desc: 'Phân tích Gemini Flash' },
];

export default function Stats() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const stats = sectionRef.current?.querySelectorAll('.stat-item') ?? [];
      gsap.fromTo(
        stats,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 border-t border-line">
      <div className="container-page">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {STATS.map((s) => (
            <div key={s.label} className="stat-item opacity-0">
              <div className="font-display font-bold text-ink leading-none tracking-tight mb-2"
                style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', letterSpacing: '-0.03em' }}
              >
                {s.value}
              </div>
              <div className="text-sm font-semibold text-ink mb-1">
                {s.label}
              </div>
              <div className="text-xs text-ink-subtle leading-relaxed">
                {s.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}