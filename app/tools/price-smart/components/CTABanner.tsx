'use client';

import Link from 'next/link';

export default function CTABanner() {
  return (
    <section className="py-16 md:py-24">
      <div className="container-page">
        <div
          className="relative rounded-3xl overflow-hidden border border-line p-8 md:p-16 text-center"
          style={{
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          }}
        >
          {/* Subtle decoration */}
          <div className="absolute inset-0 -z-0 opacity-20" aria-hidden>
            <div className="absolute top-0 left-0 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0, 168, 212, 0.4) 0%, transparent 70%)', filter: 'blur(60px)' }}
            />
            <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(99, 102, 241, 0.3) 0%, transparent 70%)', filter: 'blur(60px)' }}
            />
          </div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-brand/80 mb-4">
              Không cần đăng ký · Miễn phí 100%
            </div>
            <h2 className="font-display font-bold text-white tracking-tight leading-[1.1] mb-4"
              style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)', letterSpacing: '-0.025em' }}
            >
              Sẵn sàng mua thông minh hơn?
            </h2>
            <p className="text-slate-300 mb-8 leading-relaxed">
              Dán link sản phẩm đầu tiên của bạn — nhận verdict trong 2 giây.
            </p>
            <Link
              href="#analyze"
              className="inline-flex items-center gap-2 bg-white text-ink font-semibold px-7 py-3.5 rounded-full hover:-translate-y-0.5 transition-all duration-200 shadow-[0_4px_20px_rgba(255,255,255,0.15)]"
            >
              Phân tích ngay
              <span className="text-xs">→</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}