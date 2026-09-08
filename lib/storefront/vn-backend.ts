// =====================================================================
// VN StorefrontBackend — TypeScript port of commerce-agents-temp/backend_vn.py
//
// 18 Vietnamese products across 4 platforms (Shopee / Lazada / Tiki / TikTok Shop).
// All prices in VND. Module-level Map drives per-session cart storage.
//
// Source of truth: D:\Startup-BA\commerce-agents-temp\backend_vn.py
// =====================================================================

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

export type PlatformKey = 'shopee' | 'lazada' | 'tiki' | 'tiktok';

export interface StorePrices {
  shopee: number;
  lazada: number;
  tiki: number;
  tiktok: number;
}

export interface Product {
  product_id: string;
  title: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  currency: 'VND';
  rating: number | null;
  review_count: number | null;
  image_url: string | null;
  category: string | null;
  labels: string[];
  in_stock: boolean;
  short_description: string | null;
}

export interface ProductDetails extends Product {
  long_description: string | null;
  specs: Record<string, string>;
  options: Record<string, string[]>;
  store_prices: StorePrices;
}

export interface SearchFilters {
  min_price?: number;
  max_price?: number;
  category?: string;
}

export interface CartItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  image_url: string | null;
}

export interface Cart {
  items: CartItem[];
  currency: 'VND';
  subtotal: number;
  item_count: number;
}

export type OrderStatus = 'DELIVERED' | 'SHIPPED' | 'PROCESSING' | 'PLACED' | 'CANCELLED';

export interface OrderItem {
  product_id: string;
  title: string;
  quantity: number;
  price: number;
}

export interface Order {
  order_id: string;
  status: OrderStatus;
  placed_at: string; // ISO date
  items: OrderItem[];
  total: number;
  currency: 'VND';
  estimated_delivery: string;
  tracking_url: string;
}

export interface Policy {
  policy_id: string;
  title: string;
  category: string;
  content: string;
}

export interface DisclosureRow {
  label: string;
  value: string;
}

export interface Disclosure {
  title: string;
  product_id: string;
  rows: DisclosureRow[];
  sources: string[];
  footnotes: string[];
}

// Internal catalog entry (full record with extras)
interface CatalogEntry {
  product_id: string;
  title: string;
  brand: string | null;
  price: number;
  original_price: number | null;
  rating: number | null;
  review_count: number | null;
  image_url: string | null;
  category: string | null;
  labels: string[];
  in_stock: boolean;
  short_description: string | null;
  long_description: string | null;
  specs: Record<string, string>;
  options: Record<string, string[]>;
  store_prices: StorePrices;
}

// ---------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------

const VND = 'VND' as const;

const PLATFORM_DISPLAY: Record<PlatformKey, string> = {
  shopee: 'Shopee',
  lazada: 'Lazada',
  tiki: 'Tiki',
  tiktok: 'TikTok Shop',
};

// ---------------------------------------------------------------------
// Catalog — 18 Vietnamese products
// ---------------------------------------------------------------------

