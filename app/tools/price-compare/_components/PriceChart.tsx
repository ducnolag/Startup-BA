import React from 'react';

export default function PriceChart({
  history,
  currentPrice,
}: {
  history: number[];
  currentPrice: number;
}) {
  const max = Math.max(...history);
  const min = Math.min(...history);
  const range = max - min || 1;
  const w = 600;
  const h = 120;
  const stepX = w / (history.length - 1);

  const points = history.map((price, i) => ({
    x: i * stepX,
    y: h - ((price - min) / range) * h,
  }));

  const linePath = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  const areaPath =
    linePath +
    ` L${w},${h} L0,${h} Z`;

  return (
    <div className="rounded-2xl glass-soft p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-32" preserveAspectRatio="none">
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00b8ef" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#00b8ef" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Area fill */}
        <path d={areaPath} fill="url(#priceGrad)" />
        {/* Line */}
        <path
          d={linePath}
          fill="none"
          stroke="#00b8ef"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Min/max reference lines */}
        <line
          x1="0"
          y1={h - ((max - min) / range) * h}
          x2={w}
          y2={h - ((max - min) / range) * h}
          stroke="#94a3b8"
          strokeOpacity="0.2"
          strokeDasharray="4,4"
        />
        <line
          x1="0"
          y1={h}
          x2={w}
          y2={h}
          stroke="#94a3b8"
          strokeOpacity="0.2"
        />
        {/* Current point */}
        <circle
          cx={(history.length - 1) * stepX}
          cy={h - ((currentPrice - min) / range) * h}
          r="4"
          fill="#00b8ef"
          stroke="#020409"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}