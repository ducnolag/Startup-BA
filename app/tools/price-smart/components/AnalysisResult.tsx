'use client';

import type { ProductAnalysis } from '@/lib/price/types';
import { cn } from '@/lib/utils';
import ProductImage from './ProductImage';

interface Props {
  analysis: ProductAnalysis;
}

const fmt = (n: number) => n.toLocaleString('vi-VN') + 'đ';

const verdictStyle: Record<string, { label: string; bg: string; text: string; dot: string; ring: string }> = {
  'mua-ngay': {
    label: 'Nên mua ngay',
    bg: 'bg-emerald-50',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
    ring: 'ring-emerald-200',
  },
  'doi-them': {
    label: 'Có thể đợi thêm',
    bg: 'bg-amber-50',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
    ring: 'ring-amber-200',
  },
  'gia-ao': {
    label: 'Cảnh báo giá ảo',
    bg: 'bg-red-50',
    text: 'text-red-800',
    dot: 'bg-red-500',
    ring: 'ring-red-200',
  },
};

const trendStyle: Record<string, { label: string; bg: string; text: string }> = {
  down: { label: 'Đang giảm', bg: 'bg-emerald-100', text: 'text-emerald-800' },
  up: { label: 'Đang tăng', bg: 'bg-red-100', text: 'text-red-800' },
  stable: { label: 'Ổn định', bg: 'bg-slate-100', text: 'text-slate-700' },
};

export default function AnalysisResult({ analysis }: Props) {
  const { product, diffPctVsAvg, recommendation, detailedReason, bestWindow, trendDirection } = analysis;
  const vs = verdictStyle[recommendation];
  const ts = trendStyle[trendDirection];
  const savings = product.originalPrice - product.currentPrice;

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* Verdict banner — clean, no icons */}
      <div className={cn('rounded-2xl p-5 border border-line', vs.bg)}>
        <div className="flex items-start gap-3">
          <div className={cn('w-2 h-2 rounded-full mt-2 shrink-0 ring-4', vs.dot, vs.ring)} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <span className={cn('font-bold text-base', vs.text)}>{vs.label}</span>
              <span className={cn('text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md', ts.bg, ts.text)}>
                {ts.label}
              </span>
            </div>
            <p className={cn('text-sm leading-relaxed', vs.text)}>{detailedReason}</p>
          </div>
        </div>
      </div>

      {/* Product card — e-commerce style */}
      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <div className="grid sm:grid-cols-[200px_1fr] gap-0">
          {/* Image (left side, big) */}
          <div className="relative aspect-square sm:aspect-auto group">
            <ProductImage
              src={product.imageUrl}
              alt={product.name}
              emoji={product.image}
              brand={product.brand}
              gradient={product.gradient}
              className="absolute inset-0"
              priority
              sizes="(max-width: 640px) 100vw, 200px"
            />
          </div>

          {/* Content (right side) */}
          <div className="p-5 sm:p-6">
            <div className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider mb-1.5">
              {product.brand}
            </div>
            <h3 className="font-semibold text-ink text-lg leading-tight mb-3 tracking-tight">
              {product.name}
            </h3>

            {/* Rating */}
            <div className="flex items-center gap-1.5 mb-4 text-xs">
              <span className="text-amber-500">★</span>
              <span className="font-semibold text-ink">{product.rating}</span>
              <span className="text-ink-subtle">·</span>
              <span className="text-ink-subtle">
                {product.reviewCount.toLocaleString('vi-VN')} đánh giá
              </span>
            </div>

            {/* Price */}
            <div className="mb-5">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-bold text-ink text-2xl tabular-nums tracking-tight">
                  {fmt(product.currentPrice)}
                </span>
                {savings > 0 && (
                  <span className="text-sm text-ink-subtle line-through tabular-nums">
                    {fmt(product.originalPrice)}
                  </span>
                )}
              </div>
              {savings > 0 && (
                <div className="text-xs text-emerald-600 font-semibold">
                  Tiết kiệm {fmt(savings)}
                </div>
              )}
            </div>

            {/* Price stats grid */}
            <div className="grid grid-cols-3 gap-2">
              <Stat
                label="Hiện tại"
                value={fmt(product.currentPrice)}
                highlight
              />
              <Stat
                label="TB 30 ngày"
                value={fmt(product.averagePrice)}
                sub={`${diffPctVsAvg >= 0 ? '+' : ''}${diffPctVsAvg}%`}
                subColor={diffPctVsAvg < 0 ? 'text-emerald-600' : 'text-red-600'}
              />
              <Stat
                label="Thấp nhất"
                value={fmt(product.lowestPrice)}
                sub={`−${fmt(product.currentPrice - product.lowestPrice)}`}
                subColor="text-emerald-600"
              />
            </div>
          </div>
        </div>

        {/* Store comparison — bottom bar */}
        <div className="border-t border-line bg-surface-muted px-5 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider">
              So sánh 4 sàn
            </span>
            <span className="text-[10px] text-ink-subtle">Cập nhật hôm nay</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {product.stores.map((s) => {
              const isBest = s.price === product.currentPrice;
              const inner = (
                <>
                  <div className="flex items-center gap-1.5 text-[11px]">
                    <span
                      className={cn(
                        'w-1.5 h-1.5 rounded-full',
                        s.inStock ? 'bg-emerald-500' : 'bg-slate-300'
                      )}
                    />
                    <span className={cn('font-medium', isBest ? 'text-brand-deep' : 'text-ink')}>
                      {s.name}
                    </span>
                  </div>
                  <div
                    className={cn(
                      'font-semibold tabular-nums text-sm',
                      isBest ? 'text-brand-deep' : 'text-ink'
                    )}
                  >
                    {fmt(s.price)}
                  </div>
                </>
              );
              const className = cn(
                'flex flex-col gap-0.5 px-3 py-2 rounded-lg transition-colors',
                isBest ? 'bg-white border border-brand/30' : 'bg-white border border-line',
                s.url && 'hover:border-brand/50 cursor-pointer'
              );
              return s.url ? (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={className}
                >
                  {inner}
                </a>
              ) : (
                <div key={s.name} className={className}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Best time window — clean, no icons */}
      <div className="bg-white border border-line rounded-2xl p-5 flex items-center justify-between gap-4">
        <div>
          <div className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider mb-1">
            Thời điểm mua tốt nhất
          </div>
          <div className="text-ink font-medium text-sm">{bestWindow}</div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-[10px] text-ink-subtle uppercase tracking-wider mb-0.5">
            Phân tích bởi
          </div>
          <div className="text-xs text-ink-muted">Gemini AI · 4 sàn VN</div>
        </div>
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  highlight,
  sub,
  subColor,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: string;
  subColor?: string;
}) {
  return (
    <div
      className={cn(
        'rounded-lg p-2.5',
        highlight ? 'bg-brand/5' : 'bg-surface-muted'
      )}
    >
      <div className="text-[9px] font-semibold uppercase tracking-wider text-ink-subtle mb-1 leading-tight">
        {label}
      </div>
      <div
        className={cn(
          'font-bold tabular-nums leading-tight text-sm',
          highlight ? 'text-brand-deep' : 'text-ink'
        )}
      >
        {value}
      </div>
      {sub && (
        <div className={cn('text-[10px] font-semibold mt-0.5', subColor)}>
          {sub}
        </div>
      )}
    </div>
  );
}