const CATALOG: CatalogEntry[] = [
  // ---- Điện thoại ----
  {
    product_id: 'iphone-15-128',
    title: 'iPhone 15 128GB - Chính hãng VN/A',
    brand: 'Apple',
    price: 21_990_000,
    original_price: 24_990_000,
    rating: 4.8,
    review_count: 2847,
    image_url: null,
    category: 'Điện thoại',
    labels: ['Apple', 'iPhone 15', 'Chính hãng'],
    in_stock: true,
    short_description: 'iPhone 15 màn hình Dynamic Island 6.1 inch, chip A16 Bionic, camera 48MP.',
    long_description:
      'iPhone 15 sở hữu màn hình Super Retina XDR 6.1 inch với Dynamic Island. Chip A16 Bionic cho hiệu năng vượt trội. Camera chính 48MP chụp ảnh sắc nét, quay video 4K HDR. Pin trâu, sạc USB-C nhanh.',
    specs: {
      'Màn hình': '6.1 inch Super Retina XDR',
      'Chip': 'A16 Bionic',
      'RAM': '6GB',
      'Bộ nhớ': '128GB',
      'Camera sau': '48MP + 12MP',
      'Camera trước': '12MP',
      'Pin': '3349 mAh',
      'Sạc': 'USB-C 20W',
    },
    options: {},
    store_prices: { shopee: 21_490_000, lazada: 22_190_000, tiki: 21_990_000, tiktok: 21_890_000 },
  },
  {
    product_id: 'iphone-15-pro-256',
    title: 'iPhone 15 Pro 256GB - Chính hãng VN/A',
    brand: 'Apple',
    price: 29_490_000,
    original_price: 34_990_000,
    rating: 4.9,
    review_count: 1523,
    image_url: null,
    category: 'Điện thoại',
    labels: ['Apple', 'iPhone 15 Pro', 'Titanium'],
    in_stock: true,
    short_description: 'iPhone 15 Pro khung titanium, chip A17 Pro, camera 48MP Pro.',
    long_description:
      'iPhone 15 Pro với khung titanium grade 5 siêu bền. Chip A17 Pro 3nm mạnh nhất. Màn hình ProMotion 120Hz. Camera 48MP Pro với nhiều tuỳ chọn zoom quang học.',
    specs: {
      'Màn hình': '6.1 inch Super Retina XDR 120Hz',
      'Chip': 'A17 Pro',
      'RAM': '8GB',
      'Bộ nhớ': '256GB',
      'Camera sau': '48MP + 12MP + 12MP',
      'Camera trước': '12MP',
      'Pin': '3274 mAh',
      'Sạc': 'USB-C 27W',
    },
    options: {},
    store_prices: { shopee: 28_990_000, lazada: 29_490_000, tiki: 29_290_000, tiktok: 29_190_000 },
  },
  {
    product_id: 'samsung-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra 256GB',
    brand: 'Samsung',
    price: 26_990_000,
    original_price: 32_990_000,
    rating: 4.7,
    review_count: 1892,
    image_url: null,
    category: 'Điện thoại',
    labels: ['Samsung', 'Galaxy S24 Ultra', 'Galaxy AI'],
    in_stock: true,
    short_description: 'Samsung Galaxy S24 Ultra Galaxy AI, bút S Pen, camera 200MP.',
    long_description:
      'Galaxy S24 Ultra tích hợp Galaxy AI giúp dịch thuật real-time, tìm kiếm thông minh. Bút S Pen tích hợp. Camera 200MP chụp ảnh siêu nét. Màn hình 6.8 inch Dynamic AMOLED 2X.',
    specs: {
      'Màn hình': '6.8 inch Dynamic AMOLED 2X 120Hz',
      'Chip': 'Snapdragon 8 Gen 3',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera sau': '200MP + 50MP + 12MP + 10MP',
      'Camera trước': '12MP',
      'Pin': '5000 mAh',
      'Sạc': 'USB-C 45W',
    },
    options: {},
    store_prices: { shopee: 26_490_000, lazada: 27_190_000, tiki: 26_990_000, tiktok: 26_790_000 },
  },
  {
    product_id: 'xiaomi-14t-pro',
    title: 'Xiaomi 14T Pro - Dimensity 9300+',
    brand: 'Xiaomi',
    price: 12_990_000,
    original_price: 15_990_000,
    rating: 4.6,
    review_count: 892,
    image_url: null,
    category: 'Điện thoại',
    labels: ['Xiaomi', 'Giá tốt', 'Camera Leica'],
    in_stock: true,
    short_description: 'Xiaomi 14T Pro chip Dimensity 9300+, camera Leica 50MP.',
    long_description:
      'Xiaomi 14T Pro hợp tác với Leica cho camera 50MP chụp ảnh chuyên nghiệp. Chip Dimensity 9300+ mạnh mẽ. Màn hình AMOLED 6.67 inch 144Hz. Pin 5000mAh sạc nhanh 120W.',
    specs: {
      'Màn hình': '6.67 inch AMOLED 144Hz',
      'Chip': 'Dimensity 9300+',
      'RAM': '12GB',
      'Bộ nhớ': '256GB',
      'Camera sau': '50MP Leica + 50MP + 12MP',
      'Camera trước': '32MP',
      'Pin': '5000 mAh',
      'Sạc': '120W HyperCharge',
    },
    options: {},
    store_prices: { shopee: 12_490_000, lazada: 12_990_000, tiki: 12_790_000, tiktok: 12_590_000 },
  },

  // ---- Laptop ----
  {
    product_id: 'macbook-air-m3-13',
    title: 'MacBook Air M3 13 inch 8GB/256GB',
    brand: 'Apple',
    price: 27_990_000,
    original_price: 31_990_000,
    rating: 4.9,
    review_count: 3241,
    image_url: null,
    category: 'Laptop',
    labels: ['Apple', 'MacBook Air', 'M3', 'Siêu mỏng'],
    in_stock: true,
    short_description: 'MacBook Air M3 13 inch — chip Apple M3, mỏng nhẹ, pin 18h.',
    long_description:
      'MacBook Air M3 với chip Apple M3 8-core GPU, tiết kiệm điện vượt trội. Màn hình Liquid Retina 13.6 inch sắc nét. Pin lên đến 18 giờ. Vỏ nhôm tái chế, siêu mỏng 1.13cm.',
    specs: {
      'Màn hình': '13.6 inch Liquid Retina',
      'Chip': 'Apple M3 8-core',
      'GPU': '8-core',
      'RAM': '8GB',
      'Bộ nhớ': '256GB SSD',
      'Pin': '52.6Wh (~18 giờ)',
      'Cổng': 'MagSafe 3, 2x Thunderbolt',
      'Trọng lượng': '1.24 kg',
    },
    options: {},
    store_prices: { shopee: 27_490_000, lazada: 27_990_000, tiki: 27_790_000, tiktok: 27_690_000 },
  },
  {
    product_id: 'dell-inspiron-15-3520',
    title: 'Dell Inspiron 15 3520 i5-1235U/8GB/512GB',
    brand: 'Dell',
    price: 15_490_000,
    original_price: 19_990_000,
    rating: 4.5,
    review_count: 1203,
    image_url: null,
    category: 'Laptop',
    labels: ['Dell', 'Inspiron', 'Văn phòng', 'Office'],
    in_stock: true,
    short_description: 'Laptop Dell Inspiron 15 văn phòng, chip Intel thế hệ 12.',
    long_description:
      'Dell Inspiron 15 3520 phù hợp văn phòng, học tập. Chip Intel Core i5-1235U thế hệ 12, RAM 8GB, SSD 512GB. Màn hình 15.6 inch FHD. Bàn phím số đầy đủ.',
    specs: {
      'Màn hình': '15.6 inch FHD IPS',
      'Chip': 'Intel Core i5-1235U',
      'RAM': '8GB DDR4',
      'Bộ nhớ': '512GB SSD',
      'Card đồ hoạ': 'Intel Iris Xe',
      'Pin': '54Wh',
      'Cổng': 'USB-C, 2x USB-A, HDMI, SD',
      'Trọng lượng': '1.9 kg',
    },
    options: {},
    store_prices: { shopee: 14_990_000, lazada: 15_490_000, tiki: 15_290_000, tiktok: 15_190_000 },
  },
  {
    product_id: 'asus-rog-strix-g16',
    title: 'ASUS ROG Strix G16 G614JZR i9/16GB/1TB RTX4070',
    brand: 'ASUS',
    price: 42_990_000,
    original_price: 54_990_000,
    rating: 4.7,
    review_count: 567,
    image_url: null,
    category: 'Laptop',
    labels: ['ASUS', 'ROG', 'Gaming', 'RTX 4070'],
    in_stock: true,
    short_description: 'Laptop gaming ASUS ROG Strix G16 — RTX 4070, chip i9 thế hệ 14.',
    long_description:
      'ROG Strix G16 gaming khủng với RTX 4070 8GB, chip Intel Core i9-14900HX. Màn hình 16 inch 165Hz G-Sync. Hệ thống tản nhiệt AAS giữ máy mát khi chơi game nặng. RGB per-key.',
    specs: {
      'Màn hình': '16 inch FHD 165Hz G-Sync',
      'Chip': 'Intel Core i9-14900HX',
      'RAM': '16GB DDR5',
      'Bộ nhớ': '1TB SSD',
      'Card đồ hoạ': 'NVIDIA RTX 4070 8GB',
      'Pin': '90Wh',
      'Tản nhiệt': 'ROG Intelligent Cooling',
      'Trọng lượng': '2.5 kg',
    },
    options: {},
    store_prices: { shopee: 41_990_000, lazada: 42_990_000, tiki: 42_490_000, tiktok: 42_790_000 },
  },

  // ---- Tai nghe ----
  {
    product_id: 'airpods-pro-2',
    title: 'AirPods Pro 2 USB-C - Chính hãng',
    brand: 'Apple',
    price: 6_490_000,
    original_price: 7_990_000,
    rating: 4.8,
    review_count: 4521,
    image_url: null,
    category: 'Tai nghe',
    labels: ['Apple', 'AirPods Pro', 'Chống ồn', 'USB-C'],
    in_stock: true,
    short_description: 'AirPods Pro 2 với USB-C, chống ồn chủ động, spatial audio.',
    long_description:
      'AirPods Pro 2 USB-C với chip H2 cho chất lượng âm thanh vượt trội. Chống ồn chủ động gấp 2 lần thế hệ trước. Chế độ Adaptive Audio. Spatial Audio cá nhân hoá. Pin 6h, hộp sạc 30h.',
    specs: {
      'Chip': 'Apple H2',
      'Chống ồn': 'Active Noise Cancellation',
      'Chế độ': 'Transparency, Adaptive',
      'Pin tai nghe': '6 giờ',
      'Pin hộp sạc': '30 giờ',
      'Kết nối': 'Bluetooth 5.3',
      'Sạc': 'USB-C, MagSafe, Qi',
      'Chống nước': 'IPX4',
    },
    options: {},
    store_prices: { shopee: 6_190_000, lazada: 6_490_000, tiki: 6_390_000, tiktok: 6_290_000 },
  },
  {
    product_id: 'sony-wh-1000xm5',
    title: 'Sony WH-1000XM5 - Tai nghe chống ồn',
    brand: 'Sony',
    price: 7_990_000,
    original_price: 10_990_000,
    rating: 4.8,
    review_count: 2103,
    image_url: null,
    category: 'Tai nghe',
    labels: ['Sony', '1000X', 'Chống ồn', 'Over-ear'],
    in_stock: true,
    short_description: 'Sony WH-1000XM5 — tai nghe over-ear chống ồn tốt nhất.',
    long_description:
      'Sony WH-1000XM5 với driver 30mm thiết kế mới, chống ồn vượt trội. 8 micro giảm tiếng ồn. LDAC cho âm thanh Hi-Res. Pin 30h. Trọng lượng chỉ 250g.',
    specs: {
      'Driver': '30mm',
      'Chống ồn': 'Auto NC Optimizer',
      'Pin': '30 giờ (NC on)',
      'Sạc': 'USB-C (3.5 giờ sạc đầy)',
      'Kết nối': 'Bluetooth 5.2, LDAC, AAC',
      'Trọng lượng': '250g',
      'Micro': '4 beamforming + 1 feedback',
      'Tính năng': 'Speak-to-Chat, Multipoint',
    },
    options: {},
    store_prices: { shopee: 7_490_000, lazada: 7_990_000, tiki: 7_790_000, tiktok: 7_590_000 },
  },

  // ---- Máy tính bảng ----
  {
    product_id: 'ipad-pro-m4-11',
    title: 'iPad Pro 11 inch M4 256GB - WiFi',
    brand: 'Apple',
    price: 24_990_000,
    original_price: 28_990_000,
    rating: 4.9,
    review_count: 1087,
    image_url: null,
    category: 'Máy tính bảng',
    labels: ['Apple', 'iPad Pro', 'M4', 'OLED'],
    in_stock: true,
    short_description: 'iPad Pro M4 11 inch — chip M4, OLED Ultra Retina XDR.',
    long_description:
      'iPad Pro M4 11 inch với chip M4 10-core GPU cho hiệu năng vượt trội. Màn hình Ultra Retina XDR OLED. Apple Pencil Pro, Magic Keyboard tương thích. WiFi 6E, kết nối nhanh.',
    specs: {
      'Màn hình': '11 inch Ultra Retina XDR OLED',
      'Chip': 'Apple M4',
      'RAM': '8GB',
      'Bộ nhớ': '256GB',
      'Camera sau': '12MP + 10MP',
      'Camera trước': '12MP Ultra Wide',
      'Pin': '~10 giờ',
      'Cổng': 'Thunderbolt / USB 4',
    },
    options: {},
    store_prices: { shopee: 24_490_000, lazada: 24_990_000, tiki: 24_790_000, tiktok: 24_690_000 },
  },
  {
    product_id: 'samsung-tab-s9-fe',
    title: 'Samsung Galaxy Tab S9 FE 128GB',
    brand: 'Samsung',
    price: 9_490_000,
    original_price: 12_990_000,
    rating: 4.6,
    review_count: 743,
    image_url: null,
    category: 'Máy tính bảng',
    labels: ['Samsung', 'Galaxy Tab', 'Galaxy Tab S9'],
    in_stock: true,
    short_description: 'Samsung Galaxy Tab S9 FE — tablet Android tầm trung, S Pen.',
    long_description:
      'Galaxy Tab S9 FE màn hình 10.9 inch IPS LCD sắc nét. Chip Exynos 1380. S Pen đi kèm viết vẽ thoải mái. Pin 8000mAh, sạc nhanh 45W. Chuẩn IP68.',
    specs: {
      'Màn hình': '10.9 inch TFT LCD',
      'Chip': 'Exynos 1380',
      'RAM': '6GB',
      'Bộ nhớ': '128GB',
      'Camera sau': '8MP',
      'Camera trước': '12MP',
      'Pin': '8000 mAh',
      'S Pen': 'Có (trong hộp)',
    },
    options: {},
    store_prices: { shopee: 9_190_000, lazada: 9_490_000, tiki: 9_390_000, tiktok: 9_290_000 },
  },

  // ---- Đồng hồ thông minh ----
  {
    product_id: 'apple-watch-s9-45',
    title: 'Apple Watch Series 9 45mm GPS - Midnight',
    brand: 'Apple',
    price: 10_990_000,
    original_price: 13_990_000,
    rating: 4.8,
    review_count: 3210,
    image_url: null,
    category: 'Đồng hồ thông minh',
    labels: ['Apple', 'Apple Watch', 'Series 9', 'Health'],
    in_stock: true,
    short_description: 'Apple Watch Series 9 — chip S9, màn hình Always-On Retina.',
    long_description:
      'Apple Watch Series 9 với chip S9 SiP cho hiệu năng nhanh hơn. Màn hình Always-On Retina 45mm sáng hơn. Cảm biến sức khoẻ: nhịp tim, SpO2, ECG. Định vị chính xác Double Tap.',
    specs: {
      'Màn hình': '45mm Always-On Retina',
      'Chip': 'Apple S9 SiP',
      'Chống nước': '50m WR',
      'Pin': '~18 giờ',
      'GPS': 'Có',
      'Cảm biến': 'Nhịp tim, SpO2, ECG',
      'Sạc': 'Magnetic sạc nhanh',
    },
    options: {},
    store_prices: { shopee: 10_490_000, lazada: 10_990_000, tiki: 10_790_000, tiktok: 10_690_000 },
  },
  {
    product_id: 'galaxy-watch-6-44',
    title: 'Samsung Galaxy Watch 6 44mm',
    brand: 'Samsung',
    price: 6_990_000,
    original_price: 9_990_000,
    rating: 4.5,
    review_count: 1456,
    image_url: null,
    category: 'Đồng hồ thông minh',
    labels: ['Samsung', 'Galaxy Watch 6', 'WearOS'],
    in_stock: true,
    short_description: 'Samsung Galaxy Watch 6 — WearOS, theo dõi sức khoẻ toàn diện.',
    long_description:
      'Galaxy Watch 6 chạy WearOS by Google. Màn hình Super AMOLED 44mm cong tràn viền. Đo nhịp tim, SpO2, BMI, áp suất. Theo dõi giấc ngủ. Tích hợp Bixby.',
    specs: {
      'Màn hình': '44mm Super AMOLED',
      'Chip': 'Exynos W930',
      'RAM': '2GB',
      'Bộ nhớ': '16GB',
      'Pin': '425mAh (~40 giờ)',
      'Hệ điều hành': 'WearOS 4',
      'Chống nước': '5ATM + IP68',
      'GPS': 'Có',
    },
    options: {},
    store_prices: { shopee: 6_690_000, lazada: 6_990_000, tiki: 6_890_000, tiktok: 6_790_000 },
  },

  // ---- Phụ kiện ----
  {
    product_id: 'anker-737-charger',
    title: 'Anker 737 GaNPrime 120W - Sạc nhanh 3 cổng',
    brand: 'Anker',
    price: 1_990_000,
    original_price: 2_990_000,
    rating: 4.7,
    review_count: 2341,
    image_url: null,
    category: 'Phụ kiện',
    labels: ['Anker', 'GaN', 'Sạc nhanh', '120W'],
    in_stock: true,
    short_description: 'Anker GaNPrime 120W sạc nhanh 3 thiết bị cùng lúc.',
    long_description:
      'Anker 737 GaNPrime 120W dùng công nghệ GaN tiết kiệm năng lượng, nhỏ gọn. 3 cổng: 2 USB-C PD 100W + 1 USB-A 22.5W. Sạc laptop, điện thoại, tablet cùng lúc. AI Power sмарт điều chỉnh dòng.',
    specs: {
      'Công suất': '120W',
      'Cổng': '2x USB-C PD + 1x USB-A',
      'Công nghệ': 'GaN III, AI Power',
      'Kích thước': '80 x 80 x 35 mm',
      'Trọng lượng': '250g',
      'Bảo vệ': 'Over-voltage, Over-temperature',
    },
    options: {},
    store_prices: { shopee: 1_790_000, lazada: 1_990_000, tiki: 1_890_000, tiktok: 1_690_000 },
  },
  {
    product_id: 'logitech-mx-master-3s',
    title: 'Logitech MX Master 3S - Chuột không dây',
    brand: 'Logitech',
    price: 3_490_000,
    original_price: 4_490_000,
    rating: 4.8,
    review_count: 3872,
    image_url: null,
    category: 'Phụ kiện',
    labels: ['Logitech', 'MX Master', 'Chuột cao cấp', 'Ergonomic'],
    in_stock: true,
    short_description: 'Logitech MX Master 3S — chuột ergonomic cao cấp, im lặng.',
    long_description:
      'MX Master 3S với cảm biến 8000 DPI chính xác. Cuộn MagSpeed siêu nhanh. Clic không tiếng động. Kết nối 3 thiết bị Easy-Switch. Tương thích macOS, Windows, Linux.',
    specs: {
      'Cảm biến': '8000 DPI',
      'Nút': '7 nút có thể tuỳ chỉnh',
      'Kết nối': 'Bluetooth + USB Receiver',
      'Pin': '70 ngày (sạc USB-C)',
      'Tương thích': 'Windows, macOS, Linux',
      'Trọng lượng': '141g',
    },
    options: {},
    store_prices: { shopee: 3_290_000, lazada: 3_490_000, tiki: 3_390_000, tiktok: 3_290_000 },
  },
  {
    product_id: 'sandisk-1tb-ssd',
    title: 'SanDisk Extreme Pro 1TB SSD - Đọc 2000MB/s',
    brand: 'SanDisk',
    price: 2_490_000,
    original_price: 3_990_000,
    rating: 4.7,
    review_count: 1893,
    image_url: null,
    category: 'Ổ cứng',
    labels: ['SanDisk', 'SSD', 'NVMe', '1TB'],
    in_stock: true,
    short_description: 'SanDisk Extreme Pro 1TB — SSD NVMe di động, tốc độ 2000MB/s.',
    long_description:
      'SanDisk Extreme Pro Portable SSD 1TB với tốc độ đọc 2000MB/s, ghi 2000MB/s qua USB 3.2 Gen 2. Chống nước, chống bụi IP55. Mã hoá AES 256-bit. Nhỏ gọn bỏ túi.',
    specs: {
      'Dung lượng': '1TB',
      'Đọc': '2000 MB/s',
      'Ghi': '2000 MB/s',
      'Kết nối': 'USB-C 3.2 Gen 2',
      'Bảo vệ': 'IP55, Mã hoá AES-256',
      'Trọng lượng': '76g',
      'Kích thước': '110 x 57 x 10 mm',
    },
    options: {},
    store_prices: { shopee: 2_290_000, lazada: 2_490_000, tiki: 2_390_000, tiktok: 2_290_000 },
  },

  // ---- Thời trang ----
  {
    product_id: 'ao-thun-uniqlo-ut',
    title: 'Uniqlo UT Anime T-Shirt - Size M-XXL',
    brand: 'Uniqlo',
    price: 199_000,
    original_price: 299_000,
    rating: 4.6,
    review_count: 8921,
    image_url: null,
    category: 'Thời trang',
    labels: ['Uniqlo', 'UT', 'T-Shirt', 'Anime'],
    in_stock: true,
    short_description: 'Uniqlo UT in hình anime — chất vải cotton 100%, mềm mại.',
    long_description:
      'Áo thun Uniqlo UT in hình anime chất liệu 100% cotton mềm mại, thoáng mát. Form regular fit phù hợp mọi người. Size từ M đến XXL. Nhiều mẫu anime hot.',
    specs: {
      'Chất liệu': '100% Cotton',
      'Form': 'Regular Fit',
      'Size': 'M, L, XL, XXL',
      'Cổ áo': 'Tròn',
      'Xuất xứ': 'Made in Vietnam',
    },
    options: {},
    store_prices: { shopee: 179_000, lazada: 199_000, tiki: 189_000, tiktok: 169_000 },
  },

  // ---- Sách ----
  {
    product_id: 'sach-dac-nhanh-tam',
    title: 'Đắc Nhân Tâm - Dale Carnegie (Bìa Cứng)',
    brand: 'Nhã Nam',
    price: 89_000,
    original_price: 149_000,
    rating: 4.9,
    review_count: 12_453,
    image_url: null,
    category: 'Sách',
    labels: ['Sách', 'Kỹ năng sống', 'Bestseller'],
    in_stock: true,
    short_description: 'Đắc Nhân Tâm — Dale Carnegie, bìa cứng, bestseller thế giới.',
    long_description:
      'Đắc Nhân Tâm của Dale Carnegie là cuốn sách kỹ năng sống nổi tiếng nhất mọi thời đại. Phiên bản bìa cứng, giấy chất lượng cao. Dịch giả uy tín.',
    specs: {
      'Tác giả': 'Dale Carnegie',
      'Dịch giả': 'Trần Bảo Khoa',
      'Nhà xuất bản': 'Nhã Nam',
      'Số trang': '320',
      'Khổ': '14 x 20.5 cm',
      'Bìa': 'Cứng',
    },
    options: {},
    store_prices: { shopee: 79_000, lazada: 89_000, tiki: 85_000, tiktok: 75_000 },
  },
];

