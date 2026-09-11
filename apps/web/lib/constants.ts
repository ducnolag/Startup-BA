// =====================================================================
// Toolify.vn — Constants & seed data
// Mọi danh sách "cứng" dùng chung cho nhiều trang đặt ở đây.
// Khi có backend, các seed Product/Vote/User có thể chuyển sang DB.
// =====================================================================

import type {
  Candidate,
  Product,
  SavedItem,
  StoredUser,
  ToolEntry,
  VoteEntry,
} from './types';

// ---------- Site ----------

export const SITE_URL = 'https://toolify.vn';
export const SITE_NAME = 'Toolify.vn';
export const SITE_DESC =
  'Nền tảng công cụ thông minh cho người Việt: dịch PDF (báo/tạp chí), xoá metadata AI, so sánh giá 4 sàn TMĐT, phát hiện giá ảo.';

// ---------- Storage keys ----------

export const STORAGE_KEYS = {
  users: 'toolify.users',
  session: 'toolify.session',
  products: 'toolify.products',
  saved: 'toolify.saved',
  votes: 'toolify.votes',
  candidates: 'toolify.vote_candidates',
  adminTools: 'toolify.admin_tools',
} as const;

// ---------- Tools (Navigation, /tools, /admin/tools đều dùng) ----------

export const TOOLS: ToolEntry[] = [
  {
    id: 'pdf-translate',
    slug: 'pdf-translate',
    name: 'PDF Translate',
    shortDescription: 'Upload PDF (báo, tạp chí, tài liệu) — dịch từng trang sang tiếng Việt',
    description:
      'Upload file PDF (báo, tạp chí, tài liệu học thuật). AI đọc và dịch từng trang sang tiếng Việt hoặc 5 ngôn ngữ khác. Tải về bản Markdown.',
    href: '/tools/pdf-translate',
    status: 'live',
    isNew: true,
    stats: [
      { value: '20 MB', label: 'Tối đa' },
      { value: '6', label: 'Ngôn ngữ' },
      { value: 'Gemini', label: 'AI' },
    ],
  },
  {
    id: 'watermark-remover',
    slug: 'watermark-remover',
    name: 'Strip AI Metadata',
    shortDescription:
      'Xoá dấu vết AI (C2PA, SynthID, EXIF, doc props) khỏi PDF, DOCX, ảnh',
    description:
      'Strip AI provenance markers (C2PA manifest, EXIF, XMP, doc properties) ' +
      'khỏi PDF, DOCX và ảnh. Hỗ trợ Adobe Firefly, Gemini SynthID, Claude, OpenAI. ' +
      'Không xoá watermark trực quan — chỉ xoá metadata dấu vết nguồn gốc AI.',
    href: '/tools/watermark-remover',
    status: 'live',
    isNew: true,
    stats: [
      { value: 'PDF · DOCX · Ảnh', label: 'Định dạng' },
      { value: 'C2PA + EXIF', label: 'Strip' },
      { value: 'Local', label: 'Xử lý' },
    ],
  },
  {
    id: 'price-smart',
    slug: 'price-smart',
    name: 'Mua thông minh',
    shortDescription: 'So sánh giá 4 sàn, phát hiện giá ảo, gợi ý mua ngay',
    description:
      'Dán link sản phẩm → AI phân tích giá, so sánh 4 sàn, phát hiện giá ảo, gợi ý nên mua ngay hay chờ.',
    href: '/tools/price-smart',
    status: 'live',
    stats: [
      { value: '4 sàn', label: 'So sánh' },
      { value: 'AI', label: 'Phân tích' },
      { value: '0đ', label: 'Chi phí' },
    ],
  },
];

// ---------- Demo / seed data ----------

export const ADMIN_DEMO: StoredUser = {
  id: 'usr_admin_seed',
  email: 'admin@toolify.vn',
  password: 'admin123',
  fullName: 'Toolify Admin',
  role: 'admin',
  createdAt: '2026-01-01T00:00:00.000Z',
};

export const SEED_PRODUCTS: Product[] = [
  {
    id: 'p_iphone15',
    name: 'iPhone 15 Pro 256GB',
    category: 'Điện thoại',
    price: 24990000,
    url: 'https://shopee.vn/iphone-15-pro',
    active: true,
    createdAt: '2026-08-15T10:00:00.000Z',
  },
  {
    id: 'p_macbook',
    name: 'MacBook Air M3 13"',
    category: 'Laptop',
    price: 28990000,
    url: 'https://tiki.vn/macbook-air-m3',
    active: true,
    createdAt: '2026-08-20T10:00:00.000Z',
  },
];

export const SEED_SAVED: SavedItem[] = [
  {
    id: 'sv_1',
    type: 'product',
    title: 'iPhone 15 Pro 256GB',
    subtitle: 'Đang theo dõi giá trên Shopee',
    href: '/tools/price-smart',
    savedAt: '2026-08-25T10:00:00.000Z',
  },
  {
    id: 'sv_2',
    type: 'recommendation',
    title: 'PDF Translate: báo công nghệ tuần này',
    subtitle: 'Bản dịch tiếng Việt PDF từ TechCrunch / The Verge',
    href: '/tools/pdf-translate',
    savedAt: '2026-08-28T14:00:00.000Z',
  },
];

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'cv-builder',
    title: 'AI CV Builder cho sinh viên',
    description: 'Tạo CV chuẩn quốc tế bằng AI, matching với JD công ty.',
    proposer: 'Trần Minh (ĐH Bách Khoa)',
  },
  {
    id: 'rental-finder',
    title: 'Tìm phòng trọ thông minh',
    description: 'Gom phòng trọ sinh viên trên Facebook group, lọc theo giá/khu vực.',
    proposer: 'Nguyễn Lan (ĐH Ngoại Thương)',
  },
  {
    id: 'exchange-rate',
    title: 'Theo dõi tỷ giá USD/EUR → VND',
    description: 'Cảnh báo tỷ giá tốt để mua USD/EUR đi du học.',
    proposer: 'Lê Quân (ĐH Kinh tế Quốc dân)',
  },
];

