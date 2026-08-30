'use client';

import { useRef } from 'react';
import dynamic from 'next/dynamic';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  GraduationCap,
  ShieldCheck,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const Hero3D = dynamic(() => import('./Hero3D'), {
  ssr: false,
  loading: () => null,
});

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

      tl.fromTo(
        '.hero-badge',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8 }
      )
        .fromTo(
          '.hero-line-1',
          { opacity: 0, y: 80, skewY: 3 },
          { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power4.out' },
          '-=0.5'
        )
        .fromTo(
          '.hero-line-2',
          { opacity: 0, y: 80, skewY: 3 },
          { opacity: 1, y: 0, skewY: 0, duration: 1, ease: 'power4.out' },
          '-=0.7'
        )
        .fromTo(
          '.hero-sub',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.5'
        )
        .fromTo(
          '.hero-cta',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.9 },
          '-=0.6'
        )
        .fromTo(
          '.bento-tile',
          { opacity: 0, y: 50, scale: 0.96 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.08,
            ease: 'power3.out',
          },
          '-=0.7'
        )
        .fromTo(
          '.hero-scroll',
          { opacity: 0 },
          { opacity: 1, duration: 0.6 },
          '-=0.3'
        );

      // Scroll-driven parallax
      gsap.to('.hero-content', {
        y: 120,
        opacity: 0.3,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1.5,
        },
      });

      gsap.to('.hero-bg-wrapper', {
        scale: 1.15,
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 2,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen w-full overflow-hidden bg-[#020409]"
    >
      {/* 3D Background */}
      <div className="hero-bg-wrapper absolute inset-0">
        <Hero3D />
      </div>

      {/* Gradient overlays for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#020409]/30 to-[#020409]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#020409]/70 via-transparent to-[#020409]/70" />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,184,239,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,239,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      {/* Content */}
      <div className="hero-content relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        {/* Top: badge + headline + sub + CTAs */}
        <div className="grid lg:grid-cols-12 gap-6 mb-10">
          {/* Left: text content */}
          <div className="lg:col-span-7 max-w-3xl">
            <div className="hero-badge opacity-0 mb-8 inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/[0.06] backdrop-blur-xl text-xs text-cyan-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Đã ra mắt 2 công cụ — Hàng chục công cụ đang phát triển</span>
            </div>

            <h1
              className="font-display font-bold tracking-tight text-balance leading-[0.92]"
              style={{ letterSpacing: '-0.04em' }}
            >
              <span className="hero-line-1 block text-[clamp(2.5rem,7.5vw,5.5rem)] text-white opacity-0">
                Một nền tảng.
              </span>
              <span className="hero-line-2 block text-[clamp(2.5rem,7.5vw,5.5rem)] mt-3 text-brand-gradient opacity-0">
                Hàng chục công cụ thông minh.
              </span>
            </h1>

            <p className="hero-sub mt-8 text-lg md:text-xl text-[#94a3b8] leading-[1.7] text-pretty max-w-2xl opacity-0">
              Toolify.vn gom những công cụ nhỏ, tập trung giải quyết các vấn đề thực tế
              của người Việt: săn học bổng quốc tế, so sánh giá thông minh trên Shopee,
              Lazada, Tiki, TikTok Shop — và còn nhiều hơn nữa.
            </p>

            <div className="hero-cta mt-10 flex flex-wrap items-center gap-4 opacity-0">
              <a
                href="#tools"
                className="btn-primary group"
              >
                Khám phá công cụ
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#demo"
                className="btn-ghost group"
              >
                <Play className="w-4 h-4 text-cyan-400" />
                Xem demo 60 giây
              </a>
            </div>
          </div>

          {/* Right: spotlight glass card with logo */}
          <div className="lg:col-span-5 hidden lg:block">
            <div className="bento-tile relative h-full rounded-3xl glass-border-glow p-8 overflow-hidden opacity-0">
              {/* Ambient glow */}
              <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-20 -left-20 w-60 h-60 bg-[#0066cc]/15 rounded-full blur-[80px]" />

              <div className="relative h-full flex flex-col justify-between min-h-[280px]">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-xs text-cyan-400 font-medium uppercase tracking-wider mb-2">
                      Sắp ra mắt
                    </div>
                    <div className="font-display text-2xl font-bold text-white">
                      Tool #3
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl glass-cyan flex items-center justify-center">
                    <Zap className="w-5 h-5 text-cyan-400" />
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[#94a3b8] leading-relaxed">
                    Cộng đồng bình chọn tool tiếp theo. Tham gia Telegram để vote —
                    mỗi lượt vote = 1 cơ hội nhận Premium 1 năm miễn phí.
                  </div>
                  <div className="mt-4 flex items-center gap-3 text-xs text-[#64748b]">
                    <div className="flex -space-x-2">
                      {[0, 1, 2, 3].map((i) => (
                        <div
                          key={i}
                          className="w-7 h-7 rounded-full bg-gradient-to-br from-cyan-500 to-[#0066cc] border-2 border-[#0a0f1f]"
                          style={{ opacity: 1 - i * 0.15 }}
                        />
                      ))}
                    </div>
                    <span>847 người đã vote</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Bento grid of stats + mini features */}
        <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-12 gap-3 md:gap-4">
          {/* Tile 1: Big stat */}
          <div className="bento-tile col-span-2 md:col-span-3 lg:col-span-4 rounded-2xl glass p-6 md:p-8 spotlight opacity-0 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-xs text-[#94a3b8] uppercase tracking-wider">
                Thị trường mục tiêu
              </div>
            </div>
            <div className="font-display text-5xl md:text-6xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              2.35M
            </div>
            <div className="mt-2 text-sm text-[#94a3b8]">
              Sinh viên đại học tại Việt Nam (tăng 37% mỗi 5 năm)
            </div>
          </div>

          {/* Tile 2: Big stat */}
          <div className="bento-tile col-span-2 md:col-span-3 lg:col-span-4 rounded-2xl glass p-6 md:p-8 spotlight opacity-0 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
              </div>
              <div className="text-xs text-[#94a3b8] uppercase tracking-wider">
                Quy mô TMĐT
              </div>
            </div>
            <div className="font-display text-5xl md:text-6xl font-bold text-white group-hover:text-cyan-400 transition-colors">
              31 tỷ $
            </div>
            <div className="mt-2 text-sm text-[#94a3b8]">
              E-commerce Việt Nam 2025 — chiếm 10% tổng bán lẻ
            </div>
          </div>

          {/* Tile 3: Tools count */}
          <div className="bento-tile col-span-2 md:col-span-2 lg:col-span-2 rounded-2xl glass-navy p-6 md:p-8 spotlight opacity-0 group">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-3">
              Premium từ
            </div>
            <div className="font-display text-4xl md:text-5xl font-bold text-white">
              49k
            </div>
            <div className="mt-1 text-sm text-[#94a3b8]">/ tháng</div>
            <div className="mt-4 text-xs text-[#64748b] flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Đang có 184 user
            </div>
          </div>

          {/* Tile 4: Scholarship count */}
          <div className="bento-tile col-span-1 md:col-span-3 lg:col-span-2 rounded-2xl glass-cyan p-6 spotlight opacity-0 group">
            <GraduationCap className="w-7 h-7 text-cyan-400 mb-4" />
            <div className="font-display text-3xl md:text-4xl font-bold text-white">
              500+
            </div>
            <div className="mt-1 text-xs text-[#94a3b8]">Học bổng & khóa học</div>
          </div>

          {/* Tile 5: Products tracked */}
          <div className="bento-tile col-span-1 md:col-span-3 lg:col-span-2 rounded-2xl glass p-6 spotlight opacity-0 group">
            <ShieldCheck className="w-7 h-7 text-cyan-400 mb-4" />
            <div className="font-display text-3xl md:text-4xl font-bold text-white">
              5K+
            </div>
            <div className="mt-1 text-xs text-[#94a3b8]">Sản phẩm theo dõi</div>
          </div>

          {/* Tile 6: Trust strip */}
          <div className="bento-tile col-span-2 md:col-span-6 lg:col-span-8 rounded-2xl glass p-6 spotlight opacity-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-500/80 to-[#0066cc]/80 border-2 border-[#0a0f1f] backdrop-blur-sm"
                    style={{ opacity: 1 - i * 0.1 }}
                  />
                ))}
              </div>
              <div>
                <div className="text-sm font-medium text-white">
                  Được tin dùng bởi cộng đồng
                </div>
                <div className="text-xs text-[#94a3b8]">
                  Sinh viên từ ĐH Bách Khoa, Ngoại Thương, Kinh tế Quốc dân...
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-soft">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-white/80">Live trên 4 sàn VN</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass-soft">
                <span className="text-cyan-400 font-mono text-[10px]">v2.0</span>
                <span className="text-white/80">vừa cập nhật</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="hero-scroll absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-3 opacity-0">
        <span className="text-[#64748b] text-xs">Cuộn xuống để khám phá</span>
        <div className="relative w-6 h-10 rounded-full border border-white/20 flex items-start justify-center p-1.5 backdrop-blur-sm">
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-[bounce_2s_ease-in-out_infinite]" />
        </div>
      </div>
    </section>
  );
}
