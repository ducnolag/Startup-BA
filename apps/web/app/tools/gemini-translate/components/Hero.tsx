export default function Hero() {
  return (
    <section className="pt-32 md:pt-40 pb-10 bg-surface-muted border-b border-line-subtle relative overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(37,99,235,0.05) 0%, transparent 60%)',
        }}
        aria-hidden
      />
      <div className="container-page relative">
        <div className="eyebrow mb-5">Công cụ · Gemini Translate</div>
        <h1
          className="font-display font-bold text-ink tracking-tight max-w-3xl text-balance"
          style={{
            fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
            letterSpacing: '-0.035em',
            lineHeight: 1.05,
          }}
        >
          Dịch nhanh, giữ nguyên ý.
        </h1>
        <p className="mt-5 text-ink-muted max-w-2xl leading-relaxed text-lg">
          Dịch giữa 8 ngôn ngữ phổ biến — đặc biệt tốt cho Anh ↔ Việt và Việt ↔ Trung / Nhật / Hàn.
          Phù hợp cho email, tài liệu, nội dung marketing.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <a href="#translator" className="btn-primary">
            Bắt đầu dịch
            <span className="inline-block ml-1">↓</span>
          </a>
          <a href="#how-it-works" className="btn-ghost">
            Cách hoạt động
          </a>
        </div>

        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 text-sm text-ink-muted">
          <div>
            <span className="font-display font-bold text-ink">8</span> ngôn ngữ
          </div>
          <div className="w-px h-4 bg-line" />
          <div>
            <span className="font-display font-bold text-ink">Tối đa</span> 5000 ký tự / lượt
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
