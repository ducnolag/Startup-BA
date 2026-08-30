'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import {
  GraduationCap,
  TrendingDown,
  ArrowRight,
  Bell,
  BarChart3,
  Sparkles,
  ShieldCheck,
  Clock,
  Tag,
  Globe,
  Search,
  Filter,
} from 'lucide-react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const tools = [
  {
    id: '01',
    badge: 'Học bổng & Khóa học',
    title: 'Săn học bổng quốc tế, không bỏ lỡ deadline',
    description:
      'Tổng hợp 500+ học bổng Chevening, Erasmus, Fulbright, DAAD và các khóa học miễn phí từ Coursera, edX. Lọc theo ngành, GPA, quốc gia — phù hợp với bạn.',
    features: [
      { icon: Bell, label: 'Cảnh báo deadline qua Telegram' },
      { icon: BarChart3, label: 'Match theo profile của bạn' },
      { icon: Sparkles, label: 'Cộng đồng submit cơ hội mới' },
    ],
    stat: { value: '500+', label: 'Cơ hội đang cập nhật' },
    color: '#00b8ef',
    bgClass: 'glass-cyan',
  },
  {
    id: '02',
    badge: 'Mua sắm thông minh',
    title: 'Trợ lý mua sắm — không chỉ là so sánh giá',
    description:
      'So sánh giá trên Shopee, Lazada, Tiki, TikTok Shop kèm lịch sử 90 ngày. Phát hiện giá ảo, gợi ý thời điểm mua, tổng hợp review, cảnh báo shop rủi ro.',
    features: [
      { icon: ShieldCheck, label: 'Phát hiện "giá ảo" so với lịch sử' },
      { icon: Clock, label: 'Gợi ý "đợi X ngày giảm Y%"' },
      { icon: Tag, label: 'Tổng bill cuối (gồm ship + voucher)' },
    ],
    stat: { value: '5,000+', label: 'Sản phẩm đang theo dõi' },
    color: '#0066cc',
    bgClass: 'glass-navy',
  },
];

function ScholarshipVisual() {
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-cyan-500/20 via-transparent to-transparent blur-3xl" />

      {/* Center card */}
      <div
        className="absolute inset-x-8 inset-y-12 rounded-2xl p-6 backdrop-blur-2xl border border-white/10 flex flex-col justify-between shadow-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,184,239,0.1) 0%, rgba(10,15,31,0.8) 50%, rgba(0,102,204,0.08) 100%)',
        }}
      >
        <div className="flex items-center justify-between">
          <GraduationCap className="w-6 h-6 text-cyan-400" />
          <span className="text-[10px] text-cyan-400 font-mono tracking-wider">MATCH 92%</span>
        </div>
        <div>
          <div className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">
            Chevening 2026
          </div>
          <div className="font-display text-lg font-semibold leading-tight text-white">
            Học bổng toàn phần Chính phủ Anh
          </div>
          <div className="mt-2 text-xs text-[#94a3b8]">Hạn chót: 14 ngày</div>
        </div>
      </div>

      {/* Floating chips */}
      <div
        className="absolute top-6 -left-2 px-3 py-2 rounded-lg backdrop-blur-xl border border-white/10 text-xs text-white/80 flex items-center gap-2"
        style={{ background: 'rgba(10,15,31,0.7)' }}
      >
        <Bell className="w-3 h-3 text-cyan-400" />
        3 deadline tuần này
      </div>

      <div
        className="absolute bottom-12 -right-2 px-3 py-2 rounded-lg backdrop-blur-xl border border-white/10 text-xs text-white/80 flex items-center gap-2"
        style={{ background: 'rgba(10,15,31,0.7)' }}
      >
        <Sparkles className="w-3 h-3 text-cyan-400" />
        IT, GPA 3.2+
      </div>
    </div>
  );
}

