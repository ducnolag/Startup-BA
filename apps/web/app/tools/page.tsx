import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import type { Metadata } from 'next';
import { TOOLS } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'Tất cả công cụ',
  description:
    'Danh sách công cụ của Toolify.vn: săn học bổng quốc tế, so sánh giá 4 sàn TMĐT Việt Nam, và nhiều hơn thế nữa.',
  alternates: { canonical: 'https://toolify.vn/tools' },
};

const tools = TOOLS.map((t) => ({
  id: t.slug,
  name: t.name,
  description: t.description,
  href: t.href,
  status: t.status,
  isNew: t.isNew,
  ordinal: t.slug === 'scholarship' ? '1' : '2',
  stats: t.stats,
}));

export default function ToolsHub() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      {/* Header */}
      <section className="pt-32 md:pt-40 pb-12 md:pb-16 bg-surface-muted border-b border-line">
        <div className="container-page">
          <div className="eyebrow mb-5">Tất cả công cụ</div>
          <h1
            className="font-display font-bold text-ink tracking-tight max-w-3xl text-balance"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
            }}
          >
            Công cụ cho mọi vấn đề của người Việt.
          </h1>
        </div>
      </section>

      {/* Tools grid */}
      <section className="py-16 md:py-20">
        <div className="container-page">
          <div className="grid lg:grid-cols-3 gap-5 md:gap-6">
            {tools.map((tool) => {
              const isSoon = tool.status === 'soon';
              return (
                <Link
                  key={tool.id}
                  href={isSoon ? '/#vote' : tool.href}
                  className={`card card-hover p-7 md:p-8 block group ${
                    isSoon ? 'opacity-90' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span className="eyebrow">0{tool.ordinal}</span>
                    <span
                      className={`chip ${tool.status === 'live' ? 'chip-active' : ''}`}
                    >
                      {tool.status === 'live' ? (tool.isNew ? 'Mới' : '● Live') : 'Sắp ra mắt'}
                    </span>
                  </div>

                  <h2 className="font-display font-bold text-2xl text-ink tracking-tight mb-3">
                    {tool.name}
                  </h2>
                  <p className="text-ink-muted leading-relaxed mb-7">
                    {tool.description}
                  </p>

                  <div className="grid grid-cols-3 gap-3 mb-7">
                    {tool.stats.map((s) => (
                      <div key={s.label} className="card-soft p-3 text-center">
                        <div className="font-display font-bold text-lg text-ink">
                          {s.value}
                        </div>
                        <div className="text-[10px] text-ink-subtle uppercase tracking-wider mt-0.5">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div
                    className={`text-sm font-semibold transition-colors ${
                      isSoon ? 'text-ink-subtle' : 'text-ink group-hover:text-brand'
                    }`}
                  >
                    {isSoon ? 'Sắp ra mắt' : 'Mở công cụ →'}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}