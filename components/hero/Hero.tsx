'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';

const Hero3D = dynamic(() => import('./Hero3D'), { ssr: false });

export default function Hero() {
  return (
    <section className="relative pt-28 md:pt-36 pb-16 md:pb-24 bg-white overflow-hidden">
      <Hero3D />

      <div className="relative container-page">
        {/* Top badge + headline */}
        <div className="max-w-4xl">
          <Link
            href="/#vote"
            className="inline-flex items-center gap-2 mb-7 px-3.5 py-1.5 rounded-full bg-white/80 backdrop-blur border border-line shadow-sm transition-transform duration-200 active:scale-[0.97] focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2"
          >
            <span className="relative flex h-2 w-2 flex-shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand" />
            </span>
            <span className="text-xs font-medium text-ink">
              Đang phát triển thêm công cụ mới
            </span>
            <span className="text-xs text-ink-subtle">·</span>
            <span className="text-xs text-brand font-semibold">Bình chọn</span>
            <span className="text-xs text-brand font-semibold ml-0.5 group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </Link>

          <h1
            data-anim
            data-anim-delay="0.05"
            className="font-display font-bold text-ink tracking-tight leading-[1.02] text-balance"
            style={{ letterSpacing: '-0.04em' }}
          >
            <span className="block text-[clamp(2.5rem,7vw,5.5rem)]">
              Tiết kiệm thời gian
            </span>
            <span
              className="block text-[clamp(2.5rem,7vw,5.5rem)] mt-1"
              style={{
                background:
                  'linear-gradient(130deg, #0a1a3a 0%, #00a8d4 50%, #0a1a3a 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                paddingTop: '20px',
              }}
            >
              Tiết kiệm tiền bạc
            </span>
          </h1>

          <p
            data-anim
            data-anim-delay="0.15"
            className="mt-7 text-lg md:text-xl text-ink-muted leading-relaxed max-w-2xl"
          >
            Nền tảng công cụ thông minh cho người Việt. Giúp bạn tiết kiệm thời gian và tiền bạc.
            Miễn phí, không quảng cáo.
          </p>

          <div data-anim data-anim-delay="0.25" className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="#tools" className="btn-primary">
              Khám phá công cụ
            </Link>
            <Link href="#pricing" className="btn-ghost group">
              Xem bảng giá
              <span className="inline-block ml-1 group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
        </div>

        {/* Two tool preview cards */}
        <div className="mt-16 md:mt-20 grid lg:grid-cols-2 gap-4 md:gap-5">
          {/* Scholarship preview */}
          <div
            data-anim
            data-anim-delay="0.05"
            className="group relative card p-6 md:p-7 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-deep mb-2">
                  Công cụ #1
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-ink">
                  Săn học bổng quốc tế
                </h3>
              </div>
              <Link
                href="/tools/scholarship"
                className="text-xs font-semibold text-brand hover:text-brand-deep flex items-center gap-1"
              >
                Mở <span aria-hidden>→</span>
              </Link>
            </div>

            <div className="space-y-2">
              {[
                { tag: 'Chevening', flag: '🇬🇧', amount: '$40K+', days: '12 ngày' },
                { tag: 'Erasmus+', flag: '🇪🇺', amount: 'Toàn phần', days: '45 ngày' },
                { tag: 'Coursera', flag: '🎓', amount: 'Miễn phí', days: 'Còn hạn' },
              ].map((s, i) => (
                <div
                  key={s.tag}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface-muted border border-transparent hover:border-line"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{s.flag}</span>
                    <div>
                      <div className="text-sm font-semibold text-ink">{s.tag}</div>
                      <div className="text-xs text-ink-muted">Hạn nộp {s.days}</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-brand-deep">{s.amount}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs text-ink-subtle">
              <span>500+ cơ hội đang mở</span>
              <span>Updated 2 giờ trước</span>
            </div>
          </div>

          {/* Price compare preview */}
          <div
            data-anim
            data-anim-delay="0.15"
            className="group relative card p-6 md:p-7 overflow-hidden"
          >
            <div className="flex items-start justify-between mb-5">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-deep mb-2">
                  Công cụ #2
                </div>
                <h3 className="font-display font-bold text-xl md:text-2xl text-ink">
                  So sánh giá thông minh
                </h3>
              </div>
              <Link
                href="/tools/price-compare"
                className="text-xs font-semibold text-brand hover:text-brand-deep flex items-center gap-1"
              >
                Mở <span aria-hidden>→</span>
              </Link>
            </div>

            {/* Mini price chart */}
            <div className="relative h-32 rounded-lg bg-gradient-to-br from-surface-muted to-white border border-line p-4 overflow-hidden">
              <svg
                viewBox="0 0 200 80"
                className="w-full h-full"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#0a1a3a" />
                    <stop offset="100%" stopColor="#00a8d4" />
                  </linearGradient>
                  <linearGradient id="fillGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#00a8d4" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#00a8d4" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0,60 C20,55 40,62 60,50 C80,38 100,42 120,30 C140,18 160,25 180,15 L200,12 L200,80 L0,80 Z"
                  fill="url(#fillGrad)"
                />
                <path
                  d="M0,60 C20,55 40,62 60,50 C80,38 100,42 120,30 C140,18 160,25 180,15 L200,12"
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[10px] text-ink-subtle">
                <span>90 ngày trước</span>
                <span className="font-semibold text-success">−28%</span>
                <span>Hôm nay</span>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-4 gap-2">
              {[
                { name: 'Shopee', price: '1.490k' },
                { name: 'Lazada', price: '1.490k' },
                { name: 'Tiki', price: '1.590k' },
                { name: 'TikTok', price: '1.450k' },
              ].map((p) => (
                <div
                  key={p.name}
                  className={`p-2.5 rounded-lg text-center border ${
                    p.name === 'TikTok'
                      ? 'bg-ink text-white border-ink'
                      : 'bg-white border-line text-ink'
                  }`}
                >
                  <div className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                    {p.name}
                  </div>
                  <div className="text-xs font-bold mt-1">{p.price}</div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-line flex items-center justify-between text-xs text-ink-subtle">
              <span>5.000+ sản phẩm</span>
              <span className="text-success font-semibold">↓ Giá tốt nhất</span>
            </div>
          </div>
        </div>

        {/* Trust strip */}
        <div
          data-anim
          data-anim-delay="0.1"
          className="mt-16 md:mt-20 pt-8 border-t border-line flex flex-wrap items-center justify-between gap-y-4 gap-x-8 text-sm text-ink-subtle"
        >
          <div className="font-medium text-ink">Được thiết kế cho:</div>
          <div className="flex flex-wrap items-center gap-x-8 gap-y-2">
            <span className="font-semibold text-ink">500+</span>
            <span>học bổng</span>
            <span className="text-line">/</span>
            <span className="font-semibold text-ink">4 sàn</span>
            <span>Shopee · Lazada · Tiki · TikTok</span>
            <span className="text-line">/</span>
            <span className="font-semibold text-ink">90 ngày</span>
            <span>lịch sử giá</span>
          </div>
        </div>
      </div>
    </section>
  );
}