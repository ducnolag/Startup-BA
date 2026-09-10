'use client';

import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-32 md:pt-40 pb-10 bg-surface-muted border-b border-line-subtle relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(124,58,237,0.06) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div className="container-page relative">
        <div className="eyebrow mb-5">Công cụ · Idea-to-Tool</div>
        <h1
          className="font-display font-bold text-ink tracking-tight max-w-3xl text-balance"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
          }}
        >
          Từ vấn đề đến giải pháp,
          <br />
          <span className="text-ink-muted font-medium">trong 30 giây.</span>
        </h1>
        <p className="mt-5 text-ink-muted max-w-2xl leading-relaxed text-lg">
          Bạn gặp vấn đề — AI gợi ý công cụ phù hợp. Trong thực tế, có rất nhiều nhu cầu cụ thể chỉ
          xuất hiện trong một công việc hoặc một nhóm đối tượng nhất định mà chưa có công cụ phù hợp.
          Toolify giúp bạn tìm đúng thứ bạn cần.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="#problem-form" className="btn-primary">
            Bắt đầu miễn phí
            <span className="inline-block ml-1">↓</span>
          </Link>
          <Link href="#how-it-works" className="btn-ghost">
            Cách hoạt động
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
          <div>
            <span className="font-display font-bold text-ink">9</span> danh mục vấn đề
          </div>
          <div className="w-px h-4 bg-line" />
          <div>
            <span className="font-display font-bold text-ink">3</span> công cụ + 3 bước hành động / lượt
          </div>
          <div className="w-px h-4 bg-line" />
          <div>
            <span className="font-display font-bold text-ink">Powered by</span> Gemini 2.0 Flash
          </div>
        </div>
      </div>
    </section>
  );
}
