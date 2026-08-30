'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  Zap,
  Lock,
  Bell,
  BarChart3,
  Users,
  Wrench,
  ArrowUpRight,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const features = [
  {
    icon: Zap,
    title: 'Nhanh. Tức thì.',
    description: 'Không chờ đợi. Tra cứu trong tích tắc, cache thông minh, tối ưu cho mobile 3G.',
    size: 'large',
    accent: '#00b8ef',
  },
  {
    icon: Lock,
    title: 'An toàn',
    description: 'Không bán dữ liệu. Không spam.',
    size: 'small',
    accent: '#5ee8ff',
  },
  {
    icon: Bell,
    title: 'Cảnh báo thông minh',
    description:
      'Telegram bot, email, hoặc web push — chọn kênh bạn thích. Chỉ nhận thông tin liên quan.',
    size: 'medium',
    accent: '#00b8ef',
  },
  {
    icon: BarChart3,
    title: 'Dữ liệu xác thực',
    description: 'Mỗi con số đều có nguồn. Lịch sử giá từ API chính thức.',
    size: 'small',
    accent: '#0066cc',
  },
  {
    icon: Users,
    title: 'Cộng đồng đóng góp',
    description:
      'Submit học bổng mới, review sản phẩm, chia sẻ mẹo săn sale. Cùng nhau tốt hơn.',
    size: 'medium',
    accent: '#00b8ef',
  },
  {
    icon: Wrench,
    title: 'Mở rộng liên tục',
    description:
      'Mỗi quý ra mắt ít nhất một tool mới. Bạn có thể góp ý — tool nào lên trước là do bạn quyết.',
    size: 'large',
    accent: '#0066cc',
  },
];

const sizeClasses: Record<string, string> = {
  large: 'col-span-12 md:col-span-8 lg:col-span-8 row-span-2',
  medium: 'col-span-12 md:col-span-6 lg:col-span-4',
  small: 'col-span-6 md:col-span-3 lg:col-span-4',
};

export default function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

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

      const tiles = gsap.utils.toArray<HTMLElement>('.feature-tile');
      if (!tiles.length) return;

      gsap.fromTo(
        tiles,
        { opacity: 0, y: 60, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: gridRef.current, start: 'top 75%' },
        }
      );

      // Parallax on large tiles
      tiles.forEach((tile, i) => {
        if (features[i]?.size === 'large') {
          gsap.to(tile, {
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 1.5,
            },
          });
        }
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative py-32 md:py-48 bg-[#020409] overflow-hidden"
    >
      <div className="absolute inset-0 bg-mesh opacity-60" />
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,184,239,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,239,0.6) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={headerRef} className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-cyan-500/50" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Vì sao chọn Toolify
            </span>
          </div>
          <h2
            className="font-display font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-white"
            style={{ letterSpacing: '-0.03em' }}
          >
            Xây cho{' '}
            <span className="text-brand-gradient">người Việt</span>,<br />
            bởi người Việt.
          </h2>
          <p className="mt-6 text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
            Không phải một sản phẩm nước ngoài Việt hóa. Không phải một trang so sánh
            giá chung chung. Toolify.vn được thiết kế riêng cho bối cảnh Việt Nam.
          </p>
        </div>

        {/* Bento grid */}
        <div
          ref={gridRef}
          className="grid grid-cols-12 gap-3 md:gap-4 auto-rows-[180px] md:auto-rows-[200px]"
        >
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className={`feature-tile ${sizeClasses[feature.size]} relative rounded-2xl md:rounded-3xl glass-border-glow p-6 md:p-8 overflow-hidden spotlight group cursor-default`}
            >
              {/* Ambient accent blob */}
              <div
                className="absolute -top-20 -right-20 w-60 h-60 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                style={{ background: feature.accent }}
              />

              <div className="relative h-full flex flex-col justify-between">
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `${feature.accent}15`,
                      border: `1px solid ${feature.accent}30`,
                    }}
                  >
                    <feature.icon
                      className="w-5 h-5"
                      style={{ color: feature.accent }}
                    />
                  </div>

                  {feature.size === 'large' && (
                    <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-cyan-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                  )}
                </div>

                <div>
                  <h3
                    className={`font-display font-semibold text-white tracking-tight ${
                      feature.size === 'large'
                        ? 'text-2xl md:text-3xl'
                        : 'text-lg md:text-xl'
                    }`}
                  >
                    {feature.title}
                  </h3>
                  {feature.size !== 'small' && (
                    <p
                      className={`mt-2 text-[#94a3b8] leading-relaxed ${
                        feature.size === 'large' ? 'text-base max-w-md' : 'text-sm'
                      }`}
                    >
                      {feature.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Stats tile — extra bento piece */}
          <div className="feature-tile col-span-12 md:col-span-6 lg:col-span-4 rounded-2xl md:rounded-3xl glass-navy p-6 md:p-8 overflow-hidden spotlight">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent" />
            <div className="relative h-full flex flex-col justify-between">
              <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">
                Hiệu suất
              </div>
              <div>
                <div className="font-display text-4xl md:text-5xl font-bold text-white">
                  &lt; 200ms
                </div>
                <div className="mt-2 text-sm text-[#94a3b8]">
                  Thời gian phản hồi trung bình — nhanh hơn 5x so với đối thủ
                </div>
                <div className="mt-4 flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                    <div className="h-full w-[94%] bg-gradient-to-r from-cyan-500 to-[#0066cc] rounded-full" />
                  </div>
                  <span className="text-xs text-cyan-400 font-mono">94/100</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust tile */}
          <div className="feature-tile col-span-12 md:col-span-6 lg:col-span-8 rounded-2xl md:rounded-3xl glass p-6 md:p-8 overflow-hidden spotlight">
            <div className="absolute inset-0 bg-gradient-to-br from-[#0066cc]/10 to-transparent" />
            <div className="relative h-full flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium mb-2">
                  Cam kết
                </div>
                <h3 className="font-display font-semibold text-2xl md:text-3xl text-white tracking-tight">
                  Không bán dữ liệu. Không quảng cáo.
                </h3>
                <p className="mt-3 text-[#94a3b8] leading-relaxed max-w-md">
                  Chỉ premium ads-free trong app. Không tracking pixel, không cookie
                  bên thứ ba. Bạn kiểm soát hoàn toàn dữ liệu của mình.
                </p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 px-3 py-2 rounded-full glass-soft text-xs">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white/80">End-to-end encrypted</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-full glass-soft text-xs">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="text-white/80">GDPR compliant</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Inline SVG icon component to avoid extra import
function Shield({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
}
