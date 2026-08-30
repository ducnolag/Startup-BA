'use client';

import { useState, useMemo } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { products, Product, formatVND } from '@/lib/mockData';
import {
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Search,
  Filter,
  X,
  Store,
  Star,
  Bell,
  ShoppingCart,
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'laptop', label: '💻 Laptop' },
  { id: 'phone', label: '📱 Điện thoại' },
  { id: 'audio', label: '🎧 Âm thanh' },
  { id: 'camera', label: '📷 Máy ảnh' },
  { id: 'wearable', label: '⌚ Đeo' },
  { id: 'gaming', label: '🎮 Gaming' },
];

type SortKey = 'price' | 'discount' | 'recommendation';

export default function PriceComparePage() {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('recommendation');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const filtered = useMemo(() => {
    let list = [...products];

    if (query) {
      const q = query.toLowerCase();
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q)
      );
    }
    if (category !== 'all') list = list.filter((p) => p.category === category);

    if (sortKey === 'price') list.sort((a, b) => a.currentPrice - b.currentPrice);
    else if (sortKey === 'discount')
      list.sort(
        (a, b) =>
          (b.originalPrice - b.currentPrice) / b.originalPrice -
          (a.originalPrice - a.currentPrice) / a.originalPrice
      );
    else if (sortKey === 'recommendation') {
      const order = { 'mua-ngay': 0, 'doi-them': 1, 'gia-ao': 2 };
      list.sort((a, b) => order[a.recommendation] - order[b.recommendation]);
    }

    return list;
  }, [query, category, sortKey]);

  const stats = useMemo(() => {
    const totalSaved = products.reduce((sum, p) => sum + (p.originalPrice - p.currentPrice), 0);
    const buyNowCount = products.filter((p) => p.recommendation === 'mua-ngay').length;
    const fakeCount = products.filter((p) => p.recommendation === 'gia-ao').length;
    return { totalSaved, buyNowCount, fakeCount };
  }, []);

  const resetFilters = () => {
    setQuery('');
    setCategory('all');
  };

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
              Tool #2 · Mua sắm thông minh
            </span>
          </div>
          <h1
            className="font-display font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-white max-w-3xl"
            style={{ letterSpacing: '-0.03em' }}
          >
            Mua sắm thông minh.{' '}
            <span className="text-brand-gradient">Không mua hớ.</span>
          </h1>
          <p className="mt-6 text-lg text-[#94a3b8] max-w-2xl leading-relaxed">
            So sánh {products.length} sản phẩm trên 4 sàn TMĐT VN. Lịch sử giá 30 ngày.
            Phát hiện <span className="text-red-400 font-semibold">giá ảo</span>. Gợi ý{' '}
            <span className="text-emerald-400 font-semibold">thời điểm mua</span>.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3">
            <StatCard
              icon={TrendingDown}
              value={formatVND(stats.totalSaved).replace('đ', '')}
              unit="VNĐ"
              label="Tổng tiết kiệm phát hiện"
              highlight
            />
            <StatCard
              icon={CheckCircle2}
              value={stats.buyNowCount}
              label="Sản phẩm nên mua ngay"
            />
            <StatCard
              icon={AlertTriangle}
              value={stats.fakeCount}
              label="Cảnh báo giá ảo"
            />
          </div>
        </div>
      </section>

      {/* Search & Filters */}
      <section className="sticky top-20 z-40 py-4 backdrop-blur-xl bg-[#020409]/80 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 space-y-3">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
              <input
                type="text"
                placeholder="Tìm sản phẩm (MacBook, iPhone, Sony...)"
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
              <option value="recommendation" className="bg-[#0a0f1f]">Gợi ý tốt nhất</option>
              <option value="price" className="bg-[#0a0f1f]">Giá thấp → cao</option>
              <option value="discount" className="bg-[#0a0f1f]">Giảm giá nhiều nhất</option>
            </select>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <Filter className="w-4 h-4 text-[#64748b] flex-shrink-0" />
            {CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setCategory(c.id)}
                className={`px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-all flex-shrink-0 ${
                  category === c.id
                    ? 'bg-cyan-500 text-[#020409] font-semibold'
                    : 'bg-white/5 text-[#94a3b8] hover:bg-white/10 hover:text-white'
                }`}
              >
                {c.label}
              </button>
            ))}

            {(query || category !== 'all') && (
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
          <div className="text-sm text-[#94a3b8] mb-6">
            Hiển thị <span className="text-white font-semibold">{filtered.length}</span> / {products.length} sản phẩm
          </div>

          {filtered.length === 0 ? (
            <div className="rounded-3xl glass-border-glow p-16 text-center">
              <Search className="w-12 h-12 text-[#64748b] mx-auto mb-4" />
              <h3 className="font-display text-xl text-white mb-2">Không tìm thấy sản phẩm</h3>
              <button
                onClick={resetFilters}
                className="px-5 py-2 rounded-full bg-cyan-500 text-[#020409] font-semibold text-sm"
              >
                Xóa bộ lọc
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-4">
              {filtered.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onClick={() => setSelectedProduct(p)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Detail modal */}
      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <Footer />
    </main>
  );
}

function StatCard({
  icon: Icon,
  value,
  unit,
  label,
  highlight,
}: {
  icon: React.ComponentType<{ className?: string }>;
  value: number | string;
  unit?: string;
  label: string;
  highlight?: boolean;
}) {
  return (
    <div className={`rounded-2xl p-4 ${highlight ? 'glass-cyan' : 'glass-soft'}`}>
      <div className="flex items-center gap-2 text-[10px] text-cyan-400 uppercase tracking-wider font-medium mb-2">
        <Icon className="w-3 h-3" />
        {label}
      </div>
      <div className="font-display text-2xl md:text-3xl font-bold text-white flex items-baseline gap-1">
        {value}
        {unit && <span className="text-sm text-[#94a3b8] font-normal">{unit}</span>}
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
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

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const discountPct = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );
  const lowestStore = product.stores.reduce((min, s) =>
    s.price < min.price ? s : min
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#020409]/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-3xl glass-border-glow p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-10 h-10 rounded-full glass-soft hover:bg-white/10 flex items-center justify-center"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-5 mb-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{
              background:
                'linear-gradient(135deg, rgba(0,184,239,0.15), rgba(0,102,204,0.1))',
              border: '1px solid rgba(0,184,239,0.2)',
            }}
          >
            {product.image}
          </div>

          <div className="flex-1">
            <div className="text-xs text-cyan-400 uppercase tracking-wider mb-1">
              {product.brand}
            </div>
            <h2 className="font-display text-xl md:text-2xl font-bold text-white tracking-tight mb-2">
              {product.name}
            </h2>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-amber-400 text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span className="font-semibold">{product.rating}</span>
                <span className="text-[#64748b]">({product.reviewCount})</span>
              </div>
              <span className="text-[#64748b] text-sm">·</span>
              <span className="text-[#94a3b8] text-sm">{product.stores.length} sàn</span>
            </div>
          </div>
        </div>

        {/* Recommendation */}
        <div
          className={`mb-6 rounded-2xl p-5 ${
            product.recommendation === 'mua-ngay'
              ? 'bg-emerald-500/10 border border-emerald-500/20'
              : product.recommendation === 'doi-them'
              ? 'bg-amber-500/10 border border-amber-500/20'
              : 'bg-red-500/10 border border-red-500/20'
          }`}
        >
          <div
            className={`text-sm font-semibold mb-1 ${
              product.recommendation === 'mua-ngay'
                ? 'text-emerald-400'
                : product.recommendation === 'doi-them'
                ? 'text-amber-400'
                : 'text-red-400'
            }`}
          >
            {product.recommendation === 'mua-ngay'
              ? '✓ Khuyến nghị: MUA NGAY'
              : product.recommendation === 'doi-them'
              ? '⏳ Khuyến nghị: ĐỢI THÊM'
              : '⚠ CẢNH BÁO: GIÁ ẢO'}
          </div>
          <p className="text-sm text-white/90 leading-relaxed">{product.reason}</p>
        </div>

        {/* Price comparison across stores */}
        <div className="mb-6">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-medium mb-3">
            So sánh giá 4 sàn (hôm nay)
          </div>
          <div className="space-y-2">
            {product.stores
              .sort((a, b) => a.price - b.price)
              .map((store) => {
                const isLowest = store.name === lowestStore.name;
                return (
                  <div
                    key={store.name}
                    className={`flex items-center justify-between rounded-xl p-4 ${
                      isLowest ? 'bg-cyan-500/10 border border-cyan-500/30' : 'glass-soft'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Store className="w-4 h-4 text-cyan-400" />
                      <span className="font-medium text-white">{store.name}</span>
                      {isLowest && (
                        <span className="px-2 py-0.5 rounded-full bg-cyan-500 text-[#020409] text-[10px] font-bold">
                          THẤP NHẤT
                        </span>
                      )}
                      {!store.inStock && (
                        <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-400 text-[10px] font-semibold">
                          Hết hàng
                        </span>
                      )}
                    </div>
                    <span
                      className={`font-display text-lg font-bold ${
                        isLowest ? 'text-cyan-400' : 'text-white'
                      }`}
                    >
                      {formatVND(store.price)}
                    </span>
                  </div>
                );
              })}
          </div>
        </div>

        {/* Price history chart */}
        <div className="mb-6">
          <div className="text-[10px] text-cyan-400 uppercase tracking-wider font-medium mb-3">
            Lịch sử 30 ngày
          </div>
          <PriceChart history={product.history} currentPrice={product.currentPrice} />
          <div className="grid grid-cols-4 gap-2 mt-4 text-xs">
            <div>
              <div className="text-[#64748b]">Hiện tại</div>
              <div className="text-cyan-400 font-bold">{formatVND(product.currentPrice)}</div>
            </div>
            <div>
              <div className="text-[#64748b]">Thấp nhất</div>
              <div className="text-emerald-400 font-bold">{formatVND(product.lowestPrice)}</div>
            </div>
            <div>
              <div className="text-[#64748b]">Cao nhất</div>
              <div className="text-white/40">{formatVND(product.highestPrice)}</div>
            </div>
            <div>
              <div className="text-[#64748b]">Trung bình</div>
              <div className="text-[#94a3b8]">{formatVND(product.averagePrice)}</div>
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <a
            href="#"
            className="flex-1 py-3 rounded-full bg-cyan-500 text-[#020409] font-semibold text-center hover:bg-[#5ee8ff] transition-all flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            Mua tại {lowestStore.name}
          </a>
          <button className="px-5 py-3 rounded-full glass-soft hover:border-cyan-500/30 text-sm font-semibold text-white flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Cảnh báo giá
          </button>
        </div>
      </div>
    </div>
  );
}

function PriceChart({
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