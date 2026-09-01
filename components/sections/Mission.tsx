'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const impact = [
  {
    value: 100,
    displayValue: '100',
    unit: 'suất',
    label: 'Học bổng được trao',
    detail: 'Nếu giúp 100 SV nhận học bổng trung bình 20 triệu/suất = 2 tỷ VNĐ giá trị giáo dục.',
  },
  {
    value: 1000000000,
    displayValue: '1 tỷ',
    unit: 'VNĐ',
    label: 'Tiết kiệm mỗi năm',
    detail: '5.000 user tiết kiệm trung bình 200k/tháng khi mua sắm thông minh.',
  },
  {
    value: 2350000,
    displayValue: '2.35M',
    unit: 'SV',
    label: 'Đại học tại VN',
    detail: 'Thị trường mục tiêu — tăng 37% mỗi 5 năm.',
  },
];

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!section || !heading || !grid) return;

    const cards = grid.querySelectorAll('.mission-card');

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

      // ── Cards stagger parallax reveal ──
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 60,
          scale: 0.92,
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: grid,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Counter animations ──
      // Counter 1: 0 → 100
      const counter1 = counterRefs.current[0];
      if (counter1) {
        const proxy1 = { val: 0 };
        gsap.to(proxy1, {
          val: 100,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter1,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (counter1) counter1.textContent = Math.round(proxy1.val).toString();
          },
        });
      }

      // Counter 2: 0 → 1 (tỷ)
      const counter2 = counterRefs.current[1];
      if (counter2) {
        const proxy2 = { val: 0 };
        gsap.to(proxy2, {
          val: 1,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter2,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (counter2) counter2.textContent = proxy2.val.toFixed(1);
          },
          onComplete: () => {
            if (counter2) counter2.textContent = '1';
          },
        });
      }

      // Counter 3: 0 → 2.35
      const counter3 = counterRefs.current[2];
      if (counter3) {
        const proxy3 = { val: 0 };
        gsap.to(proxy3, {
          val: 2.35,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: counter3,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            if (counter3) counter3.textContent = proxy3.val.toFixed(2);
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="mission" className="py-20 md:py-28 bg-white">
      <div className="container-page">
        <div ref={headingRef} className="max-w-2xl mb-12 md:mb-16" style={{ opacity: 0 }}>
          <div className="eyebrow mb-4">Câu chuyện & Tác động</div>
          <h2
            className="font-display font-bold text-ink tracking-tight text-3xl md:text-5xl leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Chúng tôi đem lại những tác động lớn.
          </h2>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-12 gap-5 mb-16">
          {/* Main card — Học bổng */}
          <div className="mission-card md:col-span-7 card p-7 md:p-10" style={{ opacity: 0 }}>
            <div className="eyebrow mb-6">Tác động giáo dục</div>
            <div className="font-display text-6xl md:text-7xl font-bold text-ink leading-none">
              <span
                ref={(el) => { counterRefs.current[0] = el; }}
                className="counter-value"
              >
                0
              </span>
              <span className="text-2xl md:text-3xl text-ink-muted font-normal ml-2">
                suất
              </span>
            </div>
            <div className="mt-3 font-display text-xl md:text-2xl font-semibold text-ink">
              Học bổng được trao
            </div>
            <p className="mt-3 text-ink-muted leading-relaxed max-w-md">
              {impact[0].detail}
            </p>
          </div>

          {/* Side cards */}
          <div className="md:col-span-5 flex flex-col gap-5">
            {/* Tiết kiệm */}
            <div className="mission-card card p-6 md:p-7" style={{ opacity: 0 }}>
              <div className="eyebrow mb-3">{impact[1].label}</div>
              <div className="font-display text-4xl md:text-5xl font-bold text-ink leading-none">
                <span
                  ref={(el) => { counterRefs.current[1] = el; }}
                  className="counter-value"
                >
                  0
                </span>
                <span className="text-lg text-ink-muted font-normal ml-1">
                  tỷ
                </span>
                <span className="text-lg text-ink-muted font-normal ml-2">
                  {impact[1].unit}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                {impact[1].detail}
              </p>
            </div>

            {/* Sinh viên */}
            <div className="mission-card card p-6 md:p-7" style={{ opacity: 0 }}>
              <div className="eyebrow mb-3">{impact[2].label}</div>
              <div className="font-display text-4xl md:text-5xl font-bold text-ink leading-none">
                <span
                  ref={(el) => { counterRefs.current[2] = el; }}
                  className="counter-value"
                >
                  0
                </span>
                <span className="text-lg text-ink-muted font-normal">
                  M
                </span>
                <span className="text-lg text-ink-muted font-normal ml-2">
                  {impact[2].unit}
                </span>
              </div>
              <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                {impact[2].detail}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}