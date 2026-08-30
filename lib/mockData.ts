// Mock data for tool pages — represents what the real API would return.
// Replace with real API calls when backend is ready.

export type Scholarship = {
  id: string;
  title: string;
  provider: string;          // Chính phủ Anh, EU, ĐH Stanford...
  country: string;
  flag: string;
  category: 'hoc-bong' | 'khoa-hoc' | 'trao-doi';
  field: string[];           // ['IT', 'Kinh tế', 'Kỹ thuật']
  deadline: string;          // ISO date
  deadlineDays: number;      // computed
  value: string;             // 'Toàn phần' / '5.000 USD'
  duration: string;         // '1 năm' / 'Toàn khóa'
  matchScore?: number;       // 0-100, optional
  description: string;
  requirements: {
    gpa?: number;
    ielts?: number;
    age?: string;
    other?: string[];
  };
  source: string;            // nguồn
  verified: boolean;
  applyUrl: string;
};

export const scholarships: Scholarship[] = [
  {
    id: 'chevening-2026',
    title: 'Chevening Scholarship 2026',
    provider: 'Chính phủ Anh',
    country: 'Vương quốc Anh',
    flag: '🇬🇧',
    category: 'hoc-bong',
    field: ['Tất cả ngành'],
    deadline: '2026-11-01',
    deadlineDays: 63,
    value: 'Toàn phần',
    duration: '1 năm (thạc sĩ)',
    matchScore: 92,
    description:
      'Học bổng toàn phần của Chính phủ Anh dành cho sinh viên xuất sắc tại Việt Nam. Bao gồm học phí, sinh hoạt phí, vé máy bay và bảo hiểm.',
    requirements: {
      gpa: 3.2,
      ielts: 6.5,
      other: ['Tốt nghiệp ĐH', 'Kinh nghiệm lãnh đạo ≥ 2 năm'],
    },
    source: 'chevening.org',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'erasmus-mundus-2026',
    title: 'Erasmus Mundus Joint Master',
    provider: 'Liên minh châu Âu',
    country: 'Châu Âu (đa quốc gia)',
    flag: '🇪🇺',
    category: 'hoc-bong',
    field: ['IT', 'Kỹ thuật', 'Kinh tế', 'Khoa học'],
    deadline: '2026-10-15',
    deadlineDays: 46,
    value: 'Toàn phần (€1.400/tháng)',
    duration: '2 năm (châu Âu)',
    matchScore: 88,
    description:
      'Chương trình thạc sĩ liên kết giữa nhiều trường ĐH châu Âu. Học tại 2-3 nước, nhận bằng chung.',
    requirements: {
      gpa: 3.0,
      ielts: 6.5,
      other: ['Tốt nghiệp ĐH', 'Đam mê nghiên cứu'],
    },
    source: 'erasmus-plus.ec.europa.eu',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'fulbright-2026',
    title: 'Fulbright Scholarship Vietnam',
    provider: 'Chính phủ Mỹ',
    country: 'Hoa Kỳ',
    flag: '🇺🇸',
    category: 'hoc-bong',
    field: ['Tất cả ngành'],
    deadline: '2027-02-15',
    deadlineDays: 169,
    value: 'Toàn phần',
    duration: '1-2 năm',
    matchScore: 85,
    description:
      'Học bổng danh giá của Chính phủ Mỹ dành cho công dân Việt Nam. Học thạc sĩ hoặc tiến sĩ tại các trường ĐH hàng đầu Mỹ.',
    requirements: {
      gpa: 3.5,
      ielts: 7.0,
      other: ['Công dân VN', 'Cam kết về nước sau khi học xong'],
    },
    source: 'vn.usembassy.gov',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'daad-2026',
    title: 'DAAD Scholarship Germany',
    provider: 'Chính phủ Đức',
    country: 'Đức',
    flag: '🇩🇪',
    category: 'hoc-bong',
    field: ['Kỹ thuật', 'Khoa học', 'IT'],
    deadline: '2026-12-31',
    deadlineDays: 123,
    value: 'Toàn phần (€934/tháng)',
    duration: '1-2 năm',
    matchScore: 81,
    description:
      'Học bổng DAAD cho sinh viên quốc tế theo học tại các trường ĐH Đức. Đặc biệt ưu tiên ngành kỹ thuật và khoa học.',
    requirements: {
      gpa: 3.0,
      ielts: 6.0,
      other: ['Tốt nghiệp ĐH ≤ 6 năm'],
    },
    source: 'daad.vn',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'australia-awards',
    title: 'Australia Awards Scholarship',
    provider: 'Chính phủ Úc',
    country: 'Úc',
    flag: '🇦🇺',
    category: 'hoc-bong',
    field: ['Phát triển', 'Giáo dục', 'Y tế', 'Công nghệ'],
    deadline: '2026-09-30',
    deadlineDays: 31,
    value: 'Toàn phần',
    duration: '1-2 năm',
    matchScore: 78,
    description:
      'Học bổng Australia Awards nhằm phát triển nguồn nhân lực cho các nước đang phát triển. Đặc biệt cho ngành phát triển bền vững.',
    requirements: {
      gpa: 3.0,
      ielts: 6.5,
      other: ['Công dân VN', 'Cam kết đóng góp cho VN'],
    },
    source: 'australiaawards.gov.au',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'schwarzman-2026',
    title: 'Schwarzman Scholars',
    provider: 'ĐH Tsinghua',
    country: 'Trung Quốc',
    flag: '🇨🇳',
    category: 'hoc-bong',
    field: ['Chính sách công', 'Kinh tế', 'Quan hệ quốc tế'],
    deadline: '2026-09-15',
    deadlineDays: 16,
    value: 'Toàn phần',
    duration: '1 năm (thạc sĩ tại ĐH Tsinghua)',
    matchScore: 76,
    description:
      'Học bổng danh giá Schwarzman tại ĐH Tsinghua (Trung Quốc). Tương đương Rhodes Scholarship của Trung Quốc.',
    requirements: {
      gpa: 3.5,
      ielts: 7.0,
      other: ['18-28 tuổi', 'Kinh nghiệm lãnh đạo'],
    },
    source: 'schwarzmanscholars.org',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'coursera-financial-aid',
    title: 'Coursera Financial Aid — Toàn bộ khóa học',
    provider: 'Coursera',
    country: 'Online',
    flag: '🌐',
    category: 'khoa-hoc',
    field: ['IT', 'Data Science', 'Business', 'Design'],
    deadline: '2026-12-31',
    deadlineDays: 123,
    value: 'Miễn phí 100% chứng chỉ',
    duration: '3-6 tháng',
    matchScore: 95,
    description:
      'Coursera cấp học bổng tài chính cho sinh viên có hoàn cảnh khó khăn. Học miễn phí và nhận chứng chỉ từ các trường ĐH hàng đầu (Stanford, Yale, Google...).',
    requirements: {
      other: ['Sinh viên VN', 'Thu nhập gia đình thấp'],
    },
    source: 'coursera.org',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'edx-micro-masters',
    title: 'edX MicroMasters — Miễn phí cho SV VN',
    provider: 'edX (MIT, Harvard)',
    country: 'Online',
    flag: '🌐',
    category: 'khoa-hoc',
    field: ['IT', 'AI', 'Quản trị'],
    deadline: '2026-12-31',
    deadlineDays: 123,
    value: 'Miễn phí + 50% học bổng chính thức',
    duration: '6-12 tháng',
    matchScore: 90,
    description:
      'Chương trình MicroMasters từ MIT, Harvard, MITx. Học online, có thể quy đổi tín chỉ khi học thạc sĩ chính thức.',
    requirements: {
      other: ['Sinh viên VN'],
    },
    source: 'edx.org',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'vinuni-scholarship',
    title: 'VinUni Scholarship Toàn phần',
    provider: 'ĐH VinUni',
    country: 'Việt Nam',
    flag: '🇻🇳',
    category: 'hoc-bong',
    field: ['IT', 'Kinh tế', 'Y khoa'],
    deadline: '2026-09-01',
    deadlineDays: 2,
    value: 'Toàn phần (1.2 tỷ/năm)',
    duration: '4 năm',
    matchScore: 82,
    description:
      'VinUni cấp học bổng toàn phần cho sinh viên xuất sắc. Học tại Việt Nam với chất lượng quốc tế, giảng viên từ Cornell, Penn.',
    requirements: {
      gpa: 3.7,
      ielts: 7.0,
      other: ['Thi tuyển đầu vào'],
    },
    source: 'vinuni.edu.vn',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'ai-yong-scientist',
    title: 'AI Young Scientist Vietnam 2026',
    provider: 'VinAI Research',
    country: 'Việt Nam',
    flag: '🇻🇳',
    category: 'khoa-hoc',
    field: ['AI', 'Machine Learning', 'Data Science'],
    deadline: '2026-11-30',
    deadlineDays: 92,
    value: '30 triệu VNĐ + thực tập tại VinAI',
    duration: '6 tháng',
    matchScore: 89,
    description:
      'Chương trình đào tạo AI cho sinh viên VN. Được học trực tiếp từ các nhà nghiên cứu VinAI, nhận chứng chỉ quốc tế.',
    requirements: {
      gpa: 3.2,
      other: ['SV năm 2-4 ngành IT/Toán', 'Biết Python cơ bản'],
    },
    source: 'vinai.io',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'ai4vietnam-fellowship',
    title: 'AI4Vietnam Fellowship',
    provider: 'ĐH Bách Khoa TP.HCM',
    country: 'Việt Nam',
    flag: '🇻🇳',
    category: 'trao-doi',
    field: ['AI', 'Kỹ thuật'],
    deadline: '2026-10-30',
    deadlineDays: 61,
    value: '20 triệu VNĐ + mentorship',
    duration: '4 tháng',
    matchScore: 84,
    description:
      'Chương trình nghiên cứu AI ứng dụng tại BK TP.HCM. Làm việc với giảng viên về các bài toán AI thực tế tại VN.',
    requirements: {
      gpa: 3.0,
      other: ['SV năm 3-4 IT/Toán'],
    },
    source: 'hcmut.edu.vn',
    verified: true,
    applyUrl: '#',
  },
  {
    id: 'udacity-scholarship',
    title: 'Udacity Nanodegree — Bertelsmann Tech',
    provider: 'Bertelsmann (Đức)',
    country: 'Online',
    flag: '🌐',
    category: 'khoa-hoc',
    field: ['Data Science', 'AI', 'Cloud'],
    deadline: '2026-11-15',
    deadlineDays: 77,
    value: 'Miễn phí (4 tháng)',
    duration: '4 tháng',
    matchScore: 87,
    description:
      'Bertelsmann cấp học bổng Udacity Nanodegree cho SV quốc tế. Học Data Science/AI miễn phí + nhận chứng chỉ quốc tế.',
    requirements: {
      other: ['SV hoặc mới tốt nghiệp', 'Tiếng Anh cơ bản'],
    },
    source: 'udacity.com',
    verified: true,
    applyUrl: '#',
  },
];