// ---------------------------------------------------------------------
// Search — keyword scoring with Vietnamese synonyms
// ---------------------------------------------------------------------

const SEARCH_WEIGHTS: Record<string, number> = {
  title: 3.0,
  brand: 2.0,
  category: 1.5,
  labels: 1.0,
  short_description: 0.5,
};

const SYNONYMS: Record<string, string[]> = {
  'điện thoại': ['smartphone', 'đtdđ', 'phone', 'dien thoai'],
  laptop: ['máy tính xách tay', 'notebook', 'macbook'],
  'tai nghe': ['headphone', 'earphone', 'buds', 'tai nghe không dây'],
  apple: ['iphone', 'ipad', 'macbook', 'airpods', 'apple watch'],
  samsung: ['galaxy', 's24', 'tab'],
  'máy tính bảng': ['tablet', 'ipad', 'galaxy tab'],
  'đồng hồ': ['smartwatch', 'watch', 'galaxy watch', 'apple watch'],
  'phụ kiện': ['accessory', 'charger', 'chuột', 'ssd'],
  'giá rẻ': ['bình dân', 'tầm trung', 'rẻ'],
  'cao cấp': ['premium', 'flagship', 'pro'],
  'chống ồn': ['anc', 'noise cancelling', 'khử ồn'],
};

