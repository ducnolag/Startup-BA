'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROUTES } from '@/lib/constants';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function CTA() {
  const { user } = useAuth();
  const sectionRef = useRef<HTMLElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const card = cardRef.current;
    if (!section || !card) return;

    const heading = card.querySelector('.cta-heading');
    const description = card.querySelector('.cta-description');
    const buttons = card.querySelector('.cta-buttons');

    const ctx = gsap.context(() => {
      // ── Card scale reveal from small → large ──
      gsap.fromTo(
        card,
        {
          opacity: 0,
          scale: 0.8,
          y: 60,
        },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 1.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        }
      );

      // ── Heading text reveal ──
      if (heading) {
        gsap.fromTo(
          heading,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.3,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // ── Description fade in ──
      if (description) {
        gsap.fromTo(
          description,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            delay: 0.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }

      // ── Buttons stagger ──
      if (buttons) {
        const btns = buttons.querySelectorAll('a');
        gsap.fromTo(
          btns,
          { opacity: 0, y: 20, scale: 0.9 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.12,
            delay: 0.7,
            ease: 'back.out(1.5)',
            scrollTrigger: {
              trigger: section,
              start: 'top 80%',
              toggleActions: 'play none none none',
            },
          }
        );
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" className="py-20 md:py-28 bg-white">
      <div className="container-page">
        <div
          ref={cardRef}
          className="card p-10 md:p-16 lg:p-20 text-center max-w-4xl mx-auto"
          style={{ opacity: 0 }}
        >
          {user ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-deep bg-brand/10 px-3 py-1 rounded-full">
                Xin chào, {user.fullName.split(' ')[0]}
              </span>
              <h2
                className="cta-heading mt-5 font-display font-bold text-ink tracking-tight leading-[1.1] text-balance"
                style={{
                  letterSpacing: '-0.035em',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  opacity: 0,
                }}
              >
                Sẵn sàng khám phá các công cụ hôm nay?
              </h2>
              <p className="cta-description mt-6 text-ink-muted max-w-xl mx-auto leading-relaxed" style={{ opacity: 0 }}>
                So sánh giá, tìm học bổng và nhận đề xuất giá tốt nhất — tất cả trong
                một bảng điều khiển.
              </p>
              <div className="cta-buttons mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href={ROUTES.dashboard} className="btn-primary" style={{ opacity: 0 }}>
                  Mở Sản phẩm của tôi
                </Link>
                <Link href={ROUTES.tools} className="btn-ghost" style={{ opacity: 0 }}>
                  Xem tất cả công cụ
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2
                className="cta-heading font-display font-bold text-ink tracking-tight leading-[1.1] text-balance"
                style={{
                  letterSpacing: '-0.035em',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                  opacity: 0,
                }}
              >
                Sẵn sàng tiết kiệm thời gian và tiền bạc?
              </h2>
              <p className="cta-description mt-6 text-ink-muted max-w-xl mx-auto leading-relaxed" style={{ opacity: 0 }}>
                Tham gia cùng ngay bây giờ. Để nhận các Tool liền tay.
              </p>
              <div className="cta-buttons mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href={ROUTES.signup} className="btn-primary" style={{ opacity: 0 }}>
                  Tạo tài khoản miễn phí
                </Link>
                <Link href="#contact" className="btn-ghost" style={{ opacity: 0 }}>
                  Liên hệ hợp tác
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}