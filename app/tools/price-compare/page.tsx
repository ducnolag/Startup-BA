'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { products, Product, formatVND } from '@/lib/mockData';
import { Search, X, Star, ExternalLink } from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'laptop', label: 'Laptop' },
  { id: 'phone', label: 'Điện thoại' },
  { id: 'audio', label: 'Âm thanh' },
  { id: 'camera', label: 'Máy ảnh' },
  { id: 'wearable', label: 'Đeo' },
  { id: 'gaming', label: 'Gaming' },
];

const SUPPORTED_STORES = [
  { name: 'Shopee', host: 'shopee.vn' },
  { name: 'Lazada', host: 'lazada.vn' },
  { name: 'Tiki', host: 'tiki.vn' },
  { name: 'TikTok Shop', host: 'tiktok.com' },
];

type SortKey = 'price' | 'discount' | 'recommendation';

function detectStore(url: string): { name: string } | null {
  try {
    const u = new URL(url.toLowerCase());
    const host = u.hostname;
    return SUPPORTED_STORES.find((s) => host.includes(s.host)) || null;
  } catch {
    return null;
  }
}

async function simulateAnalyze(url: string) {
  await new Promise((r) => setTimeout(r, 1500));
  const idx = url.length % products.length;
  return products[idx];
}

