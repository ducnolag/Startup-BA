'use client';

import type { ProductAnalysis } from '@/lib/price/types';
import { cn } from '@/lib/utils';

interface Props {
  analysis: ProductAnalysis;
}

export default function PriceChart({ analysis }: Props) {
  const { product } = analysis;
  const history = product.history;
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;

  // Build SVG path
  const width = 100;
  const height = 40;
  const stepX = width / (history.length - 1);
  const points = history.map((p, i) => {
    const x = i * stepX;
    const y = height - ((p - min) / range) * height;
    return [x, y] as [number, number];
  });
  const pathD = points
    .map(([x, y], i) => (i === 0 ? `M ${x} ${y}` : `L ${x} ${y}`))
    .join(' ');

  const minIdx = history.indexOf(min);
  const maxIdx = history.indexOf(max);

  return (
    <div className="bg-white border border-line rounded-2xl p-5 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <div>
          <div className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider mb-0.5">
            Lịch sử giá
          </div>
          <div className="text-sm text-ink font-medium">30 ngày qua</div>
        </div>
        <span className="text-[10px] text-ink-subtle uppercase tracking-wider">
          Cập nhật hôm nay
        </span>
      </div>

      {/* Chart */}
      <div className="relative h-44">
        <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="priceGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="rgb(0, 168, 212)" stopOpacity="0.15" />
              <stop offset="100%" stopColor="rgb(0, 168, 212)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Area */}
          <path d={`${pathD} L ${width} ${height} L 0 ${height} Z`} fill="url(#priceGrad)" />

          {/* Line */}
          <path
            d={pathD}
            fill="none"
            stroke="rgb(0, 168, 212)"
            strokeWidth="0.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="chart-line-draw"
          />

          {/* Min point */}
          {minIdx >= 0 && (
            <g>
              <circle cx={points[minIdx][0]} cy={points[minIdx][1]} r="1.2" fill="rgb(16, 185, 129)" stroke="white" strokeWidth="0.3" />
              <text x={points[minIdx][0]} y={points[minIdx][1] - 3} fontSize="2.4" fill="rgb(16, 185, 129)" textAnchor="middle" fontWeight="bold">
                {formatPriceShort(min)}
              </text>
            </g>
          )}
          {/* Max point */}
          {maxIdx >= 0 && maxIdx !== minIdx && (
            <g>
              <circle cx={points[maxIdx][0]} cy={points[maxIdx][1]} r="1.2" fill="rgb(239, 68, 68)" stroke="white" strokeWidth="0.3" />
              <text x={points[maxIdx][0]} y={points[maxIdx][1] - 3} fontSize="2.4" fill="rgb(239, 68, 68)" textAnchor="middle" fontWeight="bold">
                {formatPriceShort(max)}
              </text>
            </g>
          )}
          {/* Current point */}
          <circle cx={points[points.length - 1][0]} cy={points[points.length - 1][1]} r="1.4" fill="rgb(0, 168, 212)" stroke="white" strokeWidth="0.4" />
        </svg>
      </div>

      <div className="flex items-center justify-between mt-2 text-[10px] text-ink-subtle">
        <span>30 ngày trước</span>
        <span className="font-semibold text-ink">Hôm nay</span>
      </div>

      {/* Trust & source */}
      <div className="mt-5 pt-5 border-t border-line space-y-3">
        <div className="text-[11px] text-ink-muted leading-relaxed">
          <span className="font-semibold text-ink">Nguồn dữ liệu</span> · Tổng hợp từ Shopee, Lazada, Tiki và TikTok Shop. Cập nhật mỗi 6 giờ.
        </div>

        <div className="grid grid-cols-2 gap-2">
          {product.stores.map((s) => (
            <div
              key={s.name}
              className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-md bg-surface-muted text-ink-muted"
            >
              <span className="flex items-center gap-1.5">
                <span
                  className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    s.inStock ? 'bg-emerald-500' : 'bg-slate-300'
                  )}
                />
                {s.name}
              </span>
              <span className="font-medium text-ink tabular-nums">
                {s.price.toLocaleString('vi-VN')}đ
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function formatPriceShort(n: number): string {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'tr';
  if (n >= 1000) return (n / 1000).toFixed(0) + 'k';
  return n.toString();
}