function PriceVisual() {
  return (
    <div className="relative aspect-square max-w-md mx-auto">
      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#0066cc]/20 via-transparent to-transparent blur-3xl" />

      <div
        className="absolute inset-x-8 inset-y-16 rounded-2xl p-6 backdrop-blur-2xl border border-white/10 shadow-2xl"
        style={{
          background:
            'linear-gradient(135deg, rgba(0,102,204,0.1) 0%, rgba(10,15,31,0.8) 50%, rgba(10,26,58,0.1) 100%)',
        }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-[#94a3b8]">Đang theo dõi</span>
          </div>
          <TrendingDown className="w-4 h-4 text-emerald-400" />
        </div>

        <div className="font-display text-lg font-bold mb-1 text-white">MacBook Air M2</div>
        <div className="text-[10px] text-[#64748b] mb-4">Lịch sử 90 ngày</div>

        <svg viewBox="0 0 200 60" className="w-full h-14">
          <defs>
            <linearGradient id="chartG" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="#00b8ef" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#00b8ef" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path
            d="M0,40 L20,35 L40,42 L60,30 L80,32 L100,25 L120,28 L140,15 L160,20 L180,12 L200,18 L200,60 L0,60 Z"
            fill="url(#chartG)"
          />
          <path
            d="M0,40 L20,35 L40,42 L60,30 L80,32 L100,25 L120,28 L140,15 L160,20 L180,12 L200,18"
            fill="none"
            stroke="#00b8ef"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <div className="mt-3 flex items-end justify-between">
          <div>
            <div className="text-[10px] text-[#64748b]">Hiện tại</div>
            <div className="font-display text-lg font-bold text-emerald-400">21.990k</div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-[#64748b]">Cao nhất</div>
            <div className="text-xs text-white/40 line-through">28.500k</div>
          </div>
        </div>
      </div>

      <div
        className="absolute top-6 -right-2 px-3 py-2 rounded-lg backdrop-blur-xl text-xs text-emerald-400 flex items-center gap-2"
        style={{
          background: 'rgba(10,15,31,0.7)',
          border: '1px solid rgba(34,197,94,0.2)',
        }}
      >
        <ShieldCheck className="w-3 h-3" />
        Không phải giá ảo
      </div>

      <div
        className="absolute bottom-4 -left-2 px-3 py-2 rounded-lg backdrop-blur-xl border border-white/10 text-xs text-white/80 flex items-center gap-2"
        style={{ background: 'rgba(10,15,31,0.7)' }}
      >
        <Clock className="w-3 h-3 text-cyan-400" />
        Đợi 5 ngày -8%
      </div>
    </div>
  );
}

function ToolPanel({ tool, index }: { tool: (typeof tools)[0]; index: number }) {
  return (
    <div className="flex-shrink-0 w-screen h-full flex items-center px-6 md:px-16 lg:px-24">
      {/* Bento-style layout: text + visual + meta tile */}
      <div className="w-full grid lg:grid-cols-12 gap-4 lg:gap-6">
        {/* Main text tile — large */}
        <div className="lg:col-span-7 rounded-3xl glass-border-glow p-8 md:p-12 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[100px] opacity-30"
               style={{ background: tool.color }}
          />

          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="font-mono text-sm text-white/30 tracking-widest">
                {tool.id}
              </span>
              <div className="h-px w-8 bg-white/10" />
              <span
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: tool.color }}
              >
                {tool.badge}
              </span>
            </div>

            <h3
              className="font-display font-bold text-[clamp(1.75rem,3.5vw,3rem)] leading-tight text-white"
              style={{ letterSpacing: '-0.03em' }}
            >
              {tool.title}
            </h3>

            <p className="mt-6 text-[#94a3b8] leading-relaxed text-base md:text-lg max-w-xl">
              {tool.description}
            </p>

            <ul className="mt-8 space-y-3">
              {tool.features.map((feature, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl glass-soft spotlight"
                >
                  <div
                    className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background: `${tool.color}15`,
                      border: `1px solid ${tool.color}30`,
                    }}
                  >
                    <feature.icon className="w-4 h-4" style={{ color: tool.color }} />
                  </div>
                  <span className="text-white/85 text-sm md:text-base">
                    {feature.label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Visual tile — medium */}
        <div className="lg:col-span-5 rounded-3xl glass-navy p-6 md:p-8 relative overflow-hidden spotlight">
          <div className="absolute inset-0 bg-mesh opacity-50" />
          <div className="relative h-full flex flex-col justify-between min-h-[400px]">
            {index === 0 ? <ScholarshipVisual /> : <PriceVisual />}

            <a
              href="#start"
              className="group inline-flex items-center justify-center gap-2 mt-6 px-5 py-3 rounded-full font-semibold text-sm transition-all"
              style={{
                background: tool.color,
                color: '#020409',
              }}
            >
              Thử ngay
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Tools() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

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
          scrollTrigger: {
            trigger: headerRef.current,
            start: 'top 80%',
          },
        }
      );

      const panels = gsap.utils.toArray<HTMLElement>('.tool-panel');
      const dots = gsap.utils.toArray<HTMLElement>('.progress-dot');
      if (!panels.length || !containerRef.current) return;

      const horizontalTween = gsap.to(panels, {
        xPercent: -100 * (panels.length - 1),
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          pin: true,
          scrub: 1,
          snap: {
            snapTo: 1 / (panels.length - 1),
            duration: { min: 0.2, max: 0.5 },
            delay: 0,
            ease: 'power1.inOut',
          },
          end: () => '+=' + containerRef.current!.offsetWidth * (panels.length - 1),
          onUpdate: (self) => {
            const progress = self.progress;
            const activeIndex = Math.round(progress * (dots.length - 1));
            dots.forEach((dot, i) => {
              const tool = tools[i];
              dot.style.background =
                i === activeIndex ? tool.color : 'rgba(255,255,255,0.2)';
              dot.style.transform = i === activeIndex ? 'scaleX(1.3)' : 'scaleX(1)';
            });
          },
        },
      });
      // silence unused warning
      void horizontalTween;
    },
    { scope: sectionRef }
  );

  return (
    <section ref={sectionRef} id="tools" className="relative bg-[#020409]">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-16">
        <div ref={headerRef}>
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-cyan-500/50" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Công cụ
            </span>
          </div>
          <h2
            className="font-display font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-white max-w-3xl"
            style={{ letterSpacing: '-0.03em' }}
          >
            Hai công cụ đầu tiên.{' '}
            <span className="text-brand-gradient">Một hạ tầng.</span>
          </h2>
          <p className="mt-6 text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
            Mỗi tool giải quyết một bài toán cụ thể — nhưng tất cả dùng chung đăng nhập,
            database, thanh toán và dữ liệu.
          </p>

          {/* Hint chip */}
          <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 rounded-full glass-soft text-xs text-[#94a3b8]">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            Cuộn ngang để xem tiếp →
          </div>
        </div>
      </div>

      {/* Pinned horizontal scroll */}
      <div ref={containerRef} className="h-screen overflow-hidden relative">
        <div
          className="flex h-full tool-track"
          style={{ width: `${tools.length * 100}vw` }}
        >
          {tools.map((tool, index) => (
            <div key={tool.id} className="tool-panel flex-shrink-0 w-screen h-full">
              <ToolPanel tool={tool} index={index} />
            </div>
          ))}
        </div>

        {/* Progress dots */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
          {tools.map((tool, i) => (
            <div
              key={i}
              className="progress-dot h-1.5 rounded-full transition-all duration-500 w-8"
              data-index={i}
              style={{ background: 'rgba(255,255,255,0.2)' }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
