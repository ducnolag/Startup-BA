import Link from 'next/link';

export default function Hero() {
  return (
    <section className="pt-32 md:pt-40 pb-10 bg-surface-muted border-b border-line-subtle relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div className="container-page relative">
        <div className="eyebrow mb-5">Công cụ · PDF Translate</div>
        <h1
          className="font-display font-bold text-ink tracking-tight max-w-3xl text-balance"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
          }}
        >
          Upload PDF — dịch sang tiếng Việt.
        </h1>
        <p className="mt-5 text-ink-muted max-w-2xl leading-relaxed text-lg">
          Dành cho báo, tạp chí, giáo trình, tài liệu kỹ thuật. AI đọc từng trang và dịch
          sang tiếng Việt hoặc 5 ngôn ngữ khác. Giữ format gốc (heading, bullet, bảng biểu).
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="#uploader" className="btn-primary">
            Upload PDF ngay
            <span className="inline-block ml-1">↓</span>
          </Link>
          <Link href="#how-it-works" className="btn-ghost">
            Cách hoạt động
          </Link>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
          <div>
            <span className="font-display font-bold text-ink">20 MB</span> tối đa
          </div>
          <div className="w-px h-4 bg-line" />
          <div>
            <span className="font-display font-bold text-ink">6</span> ngôn ngữ đích
          </div>
          <div className="w-px h-4 bg-line" />
          <div>
            <span className="font-display font-bold text-ink">Powered by</span> Gemini 2.5 Flash
          </div>
        </div>
      </div>
    </section>
  );
}
