'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const features = [
  {
    title: 'Nhanh',
    description: 'Tra cứu trong tích tắc. Tối ưu cho cả mobile và desktop.',
  },
  {
    title: 'An toàn',
    description: 'Không bán dữ liệu. Không tracking bên thứ ba.',
  },
  {
    title: 'Cảnh báo thông minh',
    description: 'Telegram, email hoặc web push — chọn kênh bạn thích.',
  },
  {
    title: 'Dữ liệu xác thực',
    description: 'Lịch sử giá từ API chính thức. Mỗi con số đều có nguồn.',
  },
  {
    title: 'Cộng đồng đóng góp',
    description: 'Review sản phẩm, chia sẻ mẹo săn sale và đánh giá sản phẩm.',
  },
  {
    title: 'Mở rộng liên tục',
    description: 'Chúng tôi sẽ cố gắng ra mắt các tool mới. Điều đó sẽ được lấy ý kiến từ mọi người.',
  },
];

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!section || !heading || !grid) return;

    const cards = grid.querySelectorAll('.feature-card');

    const ctx = gsap.context(() => {
      // ── Heading reveal ──
      gsap.fromTo(
        heading,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Feature cards stagger with scale + rotation ──
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 60,
          scale: 0.9,
          rotateY: -5,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateY: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Icon bounce on enter ──
      const icons = grid.querySelectorAll('.feature-icon');
      gsap.fromTo(
        icons,
        { scale: 0, rotation: -180 },
        {
          scale: 1,
          rotation: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: 'elastic.out(1,0.4)',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="features" className="py-20 md:py-28 bg-white">
      <div className="container-page">
        <div ref={headingRef} className="max-w-2xl mb-12 md:mb-16" style={{ opacity: 0 }}>
          <div className="eyebrow mb-4">Vì sao chọn Toolify</div>
          <h2
            className="font-display font-bold text-ink tracking-tight text-3xl md:text-5xl leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Các sản phẩm cần thiết và thiết thực
          </h2>
        </div>

        <div
          ref={gridRef}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-5"
          style={{ perspective: '1000px' }}
        >
          {features.map((f, i) => (
            <div
              key={f.title}
              className="feature-card card card-hover card-gradient-border p-7 md:p-8 group"
              style={{ opacity: 0, transformStyle: 'preserve-3d' }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="feature-icon text-2xl inline-block" style={{ transform: 'scale(0)' }}>
                </span>
                <div className="text-xs font-semibold tracking-wider text-ink-subtle">
                  0{i + 1}
                </div>
              </div>
              <h3 className="font-display font-semibold text-xl text-ink mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}