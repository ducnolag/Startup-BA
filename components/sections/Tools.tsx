'use client';

import Link from 'next/link';

const tools = [
  {
    id: 'scholarship',
    title: 'Săn học bổng quốc tế',
    summary:
      'Tổng hợp 500+ học bổng Chevening, Erasmus, Fulbright và các khóa học miễn phí từ Coursera, edX. Lọc theo ngành, GPA, quốc gia.',
    href: '/tools/scholarship',
    cta: 'Mở công cụ',
    bullets: ['Cảnh báo deadline qua Telegram', 'Match theo profile của bạn', 'Cộng đồng submit cơ hội mới'],
    highlight: '500+ cơ hội',
  },
  {
    id: 'price',
    title: 'So sánh giá thông minh',
    summary:
      'So sánh giá Shopee, Lazada, Tiki, TikTok Shop kèm lịch sử 90 ngày. Phát hiện giá ảo, gợi ý thời điểm mua, cảnh báo shop rủi ro.',
    href: '/tools/price-compare',
    cta: 'Mở công cụ',
    bullets: ['Phát hiện giá ảo so với lịch sử', 'Gợi ý đợi X ngày giảm Y%', 'Tổng bill cuối (ship + voucher)'],
    highlight: '5.000+ sản phẩm',
  },
];

export default function Tools() {
  return (
    <section id="tools" className="py-20 md:py-28 bg-surface-muted border-y border-line">
      <div className="container-page">
        <div data-anim className="max-w-2xl mb-12 md:mb-16">
          <div className="eyebrow mb-4">Công cụ</div>
          <h2
            className="font-display font-bold text-ink tracking-tight text-3xl md:text-5xl leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Các công cụ hiện tại.
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5 md:gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.id}
              href={tool.href}
              data-anim
              className="card card-hover p-7 md:p-9 group block"
            >
              <div className="flex items-start justify-between mb-6">
                <span className="chip chip-active">{tool.highlight}</span>
                <span className="text-xs font-medium text-ink-subtle">
                  0{tool.id === 'scholarship' ? '1' : '2'}
                </span>
              </div>

              <h3
                className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-3"
                style={{ letterSpacing: '-0.02em' }}
              >
                {tool.title}
              </h3>
              <p className="text-ink-muted leading-relaxed mb-6">{tool.summary}</p>

              <ul className="space-y-2.5 mb-7">
                {tool.bullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-start gap-2.5 text-sm text-ink-muted"
                  >
                    <span className="status-dot mt-2" aria-hidden />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="inline-flex items-center gap-1.5 text-sm font-semibold text-ink group-hover:text-brand transition-colors">
                {tool.cta}
                <span aria-hidden>→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}