function normalize(text: string): string {
  return text.toLowerCase().trim();
}

function expandTokens(tokens: string[]): string[] {
  const out = new Set(tokens.map((t) => t.toLowerCase()));
  for (const token of tokens) {
    const t = token.toLowerCase();
    for (const [, syns] of Object.entries(SYNONYMS)) {
      if (syns.includes(t) || t === Object.keys(SYNONYMS).find((k) => k === t)) {
        for (const s of syns) out.add(s);
      }
    }
    for (const [base, syns] of Object.entries(SYNONYMS)) {
      if (t === base) {
        for (const s of syns) out.add(s);
      }
    }
  }
  return [...out];
}

function scoreEntry(entry: CatalogEntry, tokens: string[]): number {
  const searchable = {
    title: entry.title.toLowerCase(),
    brand: (entry.brand ?? '').toLowerCase(),
    category: (entry.category ?? '').toLowerCase(),
    labels: entry.labels.map((l) => l.toLowerCase()).join(' '),
    short_description: (entry.short_description ?? '').toLowerCase(),
  };

  let s = 0;
  for (const token of tokens) {
    for (const [field, text] of Object.entries(searchable)) {
      if (text.includes(token)) {
        s += SEARCH_WEIGHTS[field] ?? 1.0;
      }
    }
  }
  return s;
}

