// =====================================================================
// Seeded mock catalog — Dữ liệu thật VN, deterministic từ slug
// Phase 1 dùng data này. Phase 2 sẽ replace bằng Supabase.
// =====================================================================

import type { ProductRecord } from './types';

// Helper: tạo 30-day history với volatility thực tế
function generateHistory(
  basePrice: number,
  lowest: number,
  highest: number,
  /** Seed number for deterministic randomization */
  seed: number
): number[] {
  const out: number[] = [];
  // Simple seeded PRNG (mulberry32)
  let s = seed | 0;
  const rand = () => {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Start from a random price in range, walk randomly
  let p = basePrice * (0.95 + rand() * 0.1);
  for (let i = 0; i < 30; i++) {
    // Random walk with mean reversion to basePrice
    const reversion = (basePrice - p) * 0.08;
    const noise = (rand() - 0.5) * basePrice * 0.025;
    p = p + reversion + noise;
    p = Math.max(lowest * 0.95, Math.min(highest * 1.05, p));
    out.push(Math.round(p));
  }
  // Today = basePrice
  out[29] = basePrice;
  return out;
}

// Helper: format image URL với sizing Unsplash
const img = (id: string, w = 600) =>
  `https://images.unsplash.com/photo-${id}?w=${w}&q=80&auto=format&fit=crop`;

// Gradient fallbacks (tông pastel theo category)
const g = (a: string, b: string): [string, string] => [a, b];

// =====================================================================
// Catalog: 18 sản phẩm phổ biến VN, đúng category người dùng chọn
// Categories: lam-dep, nha-cua-doi-song, thoi-trang-nu
// =====================================================================

export const CATALOG: ProductRecord[] = [
  // ─── LÀM ĐẸP ───
  {
    id: 'p_3ce_lipstick',
    slug: 'son-3ce-lipstick',
    name: 'Son 3CE Lip Killer 3.5g',
    brand: '3CE',
    category: 'lam-dep',
    image: '💄',
    imageUrl: img('1586495777744-4413f21062fa'),
    gradient: g('#fce4ec', '#f8bbd0'),
    currentPrice: 389000,
    originalPrice: 490000,
    lowestPrice: 349000,
    highestPrice: 490000,
    averagePrice: 412000,
    rating: 4.7,
    reviewCount: 2341,
    history: generateHistory(389000, 349000, 490000, 1001),
    stores: [
      { name: 'Shopee', price: 389000, inStock: true, shipping: 0 },
      { name: 'Lazada', price: 399000, inStock: true, shipping: 15000 },
      { name: 'Tiki', price: 419000, inStock: true, shipping: 0 },
      { name: 'TikTok Shop', price: 379000, inStock: true, shipping: 0 },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang thấp hơn 6% so với trung bình. TikTok Shop đang flash sale.',
    description: 'Son tint lì Hàn Quốc, lên màu chuẩn, lâu trôi 8-12h.',
    matchKeywords: ['3ce', 'lip killer', 'son 3ce', 'son', 'lip', 'matte'],
    discountPct: 21,
    soldCount: 12843,
  },
  {
    id: 'p_foreo_luna',
    slug: 'foreo-luna-3',
    name: 'Máy rửa mặt Foreo Luna 3',
    brand: 'Foreo',
    category: 'lam-dep',
    image: '🧴',
    imageUrl: img('1571781926291-c477ebfd024b'),
    gradient: g('#e3f2fd', '#bbdefb'),
    currentPrice: 3290000,
    originalPrice: 4490000,
    lowestPrice: 2790000,
    highestPrice: 4490000,
    averagePrice: 3520000,
    rating: 4.8,
    reviewCount: 1245,
    history: generateHistory(3290000, 2790000, 4490000, 1002),
    stores: [
      { name: 'Shopee', price: 3290000, inStock: true, shipping: 0 },
      { name: 'Lazada', price: 3490000, inStock: true, shipping: 0 },
      { name: 'Tiki', price: 3390000, inStock: false },
    ],
    recommendation: 'doi-them',
    reason: 'Giá ổn định, có thể giảm thêm 10% vào sale 9/9. Đợi 7-10 ngày.',
    description: 'Máy rửa mặt silicon sonic T-Sonic, 8 cường độ, pin 600 lần dùng.',
    matchKeywords: ['foreo', 'luna', 'foreo luna', 'máy rửa mặt', 'rua mat'],
    discountPct: 27,
    soldCount: 5234,
  },
  {
    id: 'p_sk2_facial_treatment',
    slug: 'skii-facial-treatment',
    name: 'SK-II Facial Treatment Essence 230ml',
    brand: 'SK-II',
    category: 'lam-dep',
    image: '✨',
    imageUrl: img('1556228720-195a672e8a03'),
    gradient: g('#fff3e0', '#ffe0b2'),
    currentPrice: 4590000,
    originalPrice: 5500000,
    lowestPrice: 3890000,
    highestPrice: 5500000,
    averagePrice: 4720000,
    rating: 4.9,
    reviewCount: 3789,
    history: generateHistory(4590000, 3890000, 5500000, 1003),
    stores: [
      { name: 'Shopee', price: 4690000, inStock: true },
      { name: 'Lazada', price: 4790000, inStock: true },
      { name: 'Tiki', price: 4590000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá hiện tại chỉ cao hơn giá thấp nhất 18%. Đang có mã giảm 200k trên Tiki.',
    description: 'Tinh chất Pitera 97.7% cải thiện kết cấu da, sáng đều màu.',
    matchKeywords: ['skii', 'sk-ii', 'facial treatment', 'essence', 'pitera', 'skii facial'],
    discountPct: 17,
    soldCount: 2156,
  },
  {
    id: 'p_lancome_advanced',
    slug: 'lancome-genifique',
    name: 'Lancôme Advanced Génifique Serum 50ml',
    brand: 'Lancôme',
    category: 'lam-dep',
    image: '💧',
    imageUrl: img('1620916566398-39f1143ab7be'),
    gradient: g('#f3e5f5', '#e1bee7'),
    currentPrice: 2890000,
    originalPrice: 3690000,
    lowestPrice: 2490000,
    highestPrice: 3690000,
    averagePrice: 3080000,
    rating: 4.7,
    reviewCount: 1456,
    history: generateHistory(2890000, 2490000, 3690000, 1004),
    stores: [
      { name: 'Shopee', price: 2890000, inStock: true },
      { name: 'Lazada', price: 3090000, inStock: true },
      { name: 'Tiki', price: 2990000, inStock: true },
    ],
    recommendation: 'gia-ao',
    reason: 'CẢNH BÁO: Giá tăng 18% trong 5 ngày qua trước "sale cuối tháng". Hiện tại CAO hơn TB 8%. ĐỢI 2 tuần.',
    description: 'Tinh chất phục hồi da 7 tác động, dùng cho mọi loại da.',
    matchKeywords: ['lancome', 'lancôme', 'genifique', 'serum', 'lancome serum'],
    discountPct: 22,
    soldCount: 1823,
  },
  {
    id: 'p_some_by_mi',
    slug: 'some-by-mi-serum',
    name: 'Some By Mi AHA-BHA-PHA Serum 30ml',
    brand: 'Some By Mi',
    category: 'lam-dep',
    image: '🌿',
    imageUrl: img('1596462502278-27bfdc403348'),
    gradient: g('#e8f5e9', '#c8e6c9'),
    currentPrice: 249000,
    originalPrice: 350000,
    lowestPrice: 199000,
    highestPrice: 350000,
    averagePrice: 268000,
    rating: 4.6,
    reviewCount: 5621,
    history: generateHistory(249000, 199000, 350000, 1005),
    stores: [
      { name: 'Shopee', price: 249000, inStock: true },
      { name: 'Lazada', price: 269000, inStock: true },
      { name: 'TikTok Shop', price: 239000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang ở mức thấp. Shopee đang có voucher giảm 30k.',
    description: 'Serum trị mụn Hàn Quốc, kết hợp 3 loại acid cân bằng da.',
    matchKeywords: ['some by mi', 'aha bha pha', 'serum', 'someby', 'tri mun'],
    discountPct: 29,
    soldCount: 18943,
  },
  {
    id: 'p_chanel_coco',
    slug: 'chanel-coco-mademoiselle',
    name: 'Chanel Coco Mademoiselle EDP 100ml',
    brand: 'Chanel',
    category: 'lam-dep',
    image: '🌸',
    imageUrl: img('1541643600914-78b084683601'),
    gradient: g('#fbe9e7', '#ffccbc'),
    currentPrice: 4990000,
    originalPrice: 6200000,
    lowestPrice: 4290000,
    highestPrice: 6200000,
    averagePrice: 5240000,
    rating: 4.9,
    reviewCount: 892,
    history: generateHistory(4990000, 4290000, 6200000, 1006),
    stores: [
      { name: 'Shopee', price: 4990000, inStock: true },
      { name: 'Lazada', price: 5190000, inStock: true },
      { name: 'Tiki', price: 5090000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason: 'Giá ổn định 30 ngày qua. Sale cuối năm có thể giảm thêm 10-15%.',
    description: 'Nước hoa nữ Châu Âu, hương hoa phương Đông, lưu hương 8-10h.',
    matchKeywords: ['chanel', 'coco mademoiselle', 'nuoc hoa', 'nuoc hoa nu', 'chanel nuoc hoa'],
    discountPct: 19,
    soldCount: 643,
  },

  // ─── NHÀ CỬA & ĐỜI SỐNG ───
  {
    id: 'p_philips_rice_cooker',
    slug: 'philips-rice-cooker',
    name: 'Nồi cơm điện Philips HD4515/65 1.8L',
    brand: 'Philips',
    category: 'nha-cua-doi-song',
    image: '🍚',
    imageUrl: img('1556910103-1c02745aae4d'),
    gradient: g('#f5f5f5', '#e0e0e0'),
    currentPrice: 1890000,
    originalPrice: 2490000,
    lowestPrice: 1590000,
    highestPrice: 2490000,
    averagePrice: 1950000,
    rating: 4.7,
    reviewCount: 2156,
    history: generateHistory(1890000, 1590000, 2490000, 2001),
    stores: [
      { name: 'Shopee', price: 1890000, inStock: true },
      { name: 'Lazada', price: 1990000, inStock: true },
      { name: 'Tiki', price: 2090000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang ở mức thấp. Có voucher giảm thêm 100k trên Shopee.',
    description: 'Nồi cơm điện tử 1.8L, 8 chế độ nấu, công nghệ iF heating.',
    matchKeywords: ['philips', 'noi com', 'noi com dien', 'hd4515', 'philips noi com'],
    discountPct: 24,
    soldCount: 8123,
  },
  {
    id: 'p_xiaomi_air_purifier',
    slug: 'xiaomi-air-purifier-4',
    name: 'Máy lọc không khí Xiaomi Air Purifier 4',
    brand: 'Xiaomi',
    category: 'nha-cua-doi-song',
    image: '💨',
    imageUrl: img('1585771724684-38269d6639fd'),
    gradient: g('#e0f7fa', '#b2ebf2'),
    currentPrice: 3490000,
    originalPrice: 4990000,
    lowestPrice: 2990000,
    highestPrice: 4990000,
    averagePrice: 3720000,
    rating: 4.8,
    reviewCount: 3421,
    history: generateHistory(3490000, 2990000, 4990000, 2002),
    stores: [
      { name: 'Shopee', price: 3490000, inStock: true },
      { name: 'Lazada', price: 3690000, inStock: true },
      { name: 'TikTok Shop', price: 3390000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá thấp nhất 60 ngày qua. TikTok Shop đang có deal độc quyền.',
    description: 'Máy lọc không khí 400m³/h, lọc bụi mịn PM2.5, điều khiển qua app.',
    matchKeywords: ['xiaomi', 'air purifier', 'may loc khong khi', 'may loc', 'xiaomi air'],
    discountPct: 30,
    soldCount: 5621,
  },
  {
    id: 'p_dyson_v12',
    slug: 'dyson-v12-detect',
    name: 'Dyson V12 Detect Slim Absolute',
    brand: 'Dyson',
    category: 'nha-cua-doi-song',
    image: '🧹',
    imageUrl: img('1558317374-067fb5f30001'),
    gradient: g('#ede7f6', '#d1c4e9'),
    currentPrice: 15990000,
    originalPrice: 19990000,
    lowestPrice: 13990000,
    highestPrice: 19990000,
    averagePrice: 16870000,
    rating: 4.9,
    reviewCount: 542,
    history: generateHistory(15990000, 13990000, 19990000, 2003),
    stores: [
      { name: 'Shopee', price: 15990000, inStock: true },
      { name: 'Lazada', price: 16490000, inStock: false },
      { name: 'Tiki', price: 16290000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason: 'Giá ổn định, có thể giảm thêm 5-7% vào dịp Black Friday.',
    description: 'Máy hút bụi không dây cao cấp, laser phát hiện bụi, pin 60 phút.',
    matchKeywords: ['dyson', 'v12', 'may hut bui', 'dyson v12'],
    discountPct: 20,
    soldCount: 432,
  },
  {
    id: 'p_locklock_jar',
    slug: 'locklock-classic',
    name: 'Bộ hộp Lock&Lock Classic 9 món',
    brand: 'Lock&Lock',
    category: 'nha-cua-doi-song',
    image: '🥡',
    imageUrl: img('1610701596007-11502861dcfa'),
    gradient: g('#e8eaf6', '#c5cae9'),
    currentPrice: 549000,
    originalPrice: 850000,
    lowestPrice: 459000,
    highestPrice: 850000,
    averagePrice: 612000,
    rating: 4.6,
    reviewCount: 8932,
    history: generateHistory(549000, 459000, 850000, 2004),
    stores: [
      { name: 'Shopee', price: 549000, inStock: true },
      { name: 'Lazada', price: 589000, inStock: true },
      { name: 'Tiki', price: 599000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang thấp hơn 11% so với trung bình. Flash sale cuối tuần.',
    description: 'Bộ 9 hộp thủy tinh chịu nhiệt, nắp kín khóa 4 cạnh, an toàn lò vi sóng.',
    matchKeywords: ['locklock', 'lock & lock', 'hop', 'hop thuy tinh', 'hop do an'],
    discountPct: 35,
    soldCount: 24532,
  },
  {
    id: 'p_samsung_fridge',
    slug: 'samsung-fridge-360l',
    name: 'Tủ lạnh Samsung Inverter 360L',
    brand: 'Samsung',
    category: 'nha-cua-doi-song',
    image: '🧊',
    imageUrl: img('1571175443880-49e1d25b2bc5'),
    gradient: g('#eceff1', '#cfd8dc'),
    currentPrice: 12990000,
    originalPrice: 16990000,
    lowestPrice: 11490000,
    highestPrice: 16990000,
    averagePrice: 13820000,
    rating: 4.7,
    reviewCount: 723,
    history: generateHistory(12990000, 11490000, 16990000, 2005),
    stores: [
      { name: 'Shopee', price: 12990000, inStock: true },
      { name: 'Lazada', price: 13490000, inStock: true },
      { name: 'Tiki', price: 13290000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason: 'Giá hiện tại thấp hơn TB 6%. Sale cuối năm có thể giảm thêm 8%.',
    description: 'Tủ lạnh ngăn đá trên, công nghệ Digital Inverter tiết kiệm điện.',
    matchKeywords: ['samsung', 'tu lanh', 'tu lanh samsung', 'samsung tu lanh', 'inverter'],
    discountPct: 24,
    soldCount: 234,
  },

  // ─── THỜI TRANG NỮ ───
  {
    id: 'p_dress_evening',
    slug: 'dam-du-tiec-nu',
    name: 'Đầm nữ dự tiệc dáng ôm',
    brand: 'Ivy Moda',
    category: 'thoi-trang-nu',
    image: '👗',
    imageUrl: img('1572804013309-59a88b7e92f1'),
    gradient: g('#fce4ec', '#f8bbd0'),
    currentPrice: 1290000,
    originalPrice: 1890000,
    lowestPrice: 990000,
    highestPrice: 1890000,
    averagePrice: 1380000,
    rating: 4.6,
    reviewCount: 1832,
    history: generateHistory(1290000, 990000, 1890000, 3001),
    stores: [
      { name: 'Shopee', price: 1290000, inStock: true },
      { name: 'Lazada', price: 1390000, inStock: true },
      { name: 'TikTok Shop', price: 1190000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang ở mức thấp. TikTok Shop flash sale chỉ còn 24h.',
    description: 'Đầm dáng ôm bodycon, vải thun cao cấp, phù hợp tiệc & dạo phố.',
    matchKeywords: ['dam', 'dam nu', 'dam du tiet', 'ivy moda', 'dam body', 'vay'],
    discountPct: 32,
    soldCount: 4521,
  },
  {
    id: 'p_coat_winter',
    slug: 'ao-khoac-nu-da',
    name: 'Áo khoác nữ dạ dáng dài',
    brand: 'Hạnh Phúc',
    category: 'thoi-trang-nu',
    image: '🧥',
    imageUrl: img('1539109136881-3be0616acf4b'),
    gradient: g('#efebe9', '#d7ccc8'),
    currentPrice: 2490000,
    originalPrice: 3490000,
    lowestPrice: 1990000,
    highestPrice: 3490000,
    averagePrice: 2680000,
    rating: 4.7,
    reviewCount: 1245,
    history: generateHistory(2490000, 1990000, 3490000, 3002),
    stores: [
      { name: 'Shopee', price: 2490000, inStock: true },
      { name: 'Lazada', price: 2590000, inStock: true },
    ],
    recommendation: 'gia-ao',
    reason: 'CẢNH BÁO: Giá tăng 22% trong 7 ngày gần đây. Đang cao hơn TB 16%. ĐỢI.',
    description: 'Áo khoác nữ dạ dáng dài Hàn Quốc, lót lụa, có dây thắt eo.',
    matchKeywords: ['ao khoac', 'ao khoac nu', 'ao da', 'chanel', 'hanh phuc'],
    discountPct: 29,
    soldCount: 1234,
  },
  {
    id: 'p_bag_leather',
    slug: 'tui-xach-nu-da',
    name: 'Túi xách nữ da PU cao cấp',
    brand: 'Pedro',
    category: 'thoi-trang-nu',
    image: '👜',
    imageUrl: img('1584917865442-de89df76afd3'),
    gradient: g('#fff8e1', '#ffecb3'),
    currentPrice: 890000,
    originalPrice: 1290000,
    lowestPrice: 749000,
    highestPrice: 1290000,
    averagePrice: 952000,
    rating: 4.5,
    reviewCount: 3214,
    history: generateHistory(890000, 749000, 1290000, 3003),
    stores: [
      { name: 'Shopee', price: 890000, inStock: true },
      { name: 'Lazada', price: 950000, inStock: true },
      { name: 'Tiki', price: 920000, inStock: true },
      { name: 'TikTok Shop', price: 850000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang thấp hơn TB 7%. Đang có mã freeship toàn quốc.',
    description: 'Túi xách nữ da PU chống nước, 3 ngăn, dây xích vàng.',
    matchKeywords: ['tui', 'tui xach', 'tui xach nu', 'pedro', 'tui da', 'tui nu'],
    discountPct: 31,
    soldCount: 7832,
  },
  {
    id: 'p_sandal_nu',
    slug: 'sandal-nu-dep',
    name: 'Sandal nữ đế bệt quai ngang',
    brand: 'Bitis',
    category: 'thoi-trang-nu',
    image: '👡',
    imageUrl: img('1543163521-1bf539c55dd2'),
    gradient: g('#f3e5f5', '#e1bee7'),
    currentPrice: 459000,
    originalPrice: 690000,
    lowestPrice: 389000,
    highestPrice: 690000,
    averagePrice: 489000,
    rating: 4.4,
    reviewCount: 4567,
    history: generateHistory(459000, 389000, 690000, 3004),
    stores: [
      { name: 'Shopee', price: 459000, inStock: true },
      { name: 'Lazada', price: 489000, inStock: true },
      { name: 'TikTok Shop', price: 449000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá thấp nhất 30 ngày qua. Bitis đang sale chính hãng.',
    description: 'Sandal nữ đế bệt EVA nhẹ, quai ngang da PU, chống trơn trượt.',
    matchKeywords: ['sandal', 'sandal nu', 'bitis', 'dep', 'giay', 'giay nu'],
    discountPct: 33,
    soldCount: 9821,
  },
  {
    id: 'p_jeans_nu',
    slug: 'quan-jean-nu',
    name: 'Quần jean nữ ống rộng lưng cao',
    brand: 'Local Brand',
    category: 'thoi-trang-nu',
    image: '👖',
    imageUrl: img('1542272604-787c3835535d'),
    gradient: g('#e3f2fd', '#bbdefb'),
    currentPrice: 449000,
    originalPrice: 690000,
    lowestPrice: 369000,
    highestPrice: 690000,
    averagePrice: 482000,
    rating: 4.5,
    reviewCount: 2876,
    history: generateHistory(449000, 369000, 690000, 3005),
    stores: [
      { name: 'Shopee', price: 449000, inStock: true },
      { name: 'Lazada', price: 489000, inStock: true },
      { name: 'TikTok Shop', price: 429000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason: 'Giá ổn định, sale cuối mùa có thể giảm thêm 10%.',
    description: 'Quần jean nữ ống rộng, lưng cao, vải denim co giãn, basic mọi dáng.',
    matchKeywords: ['jean', 'quan jean', 'quan', 'jeans', 'denim', 'quan nu'],
    discountPct: 35,
    soldCount: 6234,
  },
  {
    id: 'p_yellow_dress',
    slug: 'dam-cong-so-nu',
    name: 'Đầm công sở nữ dáng chữ A',
    brand: 'Elise',
    category: 'thoi-trang-nu',
    image: '👗',
    imageUrl: img('1496747611176-843222e1e57c'),
    gradient: g('#fff3e0', '#ffe0b2'),
    currentPrice: 690000,
    originalPrice: 990000,
    lowestPrice: 590000,
    highestPrice: 990000,
    averagePrice: 738000,
    rating: 4.6,
    reviewCount: 1567,
    history: generateHistory(690000, 590000, 990000, 3006),
    stores: [
      { name: 'Shopee', price: 690000, inStock: true },
      { name: 'Tiki', price: 720000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá thấp hơn TB 7%. Đang có deal kèm thắt lưng.',
    description: 'Đầm công sở dáng chữ A, vải lụa Hàn, phù hợp môi trường văn phòng.',
    matchKeywords: ['dam cong so', 'dam', 'elise', 'van phong', 'cong so'],
    discountPct: 30,
    soldCount: 2341,
  },

  // ─── THỜI TRANG NAM ───
  {
    id: 'p_ao_polo_nam',
    slug: 'ao-thun-polo-nam',
    name: 'Áo Thun Polo Nam Cổ Đức Thêu Chữ',
    brand: 'Generic',
    category: 'thoi-trang-nam',
    image: '👕',
    imageUrl: img('1516762689617-a1f35b93033c'),
    gradient: g('#e8f5e9', '#c8e6c9'),
    currentPrice: 259000,
    originalPrice: 450000,
    lowestPrice: 199000,
    highestPrice: 450000,
    averagePrice: 315000,
    rating: 4.3,
    reviewCount: 4523,
    history: generateHistory(259000, 199000, 450000, 4001),
    stores: [
      { name: 'Shopee', price: 259000, inStock: true },
      { name: 'Lazada', price: 279000, inStock: true },
      { name: 'TikTok Shop', price: 239000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang ở mức thấp. Flash sale cuối tuần trên TikTok Shop.',
    description: 'Áo thun polo nam cổ đức, chất vải cotton thoáng mát, thêu chữ tinh tế.',
    matchKeywords: ['ao polo', 'polo nam', 'ao thun polo', 'ao polo', 'polo', 'thun polo'],
    discountPct: 42,
    soldCount: 12453,
  },
  {
    id: 'p_quan_shorts_nam',
    slug: 'quan-shorts-nam',
    name: 'Quần Shorts Nam Dáng Jogger Thun',
    brand: 'Generic',
    category: 'thoi-trang-nam',
    image: '🩳',
    imageUrl: img('1519340333757-3be7d19de9b5'),
    gradient: g('#e3f2fd', '#bbdefb'),
    currentPrice: 189000,
    originalPrice: 320000,
    lowestPrice: 149000,
    highestPrice: 320000,
    averagePrice: 228000,
    rating: 4.4,
    reviewCount: 3211,
    history: generateHistory(189000, 149000, 320000, 4002),
    stores: [
      { name: 'Shopee', price: 189000, inStock: true },
      { name: 'Lazada', price: 199000, inStock: true },
      { name: 'TikTok Shop', price: 179000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá thấp nhất trong 30 ngày. Đang có mã giảm 20k.',
    description: 'Quần shorts nam dáng jogger, chất thun co giãn, 2 túi hông, phong cách streetwear.',
    matchKeywords: ['shorts', 'quan shorts', 'shorts nam', 'quan cu', 'jogger'],
    discountPct: 41,
    soldCount: 8932,
  },
  {
    id: 'p_giay_sneaker_nam',
    slug: 'giay-sneaker-nam',
    name: 'Giày Sneaker Nam Đế Cao Độn Chiều Cao',
    brand: 'Anta',
    category: 'thoi-trang-nam',
    image: '👟',
    imageUrl: img('1542291026-7eec264c27ff'),
    gradient: g('#fce4ec', '#f8bbd0'),
    currentPrice: 599000,
    originalPrice: 990000,
    lowestPrice: 499000,
    highestPrice: 990000,
    averagePrice: 695000,
    rating: 4.5,
    reviewCount: 2156,
    history: generateHistory(599000, 499000, 990000, 4003),
    stores: [
      { name: 'Shopee', price: 599000, inStock: true },
      { name: 'Lazada', price: 649000, inStock: true },
      { name: 'TikTok Shop', price: 569000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason: 'Giá ổn định. Sale 9/9 sắp tới có thể giảm thêm 10-15%.',
    description: 'Giày sneaker nam đế cao độn chiều cao 4cm, da PU, đế EVA nhẹ 250g.',
    matchKeywords: ['giay', 'sneaker', 'giay sneaker', 'giay nam', 'anta', 'giay the thao'],
    discountPct: 39,
    soldCount: 5621,
  },
  {
    id: 'p_ao_hoodie_nam',
    slug: 'ao-hoodie-nam',
    name: 'Áo Hoodie Nam Nỉ Bông Form Rộng',
    brand: 'Generic',
    category: 'thoi-trang-nam',
    image: '🧥',
    imageUrl: img('1556821840-3a9c2f2e47b2'),
    gradient: g('#ede7f6', '#d1c4e9'),
    currentPrice: 349000,
    originalPrice: 550000,
    lowestPrice: 279000,
    highestPrice: 550000,
    averagePrice: 398000,
    rating: 4.6,
    reviewCount: 1789,
    history: generateHistory(349000, 279000, 550000, 4004),
    stores: [
      { name: 'Shopee', price: 349000, inStock: true },
      { name: 'Lazada', price: 379000, inStock: true },
      { name: 'TikTok Shop', price: 329000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang thấp hơn TB 12%. Mùa đông sắp tới — nhu cầu tăng.',
    description: 'Áo hoodie nam nỉ bông form rộng, có mũ trùm, túi kangaroo phía trước.',
    matchKeywords: ['hoodie', 'ao hoodie', 'ao nu', 'aonam', 'nỉ bông'],
    discountPct: 37,
    soldCount: 4321,
  },
  {
    id: 'p_vay_nu_midi',
    slug: 'vay-nu-midi',
    name: 'Váy Nữ Midi Xếp Ly Dáng Ôm',
    brand: 'Elise',
    category: 'thoi-trang-nu',
    image: '👗',
    imageUrl: img('1558171813-1bec36c4b7e8a'),
    gradient: g('#fff8e1', '#ffecb3'),
    currentPrice: 590000,
    originalPrice: 890000,
    lowestPrice: 490000,
    highestPrice: 890000,
    averagePrice: 648000,
    rating: 4.5,
    reviewCount: 987,
    history: generateHistory(590000, 490000, 890000, 4005),
    stores: [
      { name: 'Shopee', price: 590000, inStock: true },
      { name: 'Lazada', price: 620000, inStock: true },
      { name: 'TikTok Shop', price: 559000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason: 'Giá ổn định. Sale cuối tháng có thể giảm thêm 8-10%.',
    description: 'Váy midi nữ xếp ly, dáng ôm body, vải lụa cao cấp, phù hợp đi làm & dạo phố.',
    matchKeywords: ['vay', 'vay midi', 'vay nu', 'vay xep ly', 'elise'],
    discountPct: 34,
    soldCount: 3214,
  },
];

// =====================================================================
// Mock product generator — tạo sản phẩm ước tính từ tên/kind
// Dùng khi không có trong catalog để vẫn hiển thị kết quả phân tích
// =====================================================================

/** Detect category từ tên sản phẩm (thứ tự quan trọng — check specific trước, generic sau) */
function guessCategory(name: string): string {
  // Split thành words trước để tránh false positive (vd "iPhone" chứa "áo")
  const words = name.toLowerCase().split(/\s+/);
  const has = (kw: string) => words.some(w => w.includes(kw) || kw.includes(w));
  const hasExact = (kw: string) => words.some(w => w === kw);

  // Thời trang NAM — check "áo" như word riêng trước "thời trang nữ"
  if (hasExact('áo') || hasExact('quần') || hasExact('váy') || hasExact('đầm') ||
      hasExact('shorts') || hasExact('sneaker') || hasExact('hoodie') || hasExact('polo') ||
      has('giày') || has('sandal') || has('bitis') || has('áo khoác')) {
    if (hasExact('nữ') || hasExact('nu') || hasExact('nư')) return 'thoi-trang-nu';
    return 'thoi-trang-nam';
  }
  // Thời trang nữ (generic — khi không xác định được)
  if (has('túi') || has('vay') || has('đầm')) return 'thoi-trang-nu';

  // Làm đẹp — keywords cụ thể
  if (hasExact('son') || has('serum') || has('kem') || has('lancome') ||
      has('skii') || has('3ce') || has('foreo') || has('phấn') || has('mỹ phẩm'))
    return 'lam-dep';
  // Điện tử / Nhà cửa — check trước thời trang
  if (has('iphone') || has('macbook') || has('laptop') || has('dell') ||
      has('samsung') || has('sony') || has('apple') || has('huawei') ||
      has('nồi') || has('bếp') || has('tủ lạnh') || has('máy lọc') ||
      has('philips') || has('dyson') || has('xiaomi') || has('lock') || has('tivi'))
    return 'nha-cua-doi-song';

  // Mặc định: thời trang nữ
  return 'thoi-trang-nu';
}

/** Estimate price range từ tên sản phẩm */
function guessPriceRange(name: string): { low: number; high: number } {
  const n = name.toLowerCase();
  if (/iphone|macbook|dyson|samsung|tủ|laptop/i.test(n)) return { low: 5000000, high: 30000000 };
  if (/foreo|skii|lancome|chanel/i.test(n)) return { low: 1000000, high: 8000000 };
  if (/son|serum|kem|tinh chất/i.test(n)) return { low: 150000, high: 2000000 };
  if (/nồi|máy hút|máy lọc|bếp/i.test(n)) return { low: 500000, high: 5000000 };
  if (/áo khoác|đầm|vest/i.test(n)) return { low: 500000, high: 5000000 };
  if (/áo|quần|váy|đầm|túi|giày/i.test(n)) return { low: 100000, high: 2000000 };
  if (/hoodie|sweater/i.test(n)) return { low: 200000, high: 800000 };
  return { low: 100000, high: 2000000 };
}

/** Tạo ID từ tên sản phẩm */
function nameToId(name: string): string {
  return 'mock_' + name.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 40);
}

/** Seeded hash từ string */
function strHash(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i);
  return Math.abs(h);
}

const GRADIENT_BY_CATEGORY: Record<string, [string, string]> = {
  'lam-dep': ['#fce4ec', '#f8bbd0'],
  'nha-cua-doi-song': ['#e0f7fa', '#b2ebf2'],
  'thoi-trang-nu': ['#f3e5f5', '#e1bee7'],
  'thoi-trang-nam': ['#e8f5e9', '#c8e6c9'],
};

const EMOJI_BY_CATEGORY: Record<string, string> = {
  'lam-dep': '💄',
  'nha-cua-doi-song': '🏠',
  'thoi-trang-nu': '👗',
  'thoi-trang-nam': '👕',
};

/** Tạo mock ProductRecord từ tên sản phẩm */
export function generateMockProduct(name: string, platform: string = 'Shopee'): ProductRecord {
  const category = guessCategory(name) as ProductRecord['category'];
  const priceRange = guessPriceRange(name);
  const basePrice = Math.round((priceRange.low + priceRange.high) / 2);
  const lowestPrice = priceRange.low;
  const highestPrice = priceRange.high;
  const averagePrice = Math.round(basePrice * 1.05);
  const seed = strHash(name);
  const id = nameToId(name);
  const slug = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '-').slice(0, 50);

  return {
    id,
    slug,
    name: name.charAt(0).toUpperCase() + name.slice(1),
    brand: 'Shopee',
    category,
    image: EMOJI_BY_CATEGORY[category] ?? '📦',
    imageUrl: '',
    gradient: GRADIENT_BY_CATEGORY[category] ?? ['#f5f5f5', '#e0e0e0'],
    currentPrice: basePrice,
    originalPrice: Math.round(basePrice * 1.4),
    lowestPrice,
    highestPrice,
    averagePrice,
    rating: 4.0 + (strHash(name + 'r') % 10) / 10,
    reviewCount: 100 + (strHash(name + 'c') % 5000),
    history: generateHistory(basePrice, lowestPrice, highestPrice, seed),
    stores: [
      { name: 'Shopee', price: basePrice, inStock: true },
      { name: 'Lazada', price: Math.round(basePrice * 1.05), inStock: true },
      { name: 'Tiki', price: Math.round(basePrice * 1.1), inStock: true },
      { name: 'TikTok Shop', price: Math.round(basePrice * 0.97), inStock: true },
    ],
    recommendation: 'doi-them',
    reason: 'Dữ liệu ước tính từ tên sản phẩm. Giá thực tế cần kiểm tra trên sàn.',
    description: `Sản phẩm phổ biến trên ${platform}. Kiểm tra kỹ giá trước khi mua.`,
    matchKeywords: name.toLowerCase().split(' ').filter(w => w.length >= 3),
    discountPct: Math.round((1 - basePrice / (basePrice * 1.4)) * 100),
    soldCount: 500 + (strHash(name + 's') % 10000),
  };
}

// =====================================================================
// Helper APIs (deterministic từ slug)
// =====================================================================

/** Lấy product theo slug chính xác */
export function getProductBySlug(slug: string): ProductRecord | null {
  const normalized = slug.toLowerCase().trim();
  return CATALOG.find((p) => p.slug === normalized) ?? null;
}

/**
 * Tìm sản phẩm bằng fuzzy match — ưu tiên:
 * 1. Tên chính xác (case-insensitive)
 * 2. Keyword match (mỗi từ trong input match với ít nhất 1 keyword)
 * 3. Partial name match (input chứa ít nhất 50% ký tự của tên sản phẩm)
 * 4. Slug match
 */
export function findProductByKeyword(text: string): ProductRecord | null {
  const normalized = text.toLowerCase().trim().replace(/\s+/g, ' ');
  if (!normalized) return null;

  // Split input thành words (lọc bỏ stop words + số ngắn)
  const STOP_WORDS = new Set([
    'the', 'a', 'an', 'is', 'of', 'for', 'to', 'with', 'on', 'in', 'at',
    'mua', 'ban', 'o', 'mới', 'cũ', 'giá', 'bao', 'nhieu', 're', 'dat',
  ]);
  const words = normalized
    .split(' ')
    .filter((w) => w.length >= 3 && !STOP_WORDS.has(w));

  if (words.length === 0) return null;

  // Score candidates
  const candidates = CATALOG.map((p) => {
    const pName = p.name.toLowerCase();
    const pSlug = p.slug.toLowerCase();
    const pBrand = p.brand.toLowerCase();

    let score = 0;
    const matchedWords = new Set<string>();

    for (const word of words) {
      let wordMatched = false;

      // Check matchKeywords
      // Minimum length 2: để match "đầm"→"dam", "áo"→"áo" (từ tiếng Việt phổ biến)
      for (const kw of p.matchKeywords) {
        if (kw.length < 2) continue;
        // Exact match (preferred)
        if (word === kw) {
          score += kw.length * 3;
          wordMatched = true;
          break;
        }
        // Word chứa keyword hoặc keyword chứa word — khi cả hai đủ dài
        if (word.length >= 4 && kw.length >= 4) {
          if (word.includes(kw)) {
            score += kw.length * 2;
            wordMatched = true;
            break;
          }
          if (kw.includes(word)) {
            // Chỉ count nếu keyword dài hơn word nhiều
            if (kw.length >= word.length + 2) {
              score += word.length;
              wordMatched = true;
              break;
            }
          }
        }
        // Short but known: "dam" matches "đầm", "áo" matches "áo"
        // BUG FIX: chỉ match exact includes khi word length ratio OK — tránh "sony"/"son" false positive
        if (word.length >= 3 && kw.length >= 3) {
          if (word.includes(kw) || kw.includes(word)) {
            // Yêu cầu: length ratio không quá lệch (vd: "son" 3 ký tự không match "sony" 4 ký tự)
            const ratio = Math.max(word.length, kw.length) / Math.min(word.length, kw.length);
            if (ratio <= 1.5) {
              score += Math.min(word.length, kw.length);
              wordMatched = true;
              break;
            }
          }
        }
      }

      // Check brand name (whole word match)
      if (!wordMatched && pBrand.length >= 3) {
        if (word === pBrand || pBrand.includes(word) && pBrand.length <= word.length + 1) {
          score += 8;
          wordMatched = true;
        }
      }

      // Check product name (chỉ word dài >= 4 mới tính partial)
      if (!wordMatched && word.length >= 4) {
        if (pName.includes(word)) {
          score += 4;
          wordMatched = true;
        }
      }

      // Check slug (word dài >= 5)
      if (!wordMatched && word.length >= 5) {
        if (pSlug.includes(word) || pSlug.includes(word.replace(/\s/g, '-'))) {
          score += 3;
          wordMatched = true;
        }
      }

      if (wordMatched) matchedWords.add(word);
    }

    // Exact name match bonus
    if (pName.includes(normalized) || normalized.includes(pName)) {
      score += 30;
    }

    // Brand match bonus (single token)
    if (pBrand.includes(normalized) || normalized.includes(pBrand)) {
      score += 20;
    }

    // Brand phrase match bonus (khi brand có nhiều từ, vd "Ivy Moda")
    if (pBrand.includes(' ')) {
      const brandWords = pBrand.split(' ');
      const inputHasAllBrandWords = brandWords.every((bw) => normalized.includes(bw));
      if (inputHasAllBrandWords) {
        score += 25;
      }
    }

    return {
      product: p,
      score,
      matchRatio: matchedWords.size / words.length,
    };
  })
    .filter((c) => c.score > 0 && c.matchRatio >= 0.5)
    .sort((a, b) => b.score - a.score);

  return candidates[0]?.product ?? null;
}

/** Lấy sản phẩm theo category */
export function getProductsByCategory(category: string): ProductRecord[] {
  return CATALOG.filter((p) => p.category === category);
}