export type Product = {
  id: string;
  name: string;
  category: 'laptop' | 'phone' | 'audio' | 'camera' | 'wearable' | 'gaming';
  brand: string;
  image: string; // emoji placeholder
  currentPrice: number;
  originalPrice: number;
  lowestPrice: number;
  highestPrice: number;
  averagePrice: number;
  rating: number;
  reviewCount: number;
  history: number[]; // 30-day price history
  stores: { name: string; price: number; inStock: boolean }[];
  recommendation: 'mua-ngay' | 'doi-them' | 'gia-ao';
  reason: string;
};

const generateHistory = (current: number, volatility: number): number[] => {
  const out: number[] = [];
  let p = current * (1 + (Math.random() - 0.5) * volatility);
  for (let i = 0; i < 30; i++) {
    p = p * (1 + (Math.random() - 0.5) * 0.05);
    p = Math.max(current * 0.7, Math.min(current * 1.3, p));
    out.push(Math.round(p));
  }
  // ensure last value matches current
  out[out.length - 1] = current;
  return out;
};

export const products: Product[] = [
  {
    id: 'macbook-air-m2',
    name: 'MacBook Air M2 13" 8GB/256GB',
    category: 'laptop',
    brand: 'Apple',
    image: '💻',
    currentPrice: 21990000,
    originalPrice: 27990000,
    lowestPrice: 19990000,
    highestPrice: 27990000,
    averagePrice: 23450000,
    rating: 4.8,
    reviewCount: 1247,
    history: generateHistory(21990000, 0.15),
    stores: [
      { name: 'Shopee', price: 21990000, inStock: true },
      { name: 'Lazada', price: 22490000, inStock: true },
      { name: 'Tiki', price: 22990000, inStock: true },
      { name: 'TikTok Shop', price: 21890000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason:
      'Giá đang ở mức thấp nhất 30 ngày. Lịch sử cho thấy giá sẽ tăng trở lại vào tuần sau.',
  },
  {
    id: 'iphone-15-pro',
    name: 'iPhone 15 Pro 256GB',
    category: 'phone',
    brand: 'Apple',
    image: '📱',
    currentPrice: 25990000,
    originalPrice: 29990000,
    lowestPrice: 24500000,
    highestPrice: 29990000,
    averagePrice: 27120000,
    rating: 4.9,
    reviewCount: 3892,
    history: generateHistory(25990000, 0.12),
    stores: [
      { name: 'Shopee', price: 25990000, inStock: true },
      { name: 'Tiki', price: 26290000, inStock: true },
      { name: 'TikTok Shop', price: 25790000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason:
      'Giá hiện tại thấp hơn TB 4%, nhưng lịch sử cho thấy có thể giảm thêm 8-10% trong 2 tuần tới (dịp sale 9/9).',
  },
  {
    id: 'airpods-pro-2',
    name: 'AirPods Pro 2 (USB-C)',
    category: 'audio',
    brand: 'Apple',
    image: '🎧',
    currentPrice: 4990000,
    originalPrice: 6490000,
    lowestPrice: 4290000,
    highestPrice: 6490000,
    averagePrice: 5380000,
    rating: 4.7,
    reviewCount: 2156,
    history: generateHistory(4990000, 0.18),
    stores: [
      { name: 'Shopee', price: 4990000, inStock: true },
      { name: 'Lazada', price: 5190000, inStock: true },
      { name: 'Tiki', price: 4890000, inStock: false },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá thấp hơn 7% so với trung bình. Đang trong đợt giảm giá chính hãng từ Apple.',
  },
  {
    id: 'sony-wh1000xm5',
    name: 'Sony WH-1000XM5',
    category: 'audio',
    brand: 'Sony',
    image: '🎧',
    currentPrice: 6990000,
    originalPrice: 9490000,
    lowestPrice: 6490000,
    highestPrice: 9490000,
    averagePrice: 7920000,
    rating: 4.8,
    reviewCount: 1834,
    history: generateHistory(6990000, 0.14),
    stores: [
      { name: 'Shopee', price: 6990000, inStock: true },
      { name: 'Lazada', price: 7190000, inStock: true },
      { name: 'Tiki', price: 6890000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá đang ở mức thấp. Shopee đang có voucher giảm thêm 500k.',
  },
  {
    id: 'samsung-s24-ultra',
    name: 'Samsung Galaxy S24 Ultra 512GB',
    category: 'phone',
    brand: 'Samsung',
    image: '📱',
    currentPrice: 28990000,
    originalPrice: 33990000,
    lowestPrice: 26990000,
    highestPrice: 33990000,
    averagePrice: 30120000,
    rating: 4.7,
    reviewCount: 967,
    history: generateHistory(28990000, 0.13),
    stores: [
      { name: 'Shopee', price: 28990000, inStock: true },
      { name: 'Lazada', price: 29490000, inStock: true },
      { name: 'TikTok Shop', price: 28590000, inStock: true },
    ],
    recommendation: 'gia-ao',
    reason:
      'CẢNH BÁO: Giá tăng 15% trong 3 ngày qua trước "sale 8/8". Giá hiện tại CAO HƠN TB 5%. NÊN ĐỢI.',
  },
  {
    id: 'dyson-v12',
    name: 'Dyson V12 Detect Slim',
    category: 'laptop',
    brand: 'Dyson',
    image: '🧹',
    currentPrice: 12990000,
    originalPrice: 17990000,
    lowestPrice: 11990000,
    highestPrice: 17990000,
    averagePrice: 14450000,
    rating: 4.6,
    reviewCount: 542,
    history: generateHistory(12990000, 0.16),
    stores: [
      { name: 'Shopee', price: 12990000, inStock: true },
      { name: 'Tiki', price: 13490000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason:
      'Giá hiện tại thấp hơn TB 10%, nhưng có thể giảm thêm 5% vào cuối tháng.',
  },
  {
    id: 'canon-r6-mark-ii',
    name: 'Canon EOS R6 Mark II',
    category: 'camera',
    brand: 'Canon',
    image: '📷',
    currentPrice: 52990000,
    originalPrice: 62990000,
    lowestPrice: 49990000,
    highestPrice: 62990000,
    averagePrice: 56870000,
    rating: 4.9,
    reviewCount: 234,
    history: generateHistory(52990000, 0.10),
    stores: [
      { name: 'Shopee', price: 52990000, inStock: true },
      { name: 'Lazada', price: 53490000, inStock: false },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá thấp nhất trong 6 tháng qua. Số lượng có hạn.',
  },
  {
    id: 'apple-watch-s9',
    name: 'Apple Watch Series 9 45mm',
    category: 'wearable',
    brand: 'Apple',
    image: '⌚',
    currentPrice: 9490000,
    originalPrice: 11990000,
    lowestPrice: 8990000,
    highestPrice: 11990000,
    averagePrice: 10420000,
    rating: 4.7,
    reviewCount: 1521,
    history: generateHistory(9490000, 0.12),
    stores: [
      { name: 'Shopee', price: 9490000, inStock: true },
      { name: 'Tiki', price: 9690000, inStock: true },
      { name: 'TikTok Shop', price: 9290000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá thấp hơn TB 9%. TikTok Shop đang có flash sale.',
  },
  {
    id: 'ps5-slim',
    name: 'PlayStation 5 Slim',
    category: 'gaming',
    brand: 'Sony',
    image: '🎮',
    currentPrice: 12990000,
    originalPrice: 14990000,
    lowestPrice: 12490000,
    highestPrice: 14990000,
    averagePrice: 13760000,
    rating: 4.9,
    reviewCount: 4218,
    history: generateHistory(12990000, 0.08),
    stores: [
      { name: 'Shopee', price: 12990000, inStock: true },
      { name: 'Lazada', price: 13190000, inStock: true },
      { name: 'Tiki', price: 12990000, inStock: true },
    ],
    recommendation: 'doi-them',
    reason:
      'Giá ổn định. PS5 Pro ra mắt Q4/2026 sẽ kéo giá PS5 Slim giảm thêm 10-15%.',
  },
  {
    id: 'logi-mx-master-3s',
    name: 'Logitech MX Master 3S',
    category: 'laptop',
    brand: 'Logitech',
    image: '🖱️',
    currentPrice: 2390000,
    originalPrice: 2990000,
    lowestPrice: 2190000,
    highestPrice: 2990000,
    averagePrice: 2612000,
    rating: 4.8,
    reviewCount: 3287,
    history: generateHistory(2390000, 0.11),
    stores: [
      { name: 'Shopee', price: 2390000, inStock: true },
      { name: 'Tiki', price: 2450000, inStock: true },
    ],
    recommendation: 'mua-ngay',
    reason: 'Giá thấp nhất 90 ngày qua. Đang có mã giảm 200k từ shop chính hãng.',
  },
];

export const formatVND = (n: number) => new Intl.NumberFormat('vi-VN').format(n) + 'đ';