export default function PriceComparePage() {
  const [url, setUrl] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzedProduct, setAnalyzedProduct] = useState<Product | null>(null);
  const [error, setError] = useState('');

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<string>('all');
  const [sortKey, setSortKey] = useState<SortKey>('recommendation');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
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

  const detectedStore = useMemo(() => detectStore(url), [url]);

  const handleAnalyze = async () => {
    setError('');
    if (!url) {
      setError('Vui lòng dán link sản phẩm');
      return;
    }
    const store = detectStore(url);
    if (!store) {
      setError('Chưa hỗ trợ link từ trang này. Hỗ trợ: Shopee, Lazada, Tiki, TikTok Shop.');
      return;
    }
    setAnalyzing(true);
    setAnalyzedProduct(null);
    try {
      const result = await simulateAnalyze(url);
      setAnalyzedProduct(result);
    } catch {
      setError('Có lỗi khi phân tích. Vui lòng thử lại.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleReset = () => {
    setUrl('');
    setAnalyzedProduct(null);
    setError('');
  };

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
    const totalSaved = products.reduce((s, p) => s + (p.originalPrice - p.currentPrice), 0);
    const buyNowCount = products.filter((p) => p.recommendation === 'mua-ngay').length;
    const fakeCount = products.filter((p) => p.recommendation === 'gia-ao').length;
    return { totalSaved, buyNowCount, fakeCount };
  }, []);

  return (
    <main className="bg-white min-h-screen">
      <Navigation />

      {/* Hero with URL paste */}
      <section ref={sectionRef} className="pt-32 md:pt-40 pb-12 bg-surface-muted border-b border-line">
        <div className="container-page">
          <div data-anim className="eyebrow mb-5">
            Tool #2 · Mua sắm thông minh
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
            Dán link sản phẩm. Biết ngay có nên mua.
          </h1>
          <p data-anim className="mt-5 text-ink-muted max-w-2xl leading-relaxed">
            So sánh giá 4 sàn TMĐT VN, lịch sử 90 ngày, phát hiện giá ảo và gợi ý thời
            điểm mua tốt nhất.
          </p>

          {/* URL Paste Box */}
          <div data-anim className="mt-10 card p-2">
            <div className="flex flex-col md:flex-row gap-2 p-2">
              <div className="flex-1 relative">
                <input
                  type="url"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAnalyze()}
                  placeholder="Dán link sản phẩm từ Shopee, Lazada, Tiki, TikTok Shop..."
                  className="input-field pr-32"
                />
                {detectedStore && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 chip chip-active text-[10px]">
                    {detectedStore.name}
                  </span>
                )}
              </div>
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="btn-primary px-6 disabled:opacity-50"
              >
                {analyzing ? 'Đang phân tích...' : 'Phân tích'}
              </button>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 border-t border-line text-ink-subtle text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span>Hỗ trợ:</span>
                {SUPPORTED_STORES.map((s) => (
                  <span key={s.name} className="chip text-[10px] py-1">
                    {s.name}
                  </span>
                ))}
              </div>
              {url && !analyzing && (
                <button
                  onClick={handleReset}
                  className="text-ink-subtle hover:text-ink flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Xóa
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-4 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}
        </div>
      </section>

      {/* Analysis Result */}
      {analyzedProduct && (
        <section className="py-12 border-b border-line">
          <div className="container-page">
            <div className="flex items-center justify-between mb-6 text-sm text-ink-muted">
              <span className="flex items-center gap-2">
                <span className="status-dot" /> Kết quả phân tích
              </span>
              <button onClick={handleReset} className="text-brand hover:text-brand-deep">
                Phân tích link khác →
              </button>
            </div>
            <AnalyzedResult product={analyzedProduct} sourceUrl={url} />
          </div>
        </section>
      )}

      {/* Stats bar */}
      <section className="py-10 border-b border-line">
        <div className="container-page grid grid-cols-3 gap-px bg-line rounded-2xl overflow-hidden border border-line">
          <StatCell
            value={formatVND(stats.totalSaved).replace('đ', '')}
            unit="VNĐ"
            label="Tổng tiết kiệm"
          />
          <StatCell value={stats.buyNowCount} label="Nên mua ngay" />
          <StatCell value={stats.fakeCount} label="Cảnh báo giá ảo" />
        </div>
      </section>

      {/* Browse all products */}
      <section className="py-16">
        <div className="container-page">
          <div className="flex items-end justify-between mb-8 flex-wrap gap-4">
            <div>
              <div className="eyebrow mb-2">Duyệt danh sách</div>
              <h2 className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight">
                {filtered.length} sản phẩm đang theo dõi
              </h2>
            </div>
            <Link
              href="#"
              className="text-sm text-brand hover:text-brand-deep font-medium"
            >
              Đăng ký nhận alert →
            </Link>
          </div>

          <div className="space-y-3 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-subtle" />
                <input
                  type="text"
                  placeholder="Tìm sản phẩm..."
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
                <option value="recommendation">Gợi ý tốt nhất</option>
                <option value="price">Giá thấp → cao</option>
                <option value="discount">Giảm giá nhiều nhất</option>
              </select>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setCategory(c.id)}
                  className={`chip ${category === c.id ? 'chip-active' : ''}`}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onClick={() => setSelectedProduct(p)}
              />
            ))}
          </div>
        </div>
      </section>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}

      <Footer />
    </main>
  );
}

