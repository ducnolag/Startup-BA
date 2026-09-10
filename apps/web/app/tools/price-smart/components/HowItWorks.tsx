'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const STEPS = [
  {
    n: '01',
    title: 'Dán link hoặc tên sản phẩm',
    desc: 'Shopee, Lazada, Tiki, TikTok Shop — hoặc chỉ cần gõ tên. AI tự động nhận diện sản phẩm.',
  },
  {
    n: '02',
    title: 'AI quét 4 sàn + lịch sử 30 ngày',
    desc: 'So sánh giá hiện tại, trung bình, thấp nhất, cao nhất. Phát hiện biến động bất thường.',
  },
  {
    n: '03',
    title: 'Nhận verdict mua ngay / đợi / cảnh báo',
    desc: 'Kèm lý do cụ thể, gợi ý thời điểm mua tối ưu và danh sách shop đang có giá tốt nhất.',
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);

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

      const steps = sectionRef.current?.querySelectorAll('.step-item') ?? [];
      gsap.fromTo(
        steps,
        { opacity: 0, y: 32 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} className="py-16 md:py-20 bg-surface-muted border-y border-line">
      <div className="container-page">
        <div className="section-heading mb-12 md:mb-16 opacity-0 max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep mb-3">
            Cách hoạt động
          </div>
          <h2 className="font-display font-bold text-ink tracking-tight text-2xl md:text-3xl mb-3" style={{ letterSpacing: '-0.025em' }}>
            3 bước để mua thông minh hơn
          </h2>
          <p className="text-ink-muted">
            Không cần cài app, không cần đăng ký. Mở trang, dán link, nhận verdict trong 2 giây.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6 relative">
          {/* Connector */}
          <div className="hidden md:block absolute top-8 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-line to-transparent" aria-hidden />

          {STEPS.map((step) => (
            <div
              key={step.n}
              className="step-item bg-white rounded-2xl p-6 md:p-8 border border-line opacity-0 relative"
            >
              {/* Number */}
              <div className="text-[11px] font-semibold text-ink-subtle tracking-wider mb-4">
                {step.n}
              </div>

              {/* Title */}
              <h3 className="font-display font-bold text-lg text-ink mb-3 tracking-tight">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-ink-muted leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}