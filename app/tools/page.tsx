import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { GraduationCap, TrendingDown, Sparkles, ArrowRight, Calendar, DollarSign } from 'lucide-react';

const tools = [
  {
    id: 'scholarship',
    name: 'Săn học bổng',
    description: '500+ học bổng Chevening, Erasmus, Fulbright, Coursera. Lọc theo ngành, GPA, quốc gia.',
    icon: GraduationCap,
    color: '#00b8ef',
    accent: 'glass-cyan',
    href: '/tools/scholarship',
    status: 'live',
    stats: [
      { value: '500+', label: 'Cơ hội đang cập nhật' },
      { value: '12', label: 'Quốc gia' },
      { value: 'Free', label: 'Tra cứu miễn phí' },
    ],
  },
  {
    id: 'price-compare',
    name: 'So sánh giá thông minh',
    description: 'So sánh giá 4 sàn VN, lịch sử 90 ngày, phát hiện giá ảo, gợi ý thời điểm mua.',
    icon: TrendingDown,
    color: '#0066cc',
    accent: 'glass-navy',
    href: '/tools/price-compare',
    status: 'live',
    stats: [
      { value: '5K+', label: 'Sản phẩm theo dõi' },
      { value: '4', label: 'Sàn TMĐT VN' },
      { value: '90d', label: 'Lịch sử giá' },
    ],
  },
  {
    id: 'tool-3',
    name: 'Tool #3 — Đang bình chọn',
    description: 'Cộng đồng chọn tool tiếp theo. Tham gia vote Telegram, nhận Premium 1 năm miễn phí.',
    icon: Sparkles,
    color: '#5ee8ff',
    accent: 'glass',
    href: '#',
    status: 'coming-soon',
    stats: [
      { value: '847', label: 'Người đã vote' },
      { value: '3', label: 'Ứng viên' },
      { value: 'Q4', label: 'Ra mắt dự kiến' },
    ],
  },
];

export default function ToolsHub() {
  return (
    <main className="relative bg-[#020409] min-h-screen">
      <Navigation />

      {/* Hero */}
      <section className="relative pt-40 pb-16 md:pt-48 md:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-50" />
        <div className="absolute inset-0 opacity-[0.015]">
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
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-cyan-500/50" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Tất cả công cụ
            </span>
          </div>
          <h1
            className="font-display font-bold tracking-tight text-5xl md:text-6xl lg:text-7xl text-white max-w-4xl"
            style={{ letterSpacing: '-0.04em' }}
          >
            Công cụ cho{' '}
            <span className="text-brand-gradient">mọi vấn đề</span>
            <br />
            của người Việt.
          </h1>
          <p className="mt-8 text-lg md:text-xl text-[#94a3b8] leading-[1.7] max-w-2xl">
            Hôm nay Toolify có 2 công cụ sống — được xây để giải quyết bài toán thực tế.
            Mỗi tool có thể dùng độc lập, nhưng chia sẻ chung tài khoản và dữ liệu.
          </p>

          {/* Quick stats */}
          <div className="mt-12 flex flex-wrap items-center gap-8 text-sm text-[#64748b]">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>2 công cụ live</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
              <span>1 tool đang vote</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>Cập nhật hàng tuần</span>
            </div>
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Miễn phí cơ bản</span>
            </div>
          </div>
        </div>
      </section>

      {/* Tools grid */}
      <section className="relative pb-32">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-5">
            {tools.map((tool) => (
              <Link
                key={tool.id}
                href={tool.href}
                className={`group relative rounded-3xl ${tool.accent} p-8 md:p-10 overflow-hidden transition-all duration-500 hover:-translate-y-1 ${
                  tool.status === 'coming-soon' ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'
                }`}
                style={{ minHeight: '380px' }}
              >
                {/* Ambient glow */}
                <div
                  className="absolute -top-32 -right-32 w-80 h-80 rounded-full blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700"
                  style={{ background: tool.color }}
                />

                {/* Status badge */}
                <div className="relative flex items-center justify-between mb-8">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                    style={{
                      background: `${tool.color}15`,
                      border: `1px solid ${tool.color}30`,
                    }}
                  >
                    <tool.icon className="w-6 h-6" style={{ color: tool.color }} />
                  </div>
                  <span
                    className={`text-[10px] uppercase tracking-widest font-semibold px-3 py-1 rounded-full ${
                      tool.status === 'live'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20'
                    }`}
                  >
                    {tool.status === 'live' ? '● Live' : 'Soon'}
                  </span>
                </div>

                <div className="relative">
                  <h2 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight mb-3">
                    {tool.name}
                  </h2>
                  <p className="text-[#94a3b8] leading-relaxed mb-8">{tool.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {tool.stats.map((s) => (
                      <div
                        key={s.label}
                        className="rounded-xl glass-soft p-3 text-center"
                      >
                        <div
                          className="font-display text-lg font-bold text-white"
                          style={{ color: tool.color }}
                        >
                          {s.value}
                        </div>
                        <div className="text-[10px] text-[#64748b] mt-0.5 uppercase tracking-wider">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold transition-all ${
                      tool.status === 'live'
                        ? 'text-cyan-400 group-hover:gap-3'
                        : 'text-[#64748b]'
                    }`}
                  >
                    {tool.status === 'live' ? (
                      <>
                        Mở công cụ
                        <ArrowRight className="w-4 h-4" />
                      </>
                    ) : (
                      <span className="text-xs">Sắp ra mắt</span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA banner */}
          <div className="mt-12 rounded-3xl glass-border-glow p-8 md:p-12 text-center relative overflow-hidden">
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/10 rounded-full blur-[120px]" />
            <div className="relative">
              <h3 className="font-display font-bold text-2xl md:text-3xl text-white tracking-tight">
                Muốn tool #3 là gì? Bạn quyết định.
              </h3>
              <p className="mt-3 text-[#94a3b8] max-w-2xl mx-auto">
                Tham gia cộng đồng Telegram bình chọn tool tiếp theo. Mỗi lượt vote = 1 cơ hội nhận Premium 1 năm miễn phí.
              </p>
              <a
                href="#"
                className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-cyan-500 text-[#020409] font-semibold hover:bg-[#5ee8ff] transition-all hover:shadow-[0_0_32px_rgba(0,184,239,0.5)] hover:-translate-y-0.5"
              >
                Tham gia vote
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}