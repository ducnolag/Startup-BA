// =====================================================================
// Live price scraper — dùng Gemini Search Grounding
// Strategy:
// 1. Parse URL → lấy tên sản phẩm + platform gốc
// 2. Gọi Gemini với Google Search tool → tìm giá hiện tại trên 4 sàn
// 3. Cache kết quả trong Supabase (TTL 24h) để tiết kiệm quota
// 4. Fallback về mock nếu Gemini fail
// =====================================================================

import { GEMINI_API_KEY, GEMINI_MODEL, GEMINI_ENDPOINT } from '../constants';
import { generateMockProduct, getProductBySlug, findProductByKeyword } from './data';
import { parseProductFromUrl, isUrl } from './parser';
import { createServiceSupabase } from '../supabase';
import type { ProductRecord, Platform, StorePrice, Category } from './types';

export type LivePriceSource = 'shopee' | 'lazada' | 'tiki' | 'tiktok' | 'cache' | 'catalog' | 'mock';

export type LivePriceResult = {
  product: ProductRecord;
  sources: Array<{
    platform: Platform | string;
    url?: string;
    fetchedAt: string;
  }>;
  confidence: 'high' | 'medium' | 'low';
  isLiveData: boolean;
  errorMessage?: string;
};

// =====================================================================
// Cache layer — Supabase table `price_cache`
// Schema:
//   url_hash    text PK (md5 của URL)
//   payload     jsonb (full result)
//   scraped_at  timestamptz
// =====================================================================

function hashUrl(url: string): string {
  // Simple but stable hash
  let h = 5381;
  for (let i = 0; i < url.length; i++) h = ((h << 5) + h) ^ url.charCodeAt(i);
  return (h >>> 0).toString(36);
}

const CACHE_TTL_HOURS = 24;

async function readCache(url: string): Promise<LivePriceResult | null> {
  const supabase = createServiceSupabase();
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('price_cache')
      .select('payload, scraped_at')
      .eq('url_hash', hashUrl(url))
      .single();
    if (error || !data) return null;

    const ageMs = Date.now() - new Date(data.scraped_at).getTime();
    const ttlMs = CACHE_TTL_HOURS * 60 * 60 * 1000;
    if (ageMs > ttlMs) return null;

    return data.payload as LivePriceResult;
  } catch {
    return null;
  }
}

async function writeCache(url: string, payload: LivePriceResult): Promise<void> {
  const supabase = createServiceSupabase();
  if (!supabase) return;
  try {
    await supabase.from('price_cache').upsert({
      url_hash: hashUrl(url),
      payload,
      scraped_at: new Date().toISOString(),
    });
  } catch (err) {
    console.warn('[scraper] Failed to write cache:', err);
  }
}

// =====================================================================
// Gemini Search Grounding — lấy giá thật từ Google Search
// =====================================================================

type GeminiStorePrice = {
  name: string;
  price: number;
  url?: string;
};

type GeminiProductInfo = {
  name: string;
  brand?: string;
  category?: string;
  image?: string;
  rating?: number;
  reviewCount?: number;
  soldCount?: number;
  stores: GeminiStorePrice[];
  description?: string;
};

async function callGeminiWithSearch(prompt: string): Promise<{ text: string; sources: Array<{ uri: string; title?: string }> } | null> {
  if (!GEMINI_API_KEY) return null;

  try {
    const r = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ google_search: {} }],
        generationConfig: { temperature: 0.1 },
      }),
    });
    if (!r.ok) {
      console.warn('[scraper] Gemini status:', r.status);
      return null;
    }
    const data = await r.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const groundingChunks = data?.candidates?.[0]?.groundingMetadata?.groundingChunks ?? [];
    const sources = groundingChunks
      .map((c: any) => c?.web ? { uri: c.web.uri, title: c.web.title } : null)
      .filter(Boolean);
    return { text, sources };
  } catch (err) {
    console.warn('[scraper] Gemini error:', err);
    return null;
  }
}

