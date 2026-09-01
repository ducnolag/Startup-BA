'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false });

const platforms = [
  { name: 'Shopee', color: '#EE4D2D' },
  { name: 'Lazada', color: '#0B48A0' },
  { name: 'Tiki', color: '#1A94FF' },
  { name: 'TikTok Shop', color: '#000000' },
  { name: 'Coursera', color: '#0056D2' },
  { name: 'Grab', color: '#00B14F' },
  { name: 'MoMo', color: '#A50064' },
  { name: 'Sendo', color: '#EE2624' },
];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);
  const card1Ref = useRef<HTMLDivElement>(null);
  const card2Ref = useRef<HTMLDivElement>(null);
  const marqueeWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const headline = headlineRef.current;
    const cards = cardsRef.current;
    const card1 = card1Ref.current;
    const card2 = card2Ref.current;
    if (!section || !headline || !cards) return;

    const ctx = gsap.context(() => {
      // ── Hero headline parallax: text goes up faster on scroll ──
      gsap.to(headline, {
        yPercent: -30,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      // ── Tool preview cards: stagger reveal with 3D rotation ──
      if (card1 && card2) {
        gsap.fromTo(
          [card1, card2],
          {
            opacity: 0,
            y: 80,
            rotateX: -8,
            scale: 0.92,
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
              trigger: cards,
              start: 'top 90%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // ── Cards parallax on scroll ──
      gsap.to(cards, {
        yPercent: -10,
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'center center',
          end: 'bottom top',
          scrub: 2,
        },
      });

      // ── Marquee fade-in (opacity only, no transform to avoid CSS animation conflict) ──
      const marquee = marqueeWrapperRef.current;
      if (marquee) {
        gsap.to(marquee, {
          opacity: 1,
          duration: 1,
          delay: 0.3,
          ease: 'power2.out',
        });
      }
    });

    return () => ctx.revert();
  }, []);

  // ── 3D tilt effect for cards ──
  useEffect(() => {
    const cards = [card1Ref.current, card2Ref.current];
    const handlers: Array<{
      el: HTMLElement;
      move: (e: MouseEvent) => void;
      leave: () => void;
    }> = [];

    cards.forEach((el) => {
      if (!el) return;
      el.style.transformStyle = 'preserve-3d';

      const move = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        gsap.to(el, {
          rotateY: x * 10,
          rotateX: -y * 10,
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
      handlers.push({ el, move, leave });
    });

    return () => {
      handlers.forEach(({ el, move, leave }) => {
        el.removeEventListener('mousemove', move);
        el.removeEventListener('mouseleave', leave);
      });
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative pt-28 md:pt-36 pb-16 md:pb-24 bg-white overflow-hidden"
      style={{ perspective: '1200px' }}
    >
      <Hero3D />

      <div className="relative container-page">
        {/* Top badge + headline */}
        <div ref={headlineRef} className="max-w-4xl">
          <Link
            href="/#vote"
            className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur border border-line shadow-sm transition-transform duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
            </span>
            <span className="text-xs font-medium text-ink">
              Đang phát triển thêm công cụ mới
            </span>
            <span className="text-xs text-ink-subtle">·</span>
            <span className="text-xs text-brand font-semibold">Bình chọn</span>
            <span className="text-xs text-brand font-semibold ml-0.5 group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </Link>

          <h1
            data-anim
            data-anim-delay="0.05"
            className="font-display font-bold text-ink tracking-tight leading-[1.02] text-balance"
            style={{ letterSpacing: '-0.04em' }}
          >
            <span className="block text-[clamp(2.5rem,7vw,5.5rem)] reveal-line">
              Tiết kiệm thời gian
            </span>
            <span
              className="block text-[clamp(2.5rem,7vw,5.5rem)] mt-1 reveal-line"
              style={{
                background:
                  'linear-gradient(130deg, #0a1a3a 0%, #00a8d4 50%, #0a1a3a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                paddingTop: '20px',
              }}
            >
              Tiết kiệm tiền bạc
            </span>
          </h1>

          <p
            data-anim
            data-anim-delay="0.15"
            className="mt-7 text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl"
          >
            Nền tảng công cụ thông minh cho người Việt. Giúp bạn tiết kiệm thời gian và tiền bạc.
            Miễn phí, không quảng cáo.
          </p>

          <div data-anim data-anim-delay="0.25" className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="#tools" className="btn-primary">
              Khám phá công cụ
            </Link>
            <Link href="#pricing" className="btn-ghost group">
              Xem bảng giá
              <span className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Two tool preview cards */}
        <div ref={cardsRef} className="mt-16 md:mt-20 grid lg:grid-cols-2 gap-4 md:gap-5" style={{ perspective: '1000px' }}>
          {/* Scholarship preview */}
          <div
            ref={card1Ref}
            className="group relative card p-6 md:p-7 overflow-hidden card-3d-tilt"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-deep mb-2">
                  Công cụ #1
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-ink">
                  Săn học bổng quốc tế
                </h3>
              </div>
              <Link
                href="/tools/scholarship"
                className="text-xs font-semibold text-brand hover:text-brand-deep flex items-center gap-1"
              >
                Mở <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="space-y-2">
              {[
                { tag: 'Chevening', flag: '🇬🇧', amount: '$40K+', days: '12 ngày' },
                { tag: 'Erasmus+', flag: '🇪🇺', amount: 'Toàn phần', days: '45 ngày' },
                { tag: 'Coursera', flag: '🎓', amount: 'Miễn phí', days: 'Còn hạn' },
              ].map((s) => (
                <div
                  key={s.tag}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-muted border border-transparent hover:border-line"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.flag}</span>
                    <div>
                      <div className="text-sm font-semibold text-ink">{s.tag}</div>
                      <div className="text-xs text-ink-muted">Hạn nộp {s.days}</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-brand-deep">{s.amount}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs text-ink-subtle">
              <span>500+ cơ hội đang mở</span>
              <span>Updated 2 giờ trước</span>
            </div>

            {/* Shine overlay on hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
          </div>

          {/* Price compare preview */}
          <div
            ref={card2Ref}
            className="group relative card p-6 md:p-7 overflow-hidden card-3d-tilt"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-deep mb-2">
                  Công cụ #2
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-ink">
                  So sánh giá thông minh
                </h3>
              </div>
              <Link
                href="/tools/price-compare"
                className="text-xs font-semibold text-brand hover:text-brand-deep flex items-center gap-1"
              >
                Mở <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Mini price chart */}
            <div className="relative h-32 rounded-lg bg-gradient-to-br from-surface-muted to-white border border-line p-4 overflow-hidden">
              <svg
                viewBox="0 0 200 80"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0a1a3a" />
                    <stop offset="100%" stopColor="#00a8d4" />
                  </linearGradient>
                  <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00a8d4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00a8d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 C20,55 40,62 60,50 C80,38 100,42 120,30 C140,18 160,25 180,15 L200,12 L200,80 L0,80 Z"
                  fill="url(#fillGrad)"
                />
                <path
                  d="M0,60 C20,55 40,62 60,50 C80,38 100,42 120,30 C140,18 160,25 180,15 L200,12"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="chart-line-draw"
                />
              </svg>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-ink-subtle">
                <span>90 ngày trước</span>
                <span className="font-semibold text-success">−28%</span>
                <span>Hôm nay</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { name: 'Shopee', price: '1.490k' },
                { name: 'Lazada', price: '1.490k' },
                { name: 'Tiki', price: '1.590k' },
                { name: 'TikTok', price: '1.450k' },
              ].map((p) => (
                <div
                  key={p.name}
                  className={`p-2.5 rounded-lg text-center border ${
                    p.name === 'TikTok'
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white border-line text-ink'
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                    {p.name}
                  </div>
                  <div className="text-xs font-bold mt-1">{p.price}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs text-ink-subtle">
              <span>5.000+ sản phẩm</span>
              <span className="text-success font-semibold">↓ Giá tốt nhất</span>
            </div>

            {/* Shine overlay on hover */}
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-tr from-transparent via-white/10 to-transparent" />
          </div>
        </div>

        {/* ═══════ Animated logo ticker — infinite marquee ═══════ */}
        <div
          ref={marqueeWrapperRef}
          className="mt-16 md:mt-20 pt-8 border-t border-line"
          style={{ opacity: 0 }}
        >
          <div className="flex items-center justify-between mb-6">
            <span className="text-sm font-medium text-ink-subtle">Được tin tưởng bởi các nền tảng:</span>
          </div>

          <div className="logo-marquee-container">
            <div className="logo-marquee" aria-hidden="false">
              {/* First set */}
              {platforms.map((platform, i) => (
                <div
                  key={`a-${i}`}
                  className="logo-marquee-item group"
                >
                  <span
                    className="font-bold text-xl tracking-tight transition-opacity duration-300 group-hover:!opacity-100"
                    style={{ color: platform.color, opacity: 0.4 }}
                  >
                    {platform.name}
                  </span>
                </div>
              ))}
              {/* Duplicate set for seamless loop */}
              {platforms.map((platform, i) => (
                <div
                  key={`b-${i}`}
                  className="logo-marquee-item group"
                  aria-hidden="true"
                >
                  <span
                    className="font-bold text-xl tracking-tight transition-opacity duration-300 group-hover:!opacity-100"
                    style={{ color: platform.color, opacity: 0.4 }}
                  >
                    {platform.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}