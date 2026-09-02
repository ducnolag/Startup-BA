'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

interface Props {
  /** Number of products in catalog (for trust signal) */
  totalProducts?: number;
}

export default function Hero({ totalProducts = 18 }: Props) {
  const sectionRef = useRef<HTMLElement>(null);
  const eyebrowRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const inputSlotRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      // Eyebrow fade in
      tl.fromTo(
        eyebrowRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6 }
      );

      // Title reveal — character-by-character would be ideal but line-by-line is cleaner
      const titleLines = titleRef.current?.querySelectorAll('.hero-line');
      if (titleLines) {
        tl.fromTo(
          titleLines,
          { opacity: 0, y: 32, skewY: 4 },
          { opacity: 1, y: 0, skewY: 0, duration: 0.9, stagger: 0.12 },
          '-=0.3'
        );
      }

      // Subtitle
      tl.fromTo(
        subtitleRef.current,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.7 },
        '-=0.4'
      );

      // Input
      tl.fromTo(
        inputSlotRef.current,
        { opacity: 0, y: 24 },
        { opacity: 1, y: 0, duration: 0.8 },
        '-=0.3'
      );

      // Trust signals
      tl.fromTo(
        trustRef.current?.querySelectorAll('.trust-item') ?? [],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.5, stagger: 0.08 },
        '-=0.2'
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-16 pb-12 md:pt-24 md:pb-16">
      {/* Subtle background decoration */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-40 blur-3xl"
          style={{
            background: 'radial-gradient(ellipse, rgba(0, 168, 212, 0.12) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="container-page text-center max-w-3xl">
        <div ref={eyebrowRef} className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep mb-5 opacity-0">
          Mua thông minh · AI price intelligence
        </div>

        <h1
          ref={titleRef}
          className="font-display font-bold text-ink leading-[1.05] tracking-tight mb-5"
          style={{
            fontSize: 'clamp(2.25rem, 5.5vw, 4rem)',
            letterSpacing: '-0.035em',
          }}
        >
          <span className="hero-line block opacity-0">
            Mua thông minh,
          </span>
          <span className="hero-line block opacity-0">
            không sập bẫy{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-brand">giá ảo</span>
              <span
                className="absolute bottom-1 left-0 right-0 h-2 bg-brand/20 -z-0 rounded-sm"
                aria-hidden
              />
            </span>
            .
          </span>
        </h1>

        <p
          ref={subtitleRef}
          className="text-lg text-ink-muted leading-relaxed max-w-xl mx-auto mb-10 opacity-0"
        >
          Dán link hoặc tên sản phẩm. AI phân tích giá 4 sàn, lịch sử 30 ngày, gợi ý nên mua hay đợi.
        </p>

        <div ref={inputSlotRef} className="opacity-0">
          {/* Input sẽ được inject từ page.tsx */}
          <slot name="input" />
        </div>

        {/* Trust signals — no icons */}
        <div ref={trustRef} className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-xs text-ink-subtle">
          <span className="trust-item opacity-0 inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            4 sàn TMĐT lớn nhất VN
          </span>
          <span className="trust-item opacity-0 inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            Lịch sử giá 30 ngày
          </span>
          <span className="trust-item opacity-0 inline-flex items-center gap-1.5">
            <span className="w-1 h-1 rounded-full bg-emerald-500" />
            {totalProducts}+ sản phẩm phổ biến
          </span>
        </div>
      </div>
    </section>
  );
}