/**
 * Dùng Gemini Search Grounding để tìm giá THẬT của sản phẩm trên 4 sàn VN.
 */
async function fetchLivePricesFromGemini(
  productName: string,
  sourcePlatform: Platform | string,
  originalUrl?: string
): Promise<{ info: GeminiProductInfo; sources: Array<{ uri: string; title?: string }> } | null> {
  const urlHint = originalUrl ? `\nLink sản phẩm gốc: ${originalUrl}\n` : '';
  const prompt = `Tìm giá bán hiện tại (đơn vị VND, số nguyên không thập phân) của sản phẩm "${productName}" trên CẢ 4 sàn thương mại điện tử Việt Nam: Shopee.vn, Lazada.vn, Tiki.vn, TikTok Shop (tiktok.com).
${urlHint}
Yêu cầu nghiêm ngặt:
1. Tìm TRÊN TỪNG SÀN một sản phẩm có tên CHÍNH XÁC hoặc rất giống "${productName}"
2. Trả về GIÁ BÁN HIỆN TẠI (không phải giá gốc, không phải giá flash sale đã hết hạn, không phải giá ghi chú "strikethrough"). Nếu có nhiều phiên bản → lấy giá thấp nhất
3. BẮT BUỘC tìm trên Shopee và Lazada (2 sàn lớn nhất VN). Nếu không có trên sàn nào → bỏ qua sàn đó nhưng vẫn trả stores rỗng
4. URL phải là URL THẬT trên sàn (https://shopee.vn/product/... hoặc https://www.lazada.vn/products/... hoặc https://tiki.vn/... hoặc https://www.tiktok.com/...). ĐỪNG BỊA URL — nếu không chắc chắn thì bỏ trống trường "url"
5. Tìm trên Google Search với site: filter (vd: site:shopee.vn "${productName}") để có kết quả chính xác
6. Nếu có link gốc ở trên → ưu tiên lấy giá từ trang đó

Trả về JSON THUẦN (không markdown, không giải thích, không có text thừa trước/sau JSON):
{
  "name": "Tên sản phẩm chính xác (tiếng Việt, có dấu)",
  "brand": "Thương hiệu",
  "category": "lam-dep | nha-cua-doi-song | thoi-trang-nu | thoi-trang-nam | dien-tu",
  "image": "URL ảnh sản phẩm thật (từ sàn hoặc trang chính hãng)",
  "rating": 4.5,
  "reviewCount": 1234,
  "soldCount": 500,
  "stores": [
    { "name": "Shopee", "price": 259000, "url": "https://shopee.vn/..." },
    { "name": "Lazada", "price": 279000, "url": "https://lazada.vn/..." },
    { "name": "Tiki", "price": 269000, "url": "https://tiki.vn/..." },
    { "name": "TikTok Shop", "price": 249000, "url": "https://tiktok.com/..." }
  ],
  "description": "Mô tả 1-2 câu (tiếng Việt)"
}

Nếu KHÔNG tìm thấy sản phẩm trên BẤT KỲ sàn nào, trả về JSON: {"error": "not found"}`;

  const result = await callGeminiWithSearch(prompt);
  if (!result) return null;

  // Parse JSON từ text (Gemini đôi khi wrap trong markdown hoặc thêm text)
  let clean = result.text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  // Tìm JSON object — lấy object lớn nhất
  const jsonMatch = clean.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    console.warn('[scraper] No JSON in Gemini response:', clean.slice(0, 200));
    return null;
  }

  try {
    const info = JSON.parse(jsonMatch[0]) as GeminiProductInfo & { error?: string };
    if (info.error) return null;
    if (!info.name) return null;
    if (!Array.isArray(info.stores)) info.stores = [];
    return { info, sources: result.sources };
  } catch (err) {
    console.warn('[scraper] Failed to parse Gemini JSON:', err, jsonMatch[0].slice(0, 300));
    return null;
  }
}

// =====================================================================
// Build ProductRecord từ Gemini response
// =====================================================================

