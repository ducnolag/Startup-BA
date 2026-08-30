'use client';

import { useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { Check, Sparkles, Crown } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

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
    accent: false,
    accentColor: '#94a3b8',
  },
  {
    name: 'Premium',
    tagline: 'Cho người dùng thường xuyên',
    price: { monthly: 49000, yearly: 490000 },
    description: 'Mở khóa toàn bộ tính năng. Tiết kiệm hơn cả phí premium.',
    features: [
      'Tất cả tính năng miễn phí',
      'Cảnh báo qua Telegram không giới hạn',
      'Lịch sử giá 90 ngày + phát hiện giá ảo',
      'Gợi ý thời điểm mua tối ưu',
      'Wishlist thông minh + cảnh báo giá',
      'Match học bổng theo profile chi tiết',
      'Hỗ trợ ưu tiên 24/7',
    ],
    cta: 'Nâng cấp Premium',
    accent: true,
    badge: 'Phổ biến nhất',
    accentColor: '#00b8ef',
  },
  {
    name: 'B2B API',
    tagline: 'Cho SME, trường ĐH, đội ngũ',
    price: { monthly: 500000, yearly: 5000000 },
    description: 'Tích hợp dữ liệu vào sản phẩm của bạn. SLA đảm bảo.',
    features: [
      'Toàn bộ tính năng Premium',
      'API access đầy đủ',
      '10,000 requests/tháng',
      'Webhook + custom integration',
      'Dashboard analytics riêng',
      'SLA 99.5% uptime',
      'Hỗ trợ kỹ thuật chuyên biệt',
    ],
    cta: 'Liên hệ tư vấn',
    accent: false,
    accentColor: '#0066cc',
  },
];

function formatPrice(price: number) {
  if (price === 0) return '0đ';
  return new Intl.NumberFormat('vi-VN').format(price) + 'đ';
}

export default function Pricing() {
  const [yearly, setYearly] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        headerRef.current?.children ? Array.from(headerRef.current.children) : [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: headerRef.current, start: 'top 75%' },
        }
      );

      const cards = gsap.utils.toArray<HTMLElement>('.pricing-card');
      if (!cards.length) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out',
          scrollTrigger: { trigger: cardsRef.current, start: 'top 75%' },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="pricing" className="relative py-32 md:py-48 bg-[#020409]">
      <div className="absolute inset-0 bg-mesh opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={headerRef} className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 mb-6">
            <div className="h-px w-12 bg-cyan-500/50" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Bảng giá
            </span>
            <div className="h-px w-12 bg-cyan-500/50" />
          </div>
          <h2
            className="font-display font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-white"
            style={{ letterSpacing: '-0.03em' }}
          >
            Bắt đầu miễn phí.
            <br />
            <span className="text-brand-gradient">Nâng cấp khi cần.</span>
          </h2>
          <p className="mt-6 text-lg text-[#94a3b8] leading-relaxed">
            Không hợp đồng ràng buộc. Không phí ẩn. Hủy bất cứ lúc nào — tiền hoàn
            trong 7 ngày đầu.
          </p>

          {/* Toggle */}
          <div className="mt-10 inline-flex items-center gap-1 p-1 rounded-full glass-soft">
            <button
              onClick={() => setYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !yearly
                  ? 'bg-cyan-500 text-[#020409] shadow-[0_0_16px_rgba(0,184,239,0.4)]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Hàng tháng
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                yearly
                  ? 'bg-cyan-500 text-[#020409] shadow-[0_0_16px_rgba(0,184,239,0.4)]'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Hàng năm
              <span
                className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                  yearly ? 'bg-[#020409]/20' : 'bg-cyan-500/20 text-cyan-400'
                }`}
              >
                −17%
              </span>
            </button>
          </div>
        </div>

        {/* Bento pricing grid */}
        <div ref={cardsRef} className="grid lg:grid-cols-3 gap-4 lg:gap-5 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`pricing-card relative rounded-3xl p-8 lg:p-10 transition-all duration-300 overflow-hidden spotlight group ${
                plan.accent
                  ? 'glass-border-glow bg-[#060a16]/60 lg:scale-[1.02] lg:-translate-y-2'
                  : 'glass'
              }`}
            >
              {plan.accent && (
                <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-[100px] group-hover:bg-cyan-500/25 transition-colors duration-700" />
              )}

              {plan.badge && (
                <div
                  className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-[#020409] shadow-[0_0_20px_rgba(0,184,239,0.5)]"
                  style={{ background: plan.accentColor }}
                >
                  <Sparkles className="w-3 h-3" />
                  {plan.badge}
                </div>
              )}

              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  {plan.accent && <Crown className="w-4 h-4 text-cyan-400" />}
                  <h3 className="font-display text-xl font-semibold text-white">
                    {plan.name}
                  </h3>
                </div>
                <p className="text-sm text-[#94a3b8] mb-6">{plan.tagline}</p>

                <div className="mb-2">
                  <span className="font-display text-5xl font-bold text-white">
                    {formatPrice(yearly ? plan.price.yearly : plan.price.monthly)}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="ml-2 text-[#94a3b8] text-sm">
                      / {yearly ? 'năm' : 'tháng'}
                    </span>
                  )}
                </div>

                {yearly && plan.price.monthly > 0 && (
                  <div className="text-xs text-cyan-400 mb-2">
                    Tiết kiệm {formatPrice(plan.price.monthly * 12 - plan.price.yearly)}/năm
                  </div>
                )}

                <p className="text-sm text-[#94a3b8] mt-4 mb-8 leading-relaxed">
                  {plan.description}
                </p>

                <a
                  href="#start"
                  className={`block w-full text-center py-3.5 rounded-full font-semibold transition-all duration-300 ${
                    plan.accent
                      ? 'bg-cyan-500 text-[#020409] hover:bg-[#5ee8ff] hover:shadow-[0_0_32px_rgba(0,184,239,0.5)]'
                      : 'border border-white/15 text-white hover:border-cyan-500/50 hover:bg-cyan-500/5 backdrop-blur-sm'
                  }`}
                >
                  {plan.cta}
                </a>

                <div className="mt-8 pt-8 border-t border-white/5">
                  <ul className="space-y-3.5">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3 text-sm">
                        <div
                          className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                          style={{ background: `${plan.accentColor}20` }}
                        >
                          <Check
                            className="w-3 h-3"
                            style={{ color: plan.accentColor }}
                            strokeWidth={3}
                          />
                        </div>
                        <span className="text-[#94a3b8]">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center text-sm text-[#64748b]">
          Thanh toán qua PayOS, Momo, hoặc chuyển khoản ngân hàng. Hóa đơn VAT đầy đủ
          cho doanh nghiệp.
        </div>
      </div>
    </section>
  );
}
