// =====================================================================
// Tool: Mua thông minh (price-smart) — Shared types
// =====================================================================

export type Platform = 'Shopee' | 'Lazada' | 'Tiki' | 'TikTok Shop' | 'Website khác';

export type Category = 'lam-dep' | 'nha-cua-doi-song' | 'thoi-trang-nu' | 'thoi-trang-nam';

export type Verdict = 'mua-ngay' | 'doi-them' | 'gia-ao';

export type PricePoint = {
  /** Day offset, 0 = today, 29 = 30 days ago */
  d: number;
  /** Price in VND */
  p: number;
};

export type StorePrice = {
  name: Platform | string;
  price: number;
  inStock: boolean;
  url?: string;
  shipping?: number;
};

export type ProductRecord = {
  id: string;
  /** Slug for matching */
  slug: string;
  name: string;
  brand: string;
  category: Category;
  /** Emoji placeholder (khi không load được ảnh) */
  image: string;
  /** Unsplash CDN URL cho product image */
  imageUrl: string;
  /** Gradient colors cho fallback */
  gradient: [string, string];
  /** Current lowest price across all stores */
  currentPrice: number;
  originalPrice: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  rating: number;
  reviewCount: number;
  /** 30-day price history (oldest → newest, last item = today) */
  history: number[];
  stores: StorePrice[];
  /** Pre-computed recommendation */
  recommendation: Verdict;
  /** Human-readable reason for recommendation */
  reason: string;
  /** SEO-friendly description */
  description: string;
  /** URL slug or query patterns to match this product */
  matchKeywords: string[];
  /** Optional: phần trăm giảm giá hiển thị trên badge */
  discountPct?: number;
  /** Optional: số lượng đã bán (e-commerce style) */
  soldCount?: number;
};

export type ProductAnalysis = {
  product: ProductRecord;
  /** Computed at analysis time */
  diffPctVsAvg: number;
  diffPctVsLowest: number;
  isFakeSale: boolean;
  trendDirection: 'up' | 'down' | 'stable';
  recommendation: Verdict;
  recommendationLabel: string;
  detailedReason: string;
  /** Best buying window suggestion */
  bestWindow: string;
};

// ---------- URL Parsing result ----------

export type ParsedProduct = {
  name: string;
  brand?: string;
  category?: Category;
  platform: Platform;
  detectedPrice?: number;
  confidence: number; // 0-100
};