const CATEGORY_MAP: Record<string, Category> = {
  'lam-dep': 'lam-dep',
  'nha-cua-doi-song': 'nha-cua-doi-song',
  'thoi-trang-nu': 'thoi-trang-nu',
  'thoi-trang-nam': 'thoi-trang-nam',
  'dien-tu': 'nha-cua-doi-song', // mapping electronics → nhà cửa đời sống (closest category)
};

/** Override category nếu Gemini sai — check từ khóa trong tên sản phẩm */
function refineCategory(name: string, geminiCategory: string): Category {
  const n = name.toLowerCase();
  // Điện tử (ưu tiên cao nhất)
  if (/\b(iphone|ipad|macbook|airpods|apple watch|samsung|xiaomi|oppo|vivo|realme|dell|hp|laptop|asus|acer|lenovo|tai nghe|chuột|ban phim|sạc|cáp|ổ cứng|usb|tivi|tv|máy ảnh|camera)\b/i.test(n))
    return 'nha-cua-doi-song';
  // Nhà cửa (đồ gia dụng)
  if (/\b(nồi|máy hút|máy lọc|máy giặt|tủ lạnh|tủ đông|bếp|quạt|nồi cơm|nệm|chảo|ấm|lock|lock&lock)\b/i.test(n))
    return 'nha-cua-doi-song';
  // Làm đẹp
  if (/\b(son|lip|serum|kem\s|phấn|mascara|nước hoa|lancome|3ce|foreo|skii|sk-ii|mỹ phẩm|nail|tóc)\b/i.test(n))
    return 'lam-dep';
  // Thời trang nam
  if (/\b(áo polo|polo nam|shorts nam|áo nam|quần nam|giày nam|sneaker nam|hoodie nam|áo thun nam)\b/i.test(n))
    return 'thoi-trang-nam';
  // Fallback Gemini
  return CATEGORY_MAP[geminiCategory] ?? 'thoi-trang-nu';
}

function buildProductFromGemini(
  info: GeminiProductInfo,
  fallbackName: string
): ProductRecord {
  // Filter out fake/placeholder URLs (Gemini đôi khi bịa URL)
  const stores: StorePrice[] = (info.stores ?? [])
    .filter(s => {
      if (!s.price || s.price <= 0) return false;
      // Loại bỏ URL giả (chứa "000000" placeholder hoặc không phải HTTPS)
      if (s.url && (s.url.includes('000000') || s.url.includes('placeholder'))) return false;
      return true;
    })
    .map(s => ({
      name: s.name as Platform,
      price: s.price,
      inStock: true,
      url: s.url && /^https?:\/\//.test(s.url) ? s.url : undefined,
    }));

  // Nếu Gemini không trả store nào → fallback
  if (stores.length === 0) {
    return generateMockProduct(fallbackName, 'Shopee');
  }

  const prices = stores.map(s => s.price);
  const currentPrice = Math.min(...prices);
  const highestPrice = Math.max(...prices);
  const averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);

  // Estimate lowest/original (mock nếu thiếu)
  const lowestPrice = Math.round(currentPrice * 0.85);
  const originalPrice = Math.round(currentPrice * 1.3);

  // Generate 30-day history xung quanh currentPrice
  const history: number[] = [];
  const seed = info.name.length * 7;
  let s = seed;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  let p = currentPrice * 0.9;
  for (let i = 0; i < 30; i++) {
    const reversion = (currentPrice - p) * 0.05;
    const noise = (rand() - 0.5) * currentPrice * 0.04;
    p = p + reversion + noise;
    p = Math.max(lowestPrice, Math.min(originalPrice, p));
    history.push(Math.round(p));
  }
  history[29] = currentPrice;

  // Recommendation logic
  const discountPct = Math.round((1 - currentPrice / originalPrice) * 100);
  const vsAvg = ((currentPrice - averagePrice) / averagePrice) * 100;
  let recommendation: ProductRecord['recommendation'] = 'doi-them';
  let reason = '';
  if (currentPrice <= averagePrice * 0.92) {
    recommendation = 'mua-ngay';
    reason = `Giá thấp hơn ${Math.abs(Math.round(vsAvg))}% so với trung bình 4 sàn.`;
  } else if (currentPrice >= averagePrice * 1.1) {
    recommendation = 'gia-ao';
    reason = `Giá cao hơn ${Math.round(vsAvg)}% so với trung bình 4 sàn. Cân nhắc đợi sale.`;
  } else {
    recommendation = 'doi-them';
    reason = `Giá ổn định so với trung bình 4 sàn.`;
  }
  if (discountPct > 30) {
    recommendation = 'mua-ngay';
    reason += ` Đang giảm ${discountPct}% so với giá gốc.`;
  }

  return {
    id: 'live_' + info.name.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 30),
    slug: info.name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 50),
    name: info.name,
    brand: info.brand ?? 'Unknown',
    category: refineCategory(info.name, info.category ?? ''),
    image: '🛍️',
    imageUrl: info.image ?? '',
    gradient: ['#f5f5f5', '#e0e0e0'],
    currentPrice,
    originalPrice,
    lowestPrice,
    highestPrice,
    averagePrice,
    rating: info.rating ?? 4.5,
    reviewCount: info.reviewCount ?? 0,
    history,
    stores,
    recommendation,
    reason,
    description: info.description ?? `Sản phẩm phổ biến. Cập nhật ${new Date().toLocaleDateString('vi-VN')}.`,
    matchKeywords: info.name.toLowerCase().split(/\s+/).filter(w => w.length >= 3),
    discountPct,
    soldCount: info.soldCount ?? 0,
  };
}

