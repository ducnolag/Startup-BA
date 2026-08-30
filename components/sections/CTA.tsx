'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export default function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
        },
      });

      tl.fromTo(
        cardRef.current,
        { opacity: 0, y: 60, scale: 0.96 },
        { opacity: 1, y: 0, scale: 1, duration: 1, ease: 'power3.out' }
      ).fromTo(
        cardRef.current?.children ? Array.from(cardRef.current.children) : [],
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power2.out' },
        '-=0.7'
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} className="relative py-32 md:py-48 bg-[#020409] overflow-hidden">
      {/* Atmospheric glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="absolute w-[700px] h-[700px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute w-[400px] h-[400px] bg-[#0066cc]/8 rounded-full blur-[80px] translate-x-32" />
      </div>

      <div className="relative max-w-5xl mx-auto px-6">
        <div
          ref={cardRef}
          className="rounded-[2rem] glass-border-glow p-10 md:p-16 lg:p-20 text-center relative overflow-hidden"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,184,239,0.06) 0%, rgba(10,15,31,0.6) 50%, rgba(0,102,204,0.04) 100%)',
          }}
        >
          {/* Top accent line */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <h2
            className="font-display font-bold tracking-tight text-[clamp(2.2rem,5.5vw,4.5rem)] text-white"
            style={{ letterSpacing: '-0.04em' }}
          >
            Sẵn sàng{' '}
            <span className="text-brand-gradient">
              tiết kiệm thời gian
            </span>
            <br />
            và tiền bạc?
          </h2>

          <p className="mt-8 text-lg md:text-xl text-[#94a3b8] max-w-2xl mx-auto leading-relaxed text-pretty">
            Tham gia cùng hàng nghìn sinh viên và người mua sắm thông minh. Miễn phí,
            không cần thẻ tín dụng, hủy bất cứ lúc nào.
          </p>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <a
              href="#start"
              className="btn-primary group"
            >
              Tạo tài khoản miễn phí
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href="#contact"
              className="btn-ghost group"
            >
              Liên hệ hợp tác
            </a>
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-[#64748b]">
            <span>✓ Không cần thẻ tín dụng</span>
            <span>✓ Hủy bất cứ lúc nào</span>
            <span>✓ Hỗ trợ tiếng Việt 24/7</span>
          </div>
        </div>
      </div>
    </section>
  );
}