export const SEED_VOTES: VoteEntry[] = [
  {
    id: 'v_1',
    userId: 'usr_demo_1',
    userEmail: 'demo1@example.com',
    candidateId: 'cv-builder',
    votedAt: '2026-08-30T10:00:00.000Z',
  },
  {
    id: 'v_2',
    userId: 'usr_demo_2',
    userEmail: 'demo2@example.com',
    candidateId: 'rental-finder',
    votedAt: '2026-08-30T11:00:00.000Z',
  },
  {
    id: 'v_3',
    userId: 'usr_demo_3',
    userEmail: 'demo3@example.com',
    candidateId: 'cv-builder',
    votedAt: '2026-08-30T12:00:00.000Z',
  },
];

// ---------- Sample products cho AI demo ----------

export const SAMPLE_PRODUCTS = [
  'Son môi 3CE',
  'Máy rửa mặt Foreo Luna',
  'Serum Vitamin C',
  'Nồi cơm điện Philips',
  'Máy lọc không khí Xiaomi',
  'Đầm nữ dự tiệc',
  'Áo khoác nữ dạ',
  'Túi xách nữ da',
];

// Platform detection (Shopee, Lazada, Tiki, TikTok Shop) — dùng cho parser
export const PLATFORM_PATTERNS: Array<{ match: RegExp; name: string }> = [
  { match: /shopee\.vn/i, name: 'Shopee' },
  { match: /lazada\.vn/i, name: 'Lazada' },
  { match: /tiki\.vn/i, name: 'Tiki' },
  { match: /tiktok\.com|tiktok\.vn/i, name: 'TikTok Shop' },
];

// ---------- Categories ưu tiên (Phase 1) ----------

export type ProductCategory = 'lam-dep' | 'nha-cua-doi-song' | 'thoi-trang-nu';

export const CATEGORIES: { id: ProductCategory; label: string; emoji: string; keywords: string[] }[] = [
  {
    id: 'lam-dep',
    label: 'Làm đẹp',
    emoji: '💄',
    keywords: ['son', 'kem', 'serum', 'mặt', 'tóc', 'nail', 'mỹ phẩm', 'phấn', 'nước hoa', 'foreo', 'lancome', '3ce'],
  },
  {
    id: 'nha-cua-doi-song',
    label: 'Nhà cửa & Đời sống',
    emoji: '🏠',
    keywords: ['nồi', 'máy lọc', 'máy hút bụi', 'nệm', 'ga', 'gối', 'bát', 'đĩa', 'lock&lock', 'philips', 'xiaomi'],
  },
  {
    id: 'thoi-trang-nu',
    label: 'Thời trang nữ',
    emoji: '👗',
    keywords: ['đầm', 'váy', 'áo', 'quần', 'túi', 'giày', 'sandal', 'nữ', 'dạ', 'hạnh phúc', 'ivy moda'],
  },
];

// ---------- Gemini API config ----------
//
// Lưu ý: GEMINI_API_KEY là biến server-side (đọc được trong API routes).
// Next.js chỉ tự động phơi ra client với biến bắt đầu bằng NEXT_PUBLIC_* —
// vì vậy ta KHÔNG dùng NEXT_PUBLIC_GEMINI_API_KEY (sẽ lộ key ra browser).
//
// Model mặc định `gemini-2.5-flash` — ổn định, multimodal (hỗ trợ PDF qua
// Files API), và free tier đủ dùng cho cá nhân. `gemini-2.0-flash` đã bị
// Google shutdown ngày 01/06/2026 (xem https://ai.google.dev/gemini-api/docs/deprecations).
// Override bằng GEMINI_MODEL nếu bạn có quyền truy cập model khác.

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
export const GEMINI_MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
export const GEMINI_ENDPOINT =
  `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

// ---------- Vote / Survey CTA ----------
// Khi có form khảo sát (Google Forms / Tally / Typeform...) thì dán link vào đây.
// Để trống thì nút CTA sẽ tự ẩn.
export const VOTE_SURVEY_URL =
  process.env.NEXT_PUBLIC_VOTE_SURVEY_URL ?? '';

// Link nhóm/kênh Telegram để người dùng nhắn tin bình chọn.
// Để trống thì nút CTA sẽ tự ẩn.
export const VOTE_TELEGRAM_URL =
  process.env.NEXT_PUBLIC_VOTE_TELEGRAM_URL ?? '';

// Copy cho nút Telegram — thường là username không có @, ví dụ 'toolifyvn'.
export const VOTE_TELEGRAM_HANDLE = 'toolifyvn';

// ---------- Copy ----------

export const ROUTES = {
  home: '/',
  tools: '/tools',
  about: '/#mission',
  pricing: '/#pricing',
  login: '/login',
  signup: '/signup',
  dashboard: '/dashboard',
  admin: '/admin',
  adminProducts: '/admin/products',
  adminTools: '/admin/tools',
  adminVotes: '/admin/votes',
} as const;