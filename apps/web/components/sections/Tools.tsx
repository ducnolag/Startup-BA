'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const tools = [
  {
    id: 'idea-to-tool',
    title: 'Idea-to-Tool — AI gợi ý công cụ',
    summary:
      'Mô tả vấn đề của bạn (sinh viên, founder, freelancer, SMB). AI phân loại, gợi ý 3 công cụ phù hợp kèm action plan cụ thể trong 30 giây.',
    href: '/tools/idea-to-tool',
    cta: 'Thử ngay',
    bullets: ['Phân loại 9 danh mục vấn đề', '3 công cụ + 3 bước hành động', 'Powered by Gemini — miễn phí'],
    highlight: 'Mới',
  },
  {
    id: 'gemini-translate',
    title: 'Gemini Translate — dịch nhanh 8 ngôn ngữ',
    summary:
      'Dịch Anh ↔ Việt và 6 ngôn ngữ khác, giữ nguyên ý và giọng văn. Dùng cho email, tài liệu, nội dung marketing.',
    href: '/tools/gemini-translate',
    cta: 'Mở công cụ',
    bullets: ['Hỗ trợ Việt, Anh, Trung, Nhật, Hàn, Pháp', 'Giữ format gốc (xuống dòng, bullet, code)', 'Dịch nhanh dưới 2 giây'],
    highlight: 'Mới',
  },
  {
    id: 'price-smart',
    title: 'Mua thông minh — phát hiện giá ảo',
    summary:
      'Dán link Shopee, Lazada, Tiki, TikTok Shop. AI phân tích giá 4 sàn, lịch sử 30 ngày, gợi ý mua ngay hay đợi.',
    href: '/tools/price-smart',
    cta: 'Mở công cụ',
    bullets: ['Phát hiện giá ảo thông minh', 'Gợi ý thời điểm mua tối ưu', 'So sánh 4 sàn + lịch sử 30 ngày'],
    highlight: 'AI',
  },
];

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!section || !heading || !grid) return;

    const cards = grid.querySelectorAll('.tool-card');

    const ctx = gsap.context(() => {
      // ── Section heading parallax ──
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

      // ── Cards stagger reveal with 3D rotation ──
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 80,
          rotateX: -6,
          scale: 0.9,
        },
        {
          opacity: 1,
          y: 0,
          rotateX: 0,
          scale: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Bullet points stagger per card ──
      cards.forEach((card) => {
        const bullets = card.querySelectorAll('.tool-bullet');
        gsap.fromTo(
          bullets,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.6,
            stagger: 0.08,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 75%',
              toggleActions: 'play none none none',
            },
          }
        );
      });
    });

    return () => ctx.revert();
  }, []);

  // ── 3D tilt on hover ──
  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const cards = grid.querySelectorAll<HTMLElement>('.tool-card');
    const cleanups: Array<() => void> = [];

    cards.forEach((el) => {
      el.style.transformStyle = 'preserve-3d';

      const move = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
          rotateY: x * 8,
          rotateX: -y * 8,
          transformPerspective: 800,
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const leave = () => {
        gsap.to(el, {
          rotateY: 0,
          rotateX: 0,
          duration: 0.5,
          ease: 'elastic.out(1,0.5)',
        });
      };

      el.addEventListener('mousemove', move);
      el.addEventListener('mouseleave', leave);
      cleanups.push(() => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <section ref={sectionRef} id="tools" className="py-20 md:py-28 bg-surface-muted border-y border-line">
      <div className="container-page">
        <div ref={headingRef} className="max-w-2xl mb-12 md:mb-16" style={{ opacity: 0 }}>
          <div className="eyebrow mb-4">Công cụ</div>
          <h2
            className="font-display font-bold text-ink tracking-tight text-3xl md:text-5xl leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Các công cụ hiện tại.
          </h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-2 gap-5 md:gap-6" style={{ perspective: '1000px' }}>
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              className="tool-card card card-hover card-gradient-border p-7 md:p-9 group block"
              style={{ opacity: 0 }}
            >
              <div className="flex items-start justify-between mb-6">
                <span className="chip chip-active">{tool.highlight}</span>
                <span className="text-xs font-medium text-ink-subtle">
                  0{tool.id === 'idea-to-tool' ? '1' : tool.id === 'gemini-translate' ? '2' : '3'}
                </span>
              </div>

              <h3
                className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-3"
                style={{ letterSpacing: '-0.02em' }}
              >
                {tool.title}
              </h3>
              <p className="text-ink-muted leading-relaxed mb-6">{tool.summary}</p>

              <ul className="space-y-2.5 mb-7">
                {tool.bullets.map((b) => (
                  <li
                    key={b}
                    className="tool-bullet flex items-start gap-2.5 text-sm text-ink-muted"
                    style={{ opacity: 0 }}
                  >
                    <span className="status-dot mt-2" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                {tool.cta}
                <span aria-hidden className="inline-block group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}