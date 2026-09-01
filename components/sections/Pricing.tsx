'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const plans = [
  {
    name: 'Miễn phí',
    tagline: 'Cho người mới bắt đầu',
    price: { monthly: 0, yearly: 0 },
    description: 'Đủ để trải nghiệm và quyết định có nên nâng cấp.',
    features: [
      'Tra cứu cơ bản 2 công cụ',
      'Cảnh báo qua email (5/tuần)',
      'Lịch sử giá 30 ngày',
      'Submit cơ hội cộng đồng',
      'Hỗ trợ qua Facebook group',
    ],
    cta: 'Bắt đầu miễn phí',
    href: '/signup',
    featured: false,
  },
  {
    name: 'Premium',
    tagline: 'Cho người dùng thường xuyên',
    price: { monthly: 49000, yearly: 490000 },
    description: 'Mở khóa toàn bộ tính năng. Tiết kiệm hơn cả phí premium.',
    features: [
      'Tất cả tính năng miễn phí',
      'Cảnh báo Telegram không giới hạn',
      'Lịch sử giá 90 ngày + phát hiện giá ảo',
      'Gợi ý thời điểm mua tối ưu',
      'Wishlist thông minh + cảnh báo giá',
      'Match học bổng theo profile chi tiết',
      'Hỗ trợ ưu tiên 24/7',
    ],
    cta: 'Nâng cấp Premium',
    href: '/signup',
    featured: true,
    badge: 'Phổ biến nhất',
  },
  {
    name: 'B2B API',
    tagline: 'Cho SME, trường ĐH, đội ngũ',
    price: { monthly: 500000, yearly: 5000000 },
    description: 'Tích hợp dữ liệu vào sản phẩm của bạn. SLA đảm bảo.',
    features: [
      'Toàn bộ tính năng Premium',
      'API access đầy đủ',
      '10.000 requests/tháng',
      'Webhook + custom integration',
      'Dashboard analytics riêng',
      'SLA 99.5% uptime',
      'Hỗ trợ kỹ thuật chuyên biệt',
    ],
    cta: 'Liên hệ tư vấn',
    href: '#contact',
    featured: false,
  },
];

function formatPrice(price: number) {
  if (price === 0) return '0đ';
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const grid = gridRef.current;
    if (!section || !heading || !grid) return;

    const cards = grid.querySelectorAll('.pricing-card');

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

      // ── Cards stagger — featured card scales up more ──
      gsap.fromTo(
        cards,
        {
          opacity: 0,
          y: 80,
          scale: 0.85,
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

      // ── Feature list items stagger ──
      cards.forEach((card) => {
        const items = card.querySelectorAll('.pricing-feature');
        gsap.fromTo(
          items,
          { opacity: 0, x: -15 },
          {
            opacity: 1,
            x: 0,
            duration: 0.4,
            stagger: 0.05,
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

  return (
    <section ref={sectionRef} id="pricing" className="py-20 md:py-28 bg-surface-muted border-y border-line">
      <div className="container-page">
        <div ref={headingRef} className="text-center max-w-2xl mx-auto mb-12" style={{ opacity: 0 }}>
          <div className="eyebrow mb-4 justify-center">Bảng giá</div>
          <h2
            className="font-display font-bold text-ink tracking-tight text-3xl md:text-5xl leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Giá cả phù hợp.
          </h2>
          <p className="mt-4 text-ink-muted">
            Không hợp đồng ràng buộc. Không phí ẩn. Hủy bất cứ lúc nào.
          </p>

          <div className="mt-8 inline-flex items-center p-1 rounded-full bg-white border border-line">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                !yearly
                  ? 'bg-ink text-white'
                  : 'text-ink-muted hover:text-ink'
              }`}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                yearly ? 'bg-ink text-white' : 'text-ink-muted hover:text-ink'
              }`}
            >
              Hàng năm
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  yearly
                    ? 'bg-white/20'
                    : 'bg-brand/10 text-brand-deep'
                }`}
              >
                −17%
              </span>
            </button>
          </div>
        </div>

        <div
          ref={gridRef}
          className="grid lg:grid-cols-3 gap-5 md:gap-6 max-w-5xl mx-auto"
          style={{ perspective: '1200px' }}
        >
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card relative card p-7 md:p-8 flex flex-col ${
                plan.featured
                  ? 'border-ink shadow-card-hover lg:scale-[1.02] lg:-translate-y-2'
                  : ''
              }`}
              style={{ opacity: 0 }}
            >
              {plan.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-ink text-white text-xs font-semibold">
                  {plan.badge}
                </span>
              )}

              <div className="mb-6">
                <h3 className="font-display font-semibold text-xl text-ink">
                  {plan.name}
                </h3>
                <p className="text-sm text-ink-muted mt-1">{plan.tagline}</p>
              </div>

              <div className="mb-2">
                <span className="font-display text-4xl md:text-5xl font-bold text-ink">
                  {formatPrice(yearly ? plan.price.yearly : plan.price.monthly)}
                </span>
                {plan.price.monthly > 0 && (
                  <span className="ml-1.5 text-sm text-ink-muted">
                    / {yearly ? 'năm' : 'tháng'}
                  </span>
                )}
              </div>

              {yearly && plan.price.monthly > 0 && (
                <div className="text-xs text-success font-medium mb-2">
                  Tiết kiệm{' '}
                  {formatPrice(plan.price.monthly * 12 - plan.price.yearly)}/năm
                </div>
              )}

              <p className="text-sm text-ink-muted mt-3 mb-7 leading-relaxed">
                {plan.description}
              </p>

              <Link
                href={plan.href}
                className={`w-full text-center py-3 rounded-full font-semibold text-sm transition-all ${
                  plan.featured
                    ? 'bg-ink text-white hover:bg-navy-800'
                    : 'bg-white border border-line text-ink hover:border-ink hover:bg-ink hover:text-white'
                }`}
              >
                {plan.cta}
              </Link>

              <div className="mt-7 pt-7 border-t border-line">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
                    <li
                      key={feature}
                      className="pricing-feature flex items-start gap-2.5 text-sm text-ink-muted"
                      style={{ opacity: 0 }}
                    >
                      <span className="mt-1 w-4 h-4 rounded-full bg-brand/10 flex items-center justify-center flex-shrink-0">
                        <span className="w-1.5 h-1.5 rounded-full bg-brand" />
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-12 text-center text-sm text-ink-subtle">
          Thanh toán qua PayOS, Momo hoặc chuyển khoản ngân hàng. Hóa đơn VAT đầy đủ
          cho doanh nghiệp.
        </p>
      </div>
    </section>
  );
}