// ---------------------------------------------------------------------
// Policies
// ---------------------------------------------------------------------

const POLICIES: Policy[] = [
  {
    policy_id: 'shipping',
    title: 'Chính sách vận chuyển',
    category: 'Vận chuyển',
    content:
      'Giao hàng toàn quốc từ 2-5 ngày làm việc. Miễn phí vận chuyển cho đơn hàng từ 0đ (tất cả các sản phẩm). Hỗ trợ giao hàng nhanh 1-2 ngày với phụ phí. Theo dõi đơn hàng real-time qua SMS và ứng dụng.',
  },
  {
    policy_id: 'return',
    title: 'Chính sách đổi trả 7 ngày',
    category: 'Đổi trả',
    content:
      'Đổi trả miễn phí trong 7 ngày nếu sản phẩm bị lỗi từ nhà sản xuất, không đúng mô tả, hoặc giao sai. Sản phẩm phải còn nguyên vẹn, chưa qua sử dụng, còn đầy đủ phụ kiện và hộp. Không áp dụng đổi trả với sản phẩm cá nhân hoá.',
  },
  {
    policy_id: 'warranty',
    title: 'Bảo hành chính hãng',
    category: 'Bảo hành',
    content:
      'Sản phẩm chính hãng được bảo hành theo chính sách của nhà sản xuất: Apple 12 tháng, Samsung 12 tháng, Sony 12 tháng, Xiaomi 12 tháng, Logitech 24 tháng. Bảo hành tại trung tâm bảo hành ủy quyền trên toàn quốc.',
  },
  {
    policy_id: 'payment',
    title: 'Phương thức thanh toán',
    category: 'Thanh toán',
    content:
      'Thanh toán COD (nhận hàng rồi trả tiền), chuyển khoản, thẻ tín dụng/ghi nợ quốc tế (Visa, Mastercard, JCB), ví điện tử (MoMo, ZaloPay, VNPay). Không phụ thu phí thanh toán.',
  },
  {
    policy_id: 'fake',
    title: 'Cam kết 100% chính hãng',
    category: 'Cam kết',
    content:
      'Cam kết 100% sản phẩm chính hãng từ nhà phân phối ủy quyền. Hoàn tiền gấp 10 lần nếu phát hiện hàng giả, hàng nhái. Hóa đơn VAT available cho doanh nghiệp.',
  },
];

