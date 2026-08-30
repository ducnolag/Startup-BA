'use client';

import { useState, useMemo } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { scholarships, Scholarship, formatVND } from '@/lib/mockData';
import {
  GraduationCap,
  Search,
  MapPin,
  Calendar,
  Award,
  Filter,
  ExternalLink,
  X,
  Clock,
  Globe,
  CheckCircle2,
  TrendingUp,
} from 'lucide-react';

const COUNTRIES = Array.from(new Set(scholarships.map((s) => s.country))).sort();
const CATEGORIES: { id: Scholarship['category']; label: string }[] = [
  { id: 'hoc-bong', label: 'Học bổng' },
  { id: 'khoa-hoc', label: 'Khóa học' },
  { id: 'trao-doi', label: 'Trao đổi' },
];

type SortKey = 'deadline' | 'value' | 'match';

export default function ScholarshipPage() {
  const [query, setQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Scholarship['category'] | null>(null);
  const [maxDeadlineDays, setMaxDeadlineDays] = useState<number | null>(null);
  const [sortKey, setSortKey] = useState<SortKey>('match');
  const [selectedItem, setSelectedItem] = useState<Scholarship | null>(null);

  const filtered = useMemo(() => {
    let list = [...scholarships];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.provider.toLowerCase().includes(q) ||
          s.field.some((f) => f.toLowerCase().includes(q))
      );
    }
    if (selectedCountry) list = list.filter((s) => s.country === selectedCountry);
    if (selectedCategory) list = list.filter((s) => s.category === selectedCategory);
    if (maxDeadlineDays !== null) list = list.filter((s) => s.deadlineDays <= maxDeadlineDays);

    if (sortKey === 'deadline') list.sort((a, b) => a.deadlineDays - b.deadlineDays);
    else if (sortKey === 'value')
      list.sort((a, b) => (b.value.includes('Toàn phần') ? 1 : 0) - (a.value.includes('Toàn phần') ? 1 : 0));
    else if (sortKey === 'match')
      list.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));

    return list;
  }, [query, selectedCountry, selectedCategory, maxDeadlineDays, sortKey]);

  const resetFilters = () => {
    setQuery('');
    setSelectedCountry(null);
    setSelectedCategory(null);
    setMaxDeadlineDays(null);
  };

  const stats = useMemo(() => {
    const live = scholarships.length;
    const countries = new Set(scholarships.map((s) => s.country)).size;
    const fullFunded = scholarships.filter((s) => s.value.includes('Toàn phần')).length;
    const closing30Days = scholarships.filter((s) => s.deadlineDays <= 30).length;
    return { live, countries, fullFunded, closing30Days };
  }, []);

  return (
    <main className="relative bg-[#020409] min-h-screen">
      <Navigation />

      {/* Header */}
      <section className="relative pt-32 pb-12 overflow-hidden">
        <div className="absolute inset-0 bg-mesh opacity-40" />
        <div className="relative max-w-7xl mx-auto px-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-cyan-500/50" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Tool #1 · Học bổng & Khóa học
            </span>
          </div>
          <h1
            className="font-display font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-white max-w-3xl"
            style={{ letterSpacing: '-0.03em' }}
          >
            Săn học bổng quốc tế.{' '}
            <span className="text-brand-gradient">Không bỏ lỡ deadline.</span>
          </h1>
          <p className="mt-6 text-lg text-[#94a3b8] max-w-2xl leading-relaxed">
            {stats.live} cơ hội từ {stats.countries} quốc gia. Lọc theo profile của bạn — hết deadline trong 30 ngày có{' '}
            <span className="text-cyan-400 font-semibold">{stats.closing30Days}</span>.
          </p>

          {/* Stats bar */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard icon={GraduationCap} value={stats.live} label="Cơ hội" />
            <StatCard icon={Globe} value={stats.countries} label="Quốc gia" />
            <StatCard icon={Award} value={stats.fullFunded} label="Toàn phần" />
            <StatCard
              icon={Clock}
              value={stats.closing30Days}
              label="Đóng trong 30 ngày"
              highlight
            />
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-20 z-40 py-4 backdrop-blur-xl bg-[#020409]/80 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-3">
          {/* Search bar */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="text"
                placeholder="Tìm theo tên, nhà cung cấp, ngành..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#64748b] focus:outline-none focus:border-cyan-500/50 transition-colors"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-cyan-500/50 cursor-pointer text-sm"
            >
              <option value="match" className="bg-[#0a0f1f]">Phù hợp nhất</option>
              <option value="deadline" className="bg-[#0a0f1f]">Deadline gần nhất</option>
              <option value="value" className="bg-[#0a0f1f]">Giá trị cao nhất</option>
            </select>
          </div>

          {/* Filter chips */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Filter className="w-4 h-4 text-[#64748b] flex-shrink-0" />

            <Chip active={selectedCategory === null} onClick={() => setSelectedCategory(null)}>
              Tất cả
            </Chip>
            {CATEGORIES.map((c) => (
              <Chip
                key={c.id}
                active={selectedCategory === c.id}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.label}
              </Chip>
            ))}

            <div className="w-px h-5 bg-white/10 mx-1" />

            {COUNTRIES.slice(0, 6).map((c) => (
              <Chip
                key={c}
                active={selectedCountry === c}
                onClick={() => setSelectedCountry(selectedCountry === c ? null : c)}
              >
                {c}
              </Chip>
            ))}

            <div className="w-px h-5 bg-white/10 mx-1" />

            <Chip
              active={maxDeadlineDays === 30}
              onClick={() => setMaxDeadlineDays(maxDeadlineDays === 30 ? null : 30)}
            >
              ⚡ Dưới 30 ngày
            </Chip>
            <Chip
              active={maxDeadlineDays === 90}
              onClick={() => setMaxDeadlineDays(maxDeadlineDays === 90 ? null : 90)}
            >
              Dưới 3 tháng
            </Chip>

            {(query || selectedCountry || selectedCategory || maxDeadlineDays) && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs text-[#64748b] hover:text-cyan-400 flex items-center gap-1 flex-shrink-0"
              >
                <X className="w-3 h-3" /> Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm text-[#94a3b8]">
              Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {scholarships.length} cơ hội
            </h2>
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl glass-border-glow p-16 text-center">
              <Search className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
              <h3 className="font-display text-xl text-white mb-2">Không tìm thấy kết quả</h3>
              <p className="text-[#94a3b8] mb-4">Thử xóa bộ lọc hoặc đổi từ khóa khác</p>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-full bg-cyan-500 text-[#020409] font-semibold text-sm"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((s) => (
                <ScholarshipCard
                  key={s.id}
                  item={s}
                  onClick={() => setSelectedItem(s)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      <Footer />
    </main>
  );
}

function StatCard({
  icon: Icon,
  value,
  label,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number | string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-4 ${
        highlight ? 'glass-cyan' : 'glass-soft'
      }`}
    >
      <div className="flex items-center gap-2 text-[10px] text-cyan-400 uppercase tracking-wider font-medium mb-2">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="font-display text-3xl font-bold text-white">{value}</div>
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0 ${
        active
          ? 'bg-cyan-500 text-[#020409] font-semibold'
          : 'bg-white/5 text-[#94a3b8] hover:bg-white/10 hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}

function ScholarshipCard({ item, onClick }: { item: Scholarship; onClick: () => void }) {
  const isUrgent = item.deadlineDays <= 30;
  const isCritical = item.deadlineDays <= 7;

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl glass-border-glow p-6 hover:bg-white/[0.02] transition-all spotlight"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-xs">
          <span className="text-2xl">{item.flag}</span>
          <span className="text-[#64748b]">{item.country}</span>
          {item.verified && (
            <span title="Đã xác thực">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            </span>
          )}
        </div>
        {item.matchScore && (
          <div
            className={`px-2.5 py-1 rounded-full text-[10px] font-mono font-semibold ${
              item.matchScore >= 85
                ? 'bg-emerald-500/15 text-emerald-400'
                : item.matchScore >= 70
                ? 'bg-cyan-500/15 text-cyan-400'
                : 'bg-white/5 text-[#94a3b8]'
            }`}
          >
            MATCH {item.matchScore}%
          </div>
        )}
      </div>

      <h3 className="font-display text-lg font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors leading-tight">
        {item.title}
      </h3>

      <div className="text-xs text-[#94a3b8] mb-4 line-clamp-2">{item.description}</div>

      {/* Fields */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {item.field.slice(0, 3).map((f) => (
          <span
            key={f}
            className="px-2 py-0.5 rounded-full glass-soft text-[10px] text-[#94a3b8]"
          >
            {f}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-white/5">
        <div>
          <div className="text-[10px] text-[#64748b] uppercase tracking-wider">Giá trị</div>
          <div className="text-sm font-semibold text-cyan-400">{item.value}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#64748b] uppercase tracking-wider">Deadline</div>
          <div
            className={`text-sm font-semibold ${
              isCritical ? 'text-red-400' : isUrgent ? 'text-amber-400' : 'text-white'
            }`}
          >
            {item.deadlineDays === 0 ? 'Hôm nay' : `${item.deadlineDays} ngày`}
          </div>
        </div>
      </div>
    </button>
  );
}

function DetailModal({ item, onClose }: { item: Scholarship; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020409]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto rounded-3xl glass-border-glow p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glass-soft hover:bg-white/10 flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-4xl">{item.flag}</span>
          <div>
            <div className="text-xs text-cyan-400 uppercase tracking-wider">{item.provider}</div>
            <div className="text-sm text-[#64748b]">{item.country}</div>
          </div>
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-bold text-white tracking-tight mb-3">
          {item.title}
        </h2>

        <p className="text-[#94a3b8] leading-relaxed mb-6">{item.description}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="rounded-xl glass-soft p-4">
            <div className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">Giá trị</div>
            <div className="text-cyan-400 font-semibold text-sm">{item.value}</div>
          </div>
          <div className="rounded-xl glass-soft p-4">
            <div className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">Thời hạn</div>
            <div className="text-white font-semibold text-sm">{item.duration}</div>
          </div>
          <div className="rounded-xl glass-soft p-4">
            <div className="text-[10px] text-[#64748b] uppercase tracking-wider mb-1">Deadline</div>
            <div
              className={`font-semibold text-sm ${
                item.deadlineDays <= 7
                  ? 'text-red-400'
                  : item.deadlineDays <= 30
                  ? 'text-amber-400'
                  : 'text-white'
              }`}
            >
              {new Date(item.deadline).toLocaleDateString('vi-VN')} ({item.deadlineDays} ngày)
            </div>
          </div>
        </div>

        {/* Fields */}
        <div className="mb-6">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-medium mb-2">Ngành</div>
          <div className="flex flex-wrap gap-2">
            {item.field.map((f) => (
              <span
                key={f}
                className="px-3 py-1 rounded-full glass-soft text-xs text-white"
              >
                {f}
              </span>
            ))}
          </div>
        </div>

        {/* Requirements */}
        <div className="mb-6">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-medium mb-2">Yêu cầu</div>
          <ul className="space-y-2 text-sm text-[#94a3b8]">
            {item.requirements.gpa && (
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                GPA tối thiểu: <span className="text-white font-medium">{item.requirements.gpa}</span>
              </li>
            )}
            {item.requirements.ielts && (
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                IELTS tối thiểu: <span className="text-white font-medium">{item.requirements.ielts}</span>
              </li>
            )}
            {item.requirements.other?.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                {r}
              </li>
            ))}
          </ul>
        </div>

        {/* Source */}
        <div className="text-xs text-[#64748b] mb-6">
          Nguồn: <span className="text-cyan-400">{item.source}</span> · Đã xác thực ngày{' '}
          {new Date().toLocaleDateString('vi-VN')}
        </div>

        <div className="flex gap-3">
          <a
            href={item.applyUrl}
            className="flex-1 py-3 rounded-full bg-cyan-500 text-[#020409] font-semibold text-center hover:bg-[#5ee8ff] transition-all flex items-center justify-center gap-2"
          >
            Ứng tuyển ngay
            <ExternalLink className="w-4 h-4" />
          </a>
          <button className="px-5 py-3 rounded-full glass-soft hover:border-cyan-500/30 text-sm font-semibold text-white">
            Lưu lại
          </button>
        </div>
      </div>
    </div>
  );
}