// =====================================================================
// Main API
// =====================================================================

/**
 * Fetch giá thật từ URL hoặc tên sản phẩm.
 * Thử theo thứ tự:
 *   1. Catalog (nếu match chính xác)
 *   2. Cache Supabase (24h TTL)
 *   3. Gemini Search Grounding (real-time)
 *   4. Mock (fallback cuối)
 */
export async function fetchLivePrice(input: string): Promise<LivePriceResult> {
  // 1) Parse input
  const parsed = isUrl(input)
    ? await parseProductFromUrl(input)
    : { name: input.trim(), platform: 'Website khác' as Platform };

  const searchKey = parsed.name || input;
  if (!searchKey) {
    return {
      product: generateMockProduct('Sản phẩm', 'Shopee'),
      sources: [],
      confidence: 'low',
      isLiveData: false,
      errorMessage: 'Không nhận diện được sản phẩm',
    };
  }

  // 2) Check catalog
  const catalogMatch = findProductByKeyword(searchKey);
  if (catalogMatch) {
    return {
      product: catalogMatch,
      sources: [],
      confidence: 'high',
      isLiveData: false, // catalog không phải "live" nhưng đáng tin cậy
    };
  }

  // 3) Check cache (chỉ cho URL, không cho text input)
  if (isUrl(input)) {
    const cached = await readCache(input);
    if (cached) {
      return { ...cached, sources: [{ ...cached.sources[0], platform: 'cache' as any }] };
    }
  }

  // 4) Try Gemini Search Grounding
  const live = await fetchLivePricesFromGemini(searchKey, parsed.platform, isUrl(input) ? input : undefined);
  if (live) {
    const product = buildProductFromGemini(live.info, searchKey);
    const result: LivePriceResult = {
      product,
      sources: live.sources.map(s => ({
        platform: parsed.platform,
        url: s.uri,
        fetchedAt: new Date().toISOString(),
      })),
      confidence: live.sources.length > 0 ? 'high' : 'medium',
      isLiveData: true,
    };
    // Write cache (best effort)
    if (isUrl(input)) await writeCache(input, result);
    return result;
  }

  // 5) Fallback to mock
  return {
    product: generateMockProduct(searchKey, parsed.platform),
    sources: [],
    confidence: 'low',
    isLiveData: false,
    errorMessage: 'Không lấy được dữ liệu thật. Hiển thị kết quả ước tính.',
  };
}