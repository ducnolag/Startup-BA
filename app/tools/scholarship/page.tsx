'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { scholarships, Scholarship } from '@/lib/mockData';
import { Search, X, ExternalLink } from 'lucide-react';

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
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const els = sectionRef.current.querySelectorAll<HTMLElement>('[data-anim]');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = '1';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
            observer.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(16px)';
      el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
      observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

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
    if (maxDeadlineDays !== null)
      list = list.filter((s) => s.deadlineDays <= maxDeadlineDays);

    if (sortKey === 'deadline') list.sort((a, b) => a.deadlineDays - b.deadlineDays);
    else if (sortKey === 'value')
      list.sort(
        (a, b) => (b.value.includes('Toàn phần') ? 1 : 0) - (a.value.includes('Toàn phần') ? 1 : 0)
      );
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
    <main className="bg-white min-h-screen">
      <Navigation />

      {/* Header */}
      <section ref={sectionRef} className="pt-32 md:pt-40 pb-12 bg-surface-muted border-b border-line">
        <div className="container-page">
          <div data-anim className="eyebrow mb-5">
            Tool #1 · Học bổng & Khóa học
          </div>
          <h1
            data-anim
            className="font-display font-bold text-ink tracking-tight max-w-3xl text-balance"
            style={{
              fontSize: 'clamp(2.25rem, 5vw, 3.75rem)',
              letterSpacing: '-0.035em',
              lineHeight: 1.05,
            }}
          >
            Săn học bổng quốc tế. Không bỏ lỡ deadline.
          </h1>
          <p data-anim className="mt-5 text-ink-muted max-w-2xl leading-relaxed">
            {stats.live} cơ hội từ {stats.countries} quốc gia ·{' '}
            <span className="text-ink font-medium">{stats.closing30Days}</span> đóng trong
            30 ngày.
          </p>

          <div data-anim className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-px bg-line rounded-2xl overflow-hidden border border-line">
            <StatCell value={stats.live} label="Cơ hội" />
            <StatCell value={stats.countries} label="Quốc gia" />
            <StatCell value={stats.fullFunded} label="Toàn phần" />
            <StatCell value={stats.closing30Days} label="Đóng 30 ngày" highlight />
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-16 md:top-20 z-40 bg-white/90 backdrop-blur-lg border-b border-line">
        <div className="container-page py-4 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
              <input
                type="text"
                placeholder="Tìm theo tên, nhà cung cấp, ngành..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value as SortKey)}
              className="input-field cursor-pointer md:w-56"
            >
              <option value="match">Phù hợp nhất</option>
              <option value="deadline">Deadline gần nhất</option>
              <option value="value">Giá trị cao nhất</option>
            </select>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <FilterChip active={selectedCategory === null} onClick={() => setSelectedCategory(null)}>
              Tất cả
            </FilterChip>
            {CATEGORIES.map((c) => (
              <FilterChip
                key={c.id}
                active={selectedCategory === c.id}
                onClick={() => setSelectedCategory(c.id)}
              >
                {c.label}
              </FilterChip>
            ))}
            <div className="w-px h-5 bg-line mx-1" />
            {COUNTRIES.slice(0, 6).map((c) => (
              <FilterChip
                key={c}
                active={selectedCountry === c}
                onClick={() => setSelectedCountry(selectedCountry === c ? null : c)}
              >
                {c}
              </FilterChip>
            ))}
            <div className="w-px h-5 bg-line mx-1" />
            <FilterChip
              active={maxDeadlineDays === 30}
              onClick={() => setMaxDeadlineDays(maxDeadlineDays === 30 ? null : 30)}
            >
              Dưới 30 ngày
            </FilterChip>
            <FilterChip
              active={maxDeadlineDays === 90}
              onClick={() => setMaxDeadlineDays(maxDeadlineDays === 90 ? null : 90)}
            >
              Dưới 3 tháng
            </FilterChip>

            {(query || selectedCountry || selectedCategory || maxDeadlineDays) && (
              <button
                onClick={resetFilters}
                className="ml-auto text-xs text-ink-subtle hover:text-ink flex items-center gap-1 flex-shrink-0"
              >
                <X className="w-3 h-3" /> Xóa bộ lọc
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12">
        <div className="container-page">
          <div className="flex items-center justify-between mb-6 text-sm text-ink-muted">
            <span>
              Hiển thị{' '}
              <span className="text-ink font-semibold">{filtered.length}</span> /{' '}
              {scholarships.length} cơ hội
            </span>
          </div>

          {filtered.length === 0 ? (
            <div className="card p-16 text-center">
              <h3 className="font-display text-xl text-ink mb-2">Không tìm thấy kết quả</h3>
              <p className="text-ink-muted mb-4">Thử xóa bộ lọc hoặc đổi từ khóa khác</p>
              <button onClick={resetFilters} className="btn-primary">
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

      {selectedItem && <DetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />}

      <Footer />
    </main>
  );
}

function StatCell({
  value,
  label,
  highlight,
}: {
  value: number;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className={`bg-white p-5 ${highlight ? 'bg-surface-subtle' : ''}`}>
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-1">
        {label}
      </div>
      <div className="font-display text-2xl md:text-3xl font-bold text-ink">{value}</div>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={`chip ${active ? 'chip-active' : ''}`}>
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
      className="card card-hover p-5 md:p-6 text-left w-full group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 text-xs text-ink-muted">
          <span className="text-xl">{item.flag}</span>
          <span>{item.country}</span>
        </div>
        {item.matchScore && (
          <span
            className={`chip ${
              item.matchScore >= 85
                ? 'chip-active'
                : ''
            } text-[10px]`}
          >
            MATCH {item.matchScore}%
          </span>
        )}
      </div>

      <h3 className="font-display font-semibold text-lg text-ink mb-2 group-hover:text-brand transition-colors leading-tight">
        {item.title}
      </h3>

      <p className="text-xs text-ink-muted mb-4 line-clamp-2 leading-relaxed">
        {item.description}
      </p>

      <div className="flex flex-wrap gap-1.5 mb-5">
        {item.field.slice(0, 3).map((f) => (
          <span key={f} className="chip text-[10px] py-1">
            {f}
          </span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-line">
        <div>
          <div className="text-[10px] text-ink-subtle uppercase tracking-wider mb-0.5">
            Giá trị
          </div>
          <div className="text-sm font-semibold text-ink">{item.value}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-ink-subtle uppercase tracking-wider mb-0.5">
            Deadline
          </div>
          <div
            className={`text-sm font-semibold ${
              isCritical
                ? 'text-danger'
                : isUrgent
                ? 'text-warning'
                : 'text-ink'
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-2xl w-full max-h-[90vh] overflow-y-auto card p-7 md:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full card-soft hover:bg-line flex items-center justify-center"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <span className="text-3xl">{item.flag}</span>
          <div>
            <div className="text-xs text-ink-muted">{item.provider}</div>
            <div className="text-sm text-ink-subtle">{item.country}</div>
          </div>
        </div>

        <h2 className="font-display text-2xl md:text-3xl font-bold text-ink tracking-tight mb-3">
          {item.title}
        </h2>

        <p className="text-ink-muted leading-relaxed mb-6">{item.description}</p>

        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="card-soft p-4">
            <div className="text-[10px] text-ink-subtle uppercase tracking-wider mb-1">
              Giá trị
            </div>
            <div className="text-ink font-semibold text-sm">{item.value}</div>
          </div>
          <div className="card-soft p-4">
            <div className="text-[10px] text-ink-subtle uppercase tracking-wider mb-1">
              Thời hạn
            </div>
            <div className="text-ink font-semibold text-sm">{item.duration}</div>
          </div>
          <div className="card-soft p-4">
            <div className="text-[10px] text-ink-subtle uppercase tracking-wider mb-1">
              Deadline
            </div>
            <div
              className={`font-semibold text-sm ${
                item.deadlineDays <= 7
                  ? 'text-danger'
                  : item.deadlineDays <= 30
                  ? 'text-warning'
                  : 'text-ink'
              }`}
            >
              {new Date(item.deadline).toLocaleDateString('vi-VN')} (
              {item.deadlineDays} ngày)
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2">
            Ngành
          </div>
          <div className="flex flex-wrap gap-2">
            {item.field.map((f) => (
              <span key={f} className="chip">
                {f}
              </span>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-2">
            Yêu cầu
          </div>
          <ul className="space-y-2 text-sm text-ink-muted">
            {item.requirements.gpa && (
              <li className="flex items-start gap-2">
                <span className="status-dot mt-2" aria-hidden />
                GPA tối thiểu:{' '}
                <span className="text-ink font-medium">{item.requirements.gpa}</span>
              </li>
            )}
            {item.requirements.ielts && (
              <li className="flex items-start gap-2">
                <span className="status-dot mt-2" aria-hidden />
                IELTS tối thiểu:{' '}
                <span className="text-ink font-medium">{item.requirements.ielts}</span>
              </li>
            )}
            {item.requirements.other?.map((r, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="status-dot mt-2" aria-hidden />
                {r}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-xs text-ink-subtle mb-6">
          Nguồn: <span className="text-ink">{item.source}</span>
        </div>

        <div className="flex gap-3">
          <a
            href={item.applyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 btn-primary justify-center"
          >
            Ứng tuyển ngay
            <ExternalLink className="w-4 h-4" />
          </a>
          <button className="btn-ghost">Lưu lại</button>
        </div>
      </div>
    </div>
  );
}