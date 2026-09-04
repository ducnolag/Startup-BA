import { Store, Star } from 'lucide-react';
import { Product } from '../_types';
import { formatVND } from '../_data/mockProducts';

export default function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const discountPct = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );
  const lowestStore = product.stores.reduce((min, s) =>
    s.price < min.price ? s : min
  );

  const recColor =
    product.recommendation === 'mua-ngay'
      ? { bg: 'bg-emerald-500/15', text: 'text-emerald-400', label: '✓ Nên mua ngay' }
      : product.recommendation === 'doi-them'
      ? { bg: 'bg-amber-500/15', text: 'text-amber-400', label: '⏳ Đợi thêm' }
      : { bg: 'bg-red-500/15', text: 'text-red-400', label: '⚠ Giá ảo' };

  return (
    <button
      onClick={onClick}
      className="group text-left rounded-2xl glass-border-glow p-5 hover:bg-white/[0.02] transition-all spotlight"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl flex-shrink-0"
          style={{
            background:
              'linear-gradient(135deg, rgba(0,184,239,0.1), rgba(0,102,204,0.08))',
            border: '1px solid rgba(0,184,239,0.15)',
          }}
        >
          {product.image}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] text-[#64748b] uppercase tracking-wider">
              {product.brand}
            </span>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${recColor.bg} ${recColor.text}`}
            >
              {recColor.label}
            </span>
          </div>

          <h3 className="font-display text-base font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2 leading-tight mb-2">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-display text-xl font-bold text-cyan-400">
              {formatVND(product.currentPrice)}
            </span>
            <span className="text-xs text-[#64748b] line-through">
              {formatVND(product.originalPrice)}
            </span>
            <span className="text-[10px] font-bold text-emerald-400 px-1.5 py-0.5 rounded bg-emerald-500/10">
              -{discountPct}%
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-[#94a3b8]">
              <Store className="w-3 h-3" />
              <span>
                Từ <span className="text-white font-semibold">{lowestStore.name}</span>{' '}
                {formatVND(lowestStore.price)}
              </span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Star className="w-3 h-3 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}