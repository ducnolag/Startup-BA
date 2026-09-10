// =====================================================================
// Parser: extract product info từ URL hoặc text
// Strategy:
// 1. Nếu input là URL → parse URL pattern để lấy slug
// 2. Nếu input là plain text → dùng trực tiếp làm search keyword
// 3. Optional: gọi Gemini AI để extract thông tin chi tiết (khi có API key)
// =====================================================================

import { GEMINI_API_KEY, GEMINI_ENDPOINT, PLATFORM_PATTERNS } from '../constants';
import type { ParsedProduct, Platform } from './types';

/** Detect platform từ URL */
export function detectPlatform(url: string): Platform {
  for (const p of PLATFORM_PATTERNS) {
    if (p.match.test(url)) return p.name as Platform;
  }
  return 'Website khác';
}

/** Check nếu input là URL */
export function isUrl(input: string): boolean {
  return /^https?:\/\//i.test(input.trim());
}

/**
 * Parse product từ URL hoặc text.
 * Tự động nhận diện: nếu input là URL → extract slug, nếu là text → return as-is.
 */
export async function parseProductFromUrl(input: string): Promise<ParsedProduct> {
  const trimmed = input.trim();
  if (!trimmed) {
    return { name: '', platform: 'Website khác', confidence: 0 };
  }

  const platform: Platform = isUrl(trimmed) ? detectPlatform(trimmed) : 'Website khác';

  // 1) Nếu input là URL → fallback parse URL slug ngay (không cần AI)
  if (isUrl(trimmed)) {
    const urlResult = parseUrlSlug(trimmed, platform);
    if (urlResult.name && urlResult.name.length > 3) {
      // Nếu có Gemini API → enrich với AI (optional)
      if (GEMINI_API_KEY) {
        try {
          const aiResult = await enrichWithAI(trimmed, platform);
          if (aiResult.name) return { ...urlResult, ...aiResult };
        } catch (err) {
          console.warn('[parser] AI enrichment failed, using URL slug:', err);
        }
      }
      return urlResult;
    }
  }

  // 2) Plain text → dùng làm search keyword
  return {
    name: trimmed,
    platform,
    confidence: 60,
  };
}

/** Parse URL slug cho các sàn VN */
function parseUrlSlug(url: string, platform: Platform): ParsedProduct {
  let slug = '';

  // Shopee VN: https://shopee.vn/Slug-i.ShopID.ItemID
  const shopeeMatch = url.match(/shopee\.vn\/([^?#/]+)-i\.\d+\.\d+/i);
  if (shopeeMatch) {
    slug = shopeeMatch[1];
  }

  // Shopee alternative: shopee.vn/Slug-i.ItemID (older format)
  if (!slug) {
    const shopeeAlt = url.match(/shopee\.vn\/([^?#/]+)-i\.\d+/i);
    if (shopeeAlt) slug = shopeeAlt[1];
  }

  // Lazada VN: https://www.lazada.vn/products/slug-i123.html
  const lazadaMatch = url.match(/lazada\.vn\/products\/([^?#/]+)-i\d+/i);
  if (!slug && lazadaMatch) {
    slug = lazadaMatch[1];
  }

  // Tiki: https://tiki.vn/slug-p123.html
  const tikiMatch = url.match(/tiki\.vn\/([^?#/]+)-p\d+/i);
  if (!slug && tikiMatch) {
    slug = tikiMatch[1];
  }

  // TikTok Shop: https://www.tiktok.com/view/product/... hoặc /shop/...
  const tiktokMatch = url.match(/tiktok\.com\/[^?#/]*?(?:view\/product|shop|product)\/([^?#/]+)/i);
  if (!slug && tiktokMatch) {
    slug = tiktokMatch[1];
  }

  // Generic fallback: lấy phần path cuối
  if (!slug) {
    try {
      const u = new URL(url);
      const pathParts = u.pathname.split('/').filter(Boolean);
      slug = pathParts[pathParts.length - 1] ?? '';
      // Clean ID-like suffixes
      slug = slug.replace(/-i\d+.*/i, '').replace(/-p\d+.*/i, '');
    } catch {
      slug = '';
    }
  }

  // Convert slug → name: "son-3ce-lip-killer" → "son 3ce lip killer"
  const name = slug
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return {
    name,
    platform,
    confidence: name ? 65 : 30,
  };
}

/** Optional: dùng Gemini AI enrich thêm info */
async function enrichWithAI(
  url: string,
  platform: Platform
): Promise<Partial<ParsedProduct>> {
  const prompt = `Phân tích URL sản phẩm Việt Nam sau và trích xuất thông tin. Trả về JSON thuần (không markdown):
{
  "name": "Tên sản phẩm đầy đủ (tiếng Việt)",
  "brand": "Thương hiệu (nếu biết)",
  "category": "lam-dep | nha-cua-doi-song | thoi-trang-nu | unknown",
  "detectedPrice": <số VND, hoặc 0>
}

URL: ${url}`;

  const res = await fetch(`${GEMINI_ENDPOINT}?key=${GEMINI_API_KEY}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.1, maxOutputTokens: 256 },
    }),
  });

  if (!res.ok) throw new Error(`Gemini ${res.status}`);

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '';

  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '');
  }
  const obj = JSON.parse(clean);

  return {
    name: String(obj.name ?? ''),
    brand: obj.brand ? String(obj.brand) : undefined,
    category: obj.category ?? 'unknown',
    platform,
    detectedPrice: typeof obj.detectedPrice === 'number' ? obj.detectedPrice : undefined,
    confidence: 85,
  };
}