function AnalyzedResult({ product, sourceUrl }: { product: Product; sourceUrl: string }) {
  const lowestStore = product.stores.reduce((min, s) => (s.price < min.price ? s : min));
  const rec = product.recommendation;

  const recConfig = {
    'mua-ngay': {
      bg: 'bg-success/8',
      border: 'border-success/30',
      text: 'text-success',
      title: 'Nên mua ngay',
      desc: product.reason,
    },
    'doi-them': {
      bg: 'bg-warning/8',
      border: 'border-warning/30',
      text: 'text-warning',
      title: 'Nên đợi thêm',
      desc: product.reason,
    },
    'gia-ao': {
      bg: 'bg-danger/8',
      border: 'border-danger/30',
      text: 'text-danger',
      title: 'Cảnh báo: Giá ảo',
      desc: product.reason,
    },
  }[rec];

  return (
    <div className="card overflow-hidden">
      <div className={`${recConfig.bg} border-b ${recConfig.border} p-5 md:p-6`}>
        <div className="flex items-start gap-4">
          <div
            className={`w-10 h-10 rounded-lg ${recConfig.bg} border ${recConfig.border} flex items-center justify-center flex-shrink-0`}
          >
            <span className={`w-2 h-2 rounded-full ${recConfig.text.replace('text', 'bg')}`} />
          </div>
          <div className="flex-1">
            <div className={`text-lg font-display font-bold ${recConfig.text}`}>
              {recConfig.title}
            </div>
            <div className="text-sm text-ink-muted mt-1 leading-relaxed">
              {recConfig.desc}
            </div>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8 grid lg:grid-cols-5 gap-6">
        {/* Product card */}
        <div className="lg:col-span-2">
          <div className="card-soft p-5">
            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-xl bg-white border border-line flex items-center justify-center text-4xl flex-shrink-0">
                {product.image}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[10px] text-ink-subtle uppercase tracking-wider">
                  {product.brand}
                </div>
                <h3 className="font-display font-bold text-base text-ink leading-tight mt-1">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mt-2 text-xs">
                  <div className="flex items-center gap-1 text-warning">
                    <Star className="w-3 h-3 fill-warning" />
                    <span className="font-semibold">{product.rating}</span>
                  </div>
                  <span className="text-ink-subtle">·</span>
                  <span className="text-ink-muted">{product.reviewCount} đánh giá</span>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-line flex items-baseline gap-2">
              <span className="font-display text-2xl font-bold text-ink">
                {formatVND(product.currentPrice)}
              </span>
              <span className="text-sm text-ink-subtle line-through">
                {formatVND(product.originalPrice)}
              </span>
            </div>

            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 text-xs text-ink-subtle hover:text-ink flex items-center gap-1 truncate"
            >
              <ExternalLink className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{sourceUrl}</span>
            </a>
          </div>
        </div>

        {/* Price comparison */}
        <div className="lg:col-span-3 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider">
                So sánh 4 sàn (hôm nay)
              </div>
              <span className="text-[10px] text-ink-subtle">
                Cập nhật lúc{' '}
                {new Date().toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
            <div className="space-y-2">
              {product.stores
                .sort((a, b) => a.price - b.price)
                .map((store) => {
                  const isLowest = store.name === lowestStore.name;
                  return (
                    <div
                      key={store.name}
                      className={`flex items-center justify-between rounded-lg p-3 ${
                        isLowest
                          ? 'bg-ink/[0.04] border border-ink/10'
                          : 'card-soft'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-medium text-ink text-sm">
                          {store.name}
                        </span>
                        {isLowest && (
                          <span className="chip chip-active text-[9px] py-0.5">
                            Thấp nhất
                          </span>
                        )}
                      </div>
                      <span
                        className={`font-display text-base font-bold ${
                          isLowest ? 'text-ink' : 'text-ink-muted'
                        }`}
                      >
                        {formatVND(store.price)}
                      </span>
                    </div>
                  );
                })}
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider mb-3">
              Lịch sử 30 ngày
            </div>
            <PriceChart history={product.history} currentPrice={product.currentPrice} />
            <div className="grid grid-cols-4 gap-2 mt-3">
              <Mini label="Hiện tại" value={formatVND(product.currentPrice)} highlight />
              <Mini
                label="Thấp nhất"
                value={formatVND(product.lowestPrice)}
                color="text-success"
              />
              <Mini label="Cao nhất" value={formatVND(product.highestPrice)} />
              <Mini label="Trung bình" value={formatVND(product.averagePrice)} />
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-line p-6 flex flex-col md:flex-row gap-3">
        <a href="#" className="flex-1 btn-primary justify-center">
          Mua tại {lowestStore.name} — {formatVND(lowestStore.price)}
        </a>
        <button className="btn-ghost">Cảnh báo khi giảm thêm</button>
        <button className="btn-ghost">Chia sẻ</button>
      </div>
    </div>
  );
}

function Mini({
  label,
  value,
  highlight,
  color,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  color?: string;
}) {
  return (
    <div className={`rounded-lg p-2 ${highlight ? 'bg-ink/5' : 'card-soft'}`}>
      <div className="text-[9px] text-ink-subtle uppercase tracking-wider">{label}</div>
      <div className={`font-bold text-xs ${color || (highlight ? 'text-ink' : 'text-ink-muted')}`}>
        {value}
      </div>
    </div>
  );
}

function StatCell({
  value,
  unit,
  label,
}: {
  value: number | string;
  unit?: string;
  label: string;
}) {
  return (
    <div className="bg-white p-5">
      <div className="text-xs font-semibold uppercase tracking-wider text-ink-subtle mb-1">
        {label}
      </div>
      <div className="font-display text-2xl md:text-3xl font-bold text-ink flex items-baseline gap-1">
        {value}
        {unit && <span className="text-sm text-ink-muted font-normal">{unit}</span>}
      </div>
    </div>
  );
}

function ProductCard({ product, onClick }: { product: Product; onClick: () => void }) {
  const discountPct = Math.round(
    ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100
  );
  const lowestStore = product.stores.reduce((min, s) => (s.price < min.price ? s : min));

  const recColor =
    product.recommendation === 'mua-ngay'
      ? { text: 'text-success', label: 'Mua ngay' }
      : product.recommendation === 'doi-them'
      ? { text: 'text-warning', label: 'Đợi' }
      : { text: 'text-danger', label: 'Giá ảo' };

  return (
    <button
      onClick={onClick}
      className="card card-hover p-5 text-left w-full group"
    >
      <div className="flex items-start gap-4">
        <div className="w-16 h-16 rounded-xl bg-surface-muted border border-line flex items-center justify-center text-3xl flex-shrink-0">
          {product.image}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] text-ink-subtle uppercase tracking-wider">
              {product.brand}
            </span>
            <span className={`text-[10px] font-semibold ${recColor.text}`}>
              {recColor.label}
            </span>
          </div>

          <h3 className="font-display text-base font-semibold text-ink group-hover:text-brand transition-colors line-clamp-2 leading-tight mb-2">
            {product.name}
          </h3>

          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-display text-xl font-bold text-ink">
              {formatVND(product.currentPrice)}
            </span>
            <span className="text-xs text-ink-subtle line-through">
              {formatVND(product.originalPrice)}
            </span>
            <span className="text-[10px] font-bold text-success px-1.5 py-0.5 rounded bg-success/10">
              -{discountPct}%
            </span>
          </div>

          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-ink-muted">
              <span>
                Từ <span className="text-ink font-semibold">{lowestStore.name}</span>
              </span>
            </div>
            <div className="flex items-center gap-1 text-warning">
              <Star className="w-3 h-3 fill-warning" />
              <span>{product.rating}</span>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}

function ProductModal({ product, onClose }: { product: Product; onClose: () => void }) {
  const lowestStore = product.stores.reduce((min, s) => (s.price < min.price ? s : min));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto card p-7"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full card-soft hover:bg-line flex items-center justify-center z-10"
          aria-label="Đóng"
        >
          <X className="w-4 h-4" />
        </button>

        <AnalyzedResult
          product={product}
          sourceUrl={`https://${lowestStore.name.toLowerCase().replace(/\s+/g, '')}.vn/product/${product.id}`}
        />
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
  const h = 100;
  const stepX = w / (history.length - 1);

  const points = history.map((price, i) => ({
    x: i * stepX,
    y: h - ((price - min) / range) * h,
  }));

  const linePath = points
    .map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`))
    .join(' ');

  const areaPath = linePath + ` L${w},${h} L0,${h} Z`;

  return (
    <div className="card-soft p-4">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-24" preserveAspectRatio="none">
        <defs>
          <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#00a8d4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#00a8d4" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={areaPath} fill="url(#priceGrad)" />
        <path
          d={linePath}
          fill="none"
          stroke="#0f172a"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <line x1="0" y1={h} x2={w} y2={h} stroke="#e2e8f0" />
        <circle
          cx={(history.length - 1) * stepX}
          cy={h - ((currentPrice - min) / range) * h}
          r="4"
          fill="#0f172a"
          stroke="#ffffff"
          strokeWidth="2"
        />
      </svg>
    </div>
  );
}