// ---------------------------------------------------------------------
// Demo orders (kept identical to Python source)
// ---------------------------------------------------------------------

function makeDemoOrders(): Order[] {
  const now = Date.now();
  return [
    {
      order_id: 'DH001',
      status: 'DELIVERED',
      placed_at: new Date(now - 15 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { product_id: 'airpods-pro-2', title: 'AirPods Pro 2 USB-C', quantity: 1, price: 6_490_000 },
      ],
      total: 6_490_000,
      currency: 'VND',
      estimated_delivery: 'Đã giao',
      tracking_url: 'https://tracking.example/DH001',
    },
    {
      order_id: 'DH002',
      status: 'SHIPPED',
      placed_at: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      items: [
        { product_id: 'macbook-air-m3-13', title: 'MacBook Air M3 13 inch', quantity: 1, price: 27_990_000 },
      ],
      total: 27_990_000,
      currency: 'VND',
      estimated_delivery: 'Dự kiến 5 ngày',
      tracking_url: 'https://tracking.example/DH002',
    },
  ];
}

// ---------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------

function fmtPrice(price: number): string {
  if (price >= 1_000_000) {
    return `${(price / 1_000_000).toFixed(1)} triệu đ`;
  }
  if (price >= 1_000) {
    return `${Math.round(price / 1_000)}K đ`;
  }
  return `${Math.round(price)} đ`;
}

