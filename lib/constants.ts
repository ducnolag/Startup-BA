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
  'Nền tảng công cụ thông minh cho người Việt: săn học bổng quốc tế, so sánh giá 4 sàn TMĐT, theo dõi lịch sử giá và phát hiện giá ảo.';

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
    id: 'scholarship',
    slug: 'scholarship',
    name: 'Săn học bổng',
    shortDescription: '500+ cơ hội Chevening, Erasmus, Coursera',
    description:
      '500+ học bổng Chevening, Erasmus, Fulbright, Coursera. Lọc theo ngành, GPA, quốc gia.',
    href: '/tools/scholarship',
    status: 'live',
    stats: [
      { value: '500+', label: 'Cơ hội' },
      { value: '12', label: 'Quốc gia' },
      { value: 'Free', label: 'Tra cứu' },
    ],
  },
  {
    id: 'price-compare',
    slug: 'price-compare',
    name: 'So sánh giá thông minh',
    shortDescription: 'Lịch sử giá 90 ngày, phát hiện giá ảo',
    description:
      'So sánh giá 4 sàn VN, lịch sử 90 ngày, phát hiện giá ảo, gợi ý thời điểm mua.',
    href: '/tools/price-compare',
    status: 'live',
    stats: [
      { value: '5K+', label: 'Sản phẩm' },
      { value: '4', label: 'Sàn VN' },
      { value: '90d', label: 'Lịch sử' },
    ],
  },
  {
    id: 'price-recommend',
    slug: 'price-recommend',
    name: 'Gợi ý giá AI',
    shortDescription: 'Chatbot phân tích và khuyến nghị thời điểm mua',
    description:
      'Chatbot phân tích URL sản phẩm, khuyến nghị có nên mua ngay hay chờ giảm thêm.',
    href: '/tools/price-recommend',
    status: 'live',
    isNew: true,
    stats: [
      { value: '4 sàn', label: 'So sánh' },
      { value: '90d', label: 'Lịch sử' },
      { value: 'AI', label: 'Tư vấn' },
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
    type: 'scholarship',
    title: 'Chevening Scholarship 2026',
    subtitle: 'Học bổng toàn phần Chính phủ Anh',
    href: '/tools/scholarship',
    savedAt: '2026-08-25T10:00:00.000Z',
  },
  {
    id: 'sv_2',
    type: 'product',
    title: 'iPhone 15 Pro 256GB',
    subtitle: 'Đang theo dõi giá trên Shopee',
    href: '/tools/price-compare',
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

// ---------- Mock data cho chatbot Gợi ý giá ----------

export const SAMPLE_PRODUCTS = [
  'iPhone 15 Pro 256GB',
  'MacBook Air M3 13"',
  'Sony WH-1000XM5',
  'Samsung Galaxy S24 Ultra',
  'AirPods Pro 2',
  'iPad Air M2 11"',
];

export const PLATFORM_PATTERNS: Array<{ match: RegExp; name: string }> = [
  { match: /shopee\.vn/i, name: 'Shopee' },
  { match: /lazada\.vn/i, name: 'Lazada' },
  { match: /tiki\.vn/i, name: 'Tiki' },
  { match: /tiktok\.com|tiktok\.vn/i, name: 'TikTok Shop' },
];

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