function productFromEntry(entry: CatalogEntry): Product {
  return {
    product_id: entry.product_id,
    title: entry.title,
    brand: entry.brand,
    price: entry.price,
    original_price: entry.original_price,
    currency: VND,
    rating: entry.rating,
    review_count: entry.review_count,
    image_url: entry.image_url,
    category: entry.category,
    labels: [...entry.labels],
    in_stock: entry.in_stock,
    short_description: entry.short_description,
  };
}

function detailFromEntry(entry: CatalogEntry): ProductDetails {
  return {
    ...productFromEntry(entry),
    long_description: entry.long_description,
    specs: { ...entry.specs },
    options: { ...(entry.options ?? {}) },
    store_prices: { ...entry.store_prices },
  };
}

function emptyCart(): Cart {
  return { items: [], currency: 'VND', subtotal: 0, item_count: 0 };
}

function recomputeCart(items: CartItem[]): Cart {
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const item_count = items.reduce((sum, i) => sum + i.quantity, 0);
  return { items: [...items], currency: 'VND', subtotal, item_count };
}

// ---------------------------------------------------------------------
// VNStorefrontBackend class
// ---------------------------------------------------------------------

export class VNStorefrontBackend {
  private products: Map<string, CatalogEntry>;
  private carts: Map<string, Map<string, CartItem>>;
  private orders: Map<string, Order>;

  constructor() {
    this.products = new Map(CATALOG.map((e) => [e.product_id, e]));
    this.carts = new Map();
    this.orders = new Map(makeDemoOrders().map((o) => [o.order_id, o]));
  }

  // ---- Catalog ----

  searchProducts(query: string, filters?: SearchFilters | null, limit = 8): Product[] {
    const q = normalize(query);
    const queryTokens = q.split(/\s+/).filter(Boolean);
    if (!queryTokens.length) return [];

    const tokens = expandTokens(queryTokens);

    const scored: Array<{ entry: CatalogEntry; score: number }> = [];
    for (const entry of this.products.values()) {
      const s = scoreEntry(entry, tokens);
      if (s > 0) scored.push({ entry, score: s });
    }
    scored.sort((a, b) => b.score - a.score);

    const results: Product[] = [];
    for (const { entry } of scored) {
      if (filters) {
        if (filters.min_price !== undefined && entry.price < filters.min_price) continue;
        if (filters.max_price !== undefined && entry.price > filters.max_price) continue;
        if (
          filters.category &&
          !(entry.category ?? '').toLowerCase().includes(filters.category.toLowerCase())
        )
          continue;
      }
      results.push(productFromEntry(entry));
      if (results.length >= limit) break;
    }
    return results;
  }

  getProduct(productId: string): ProductDetails | null {
    const entry = this.products.get(productId);
    return entry ? detailFromEntry(entry) : null;
  }

  // ---- Cart ----

  private getOrCreateCartLines(sessionId: string): Map<string, CartItem> {
    let lines = this.carts.get(sessionId);
    if (!lines) {
      lines = new Map();
      this.carts.set(sessionId, lines);
    }
    return lines;
  }

  getCart(sessionId: string): Cart {
    const lines = this.carts.get(sessionId);
    if (!lines) return emptyCart();
    return recomputeCart([...lines.values()]);
  }

  addToCart(sessionId: string, productId: string, quantity: number): Cart {
    const entry = this.products.get(productId);
    if (!entry) throw new Error(`Unknown product_id: ${productId}`);
    if (!entry.in_stock) throw new Error(`Sản phẩm '${entry.title}' hiện hết hàng.`);
    if (quantity <= 0) throw new Error(`quantity must be > 0`);

    const lines = this.getOrCreateCartLines(sessionId);
    const existing = lines.get(productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      lines.set(productId, {
        product_id: entry.product_id,
        title: entry.title,
        price: entry.price,
        quantity,
        image_url: entry.image_url,
      });
    }
    return recomputeCart([...lines.values()]);
  }

  removeFromCart(sessionId: string, productId: string): Cart {
    const lines = this.carts.get(sessionId);
    if (lines) lines.delete(productId);
    return recomputeCart(lines ? [...lines.values()] : []);
  }

  // ---- Orders ----

  getOrder(orderId: string): Order | null {
    return this.orders.get(orderId) ?? null;
  }

  placeOrder(sessionId: string): Order | null {
    const lines = this.carts.get(sessionId);
    if (!lines || lines.size === 0) return null;

    const items: OrderItem[] = [];
    let total = 0;
    for (const item of lines.values()) {
      items.push({
        product_id: item.product_id,
        title: item.title,
        quantity: item.quantity,
        price: item.price,
      });
      total += item.price * item.quantity;
    }

    const orderId = `DH${String(this.orders.size + 1).padStart(3, '0')}`;
    const order: Order = {
      order_id: orderId,
      status: 'PLACED',
      placed_at: new Date().toISOString(),
      items,
      total,
      currency: 'VND',
      estimated_delivery: 'Dự kiến 2-5 ngày',
      tracking_url: `https://tracking.example/${orderId}`,
    };
    this.orders.set(orderId, order);

    // Empty cart after checkout
    this.carts.delete(sessionId);

    return order;
  }

  // ---- Policies ----

  getPolicies(query?: string): Policy[] {
    if (!query) return [...POLICIES];
    const q = query.toLowerCase();
    return POLICIES.filter(
      (p) => p.title.toLowerCase().includes(q) || (p.content ?? '').toLowerCase().includes(q)
    );
  }

  // ---- Disclosures ----

  getDisclosures(productId: string): Disclosure | null {
    const entry = this.products.get(productId);
    if (!entry) return null;

    const rows: DisclosureRow[] = [
      { label: 'Giá niêm yết', value: fmtPrice(entry.original_price ?? entry.price) },
      { label: 'Giá hiện tại', value: fmtPrice(entry.price) },
    ];

    const sortedStores = (Object.entries(entry.store_prices) as [PlatformKey, number][]).sort(
      (a, b) => a[1] - b[1]
    );
    for (const [store, price] of sortedStores) {
      rows.push({ label: PLATFORM_DISPLAY[store], value: fmtPrice(price) });
    }

    if (entry.rating !== null) {
      rows.push({
        label: 'Đánh giá',
        value: `${entry.rating}/5 sao (${(entry.review_count ?? 0).toLocaleString('vi-VN')} đánh giá)`,
      });
    }

    return {
      title: `Thông tin giá — ${entry.title}`,
      product_id: productId,
      rows,
      sources: ['Shopee', 'Lazada', 'Tiki', 'TikTok Shop'],
      footnotes: ['Giá được cập nhật thường xuyên. Có thể thay đổi tuỳ thời điểm.'],
    };
  }
}

// ---------------------------------------------------------------------
// Singleton + factory
// ---------------------------------------------------------------------

let _singleton: VNStorefrontBackend | null = null;

export function getVNBackend(): VNStorefrontBackend {
  if (!_singleton) _singleton = new VNStorefrontBackend();
  return _singleton;
}

/** Reset the singleton — useful for tests. */
export function resetVNBackend(): void {
  _singleton = null;
}

/** Default singleton instance. */
export const vnBackend = getVNBackend();

// Re-export platforms for tooling consumers
export { PLATFORM_DISPLAY };
