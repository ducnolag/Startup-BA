// =====================================================================
// Toolify.vn — Shared types
// Mọi type dùng chung cho nhiều trang/feature đặt ở đây để tránh trùng.
// =====================================================================

// ---------- Auth ----------

export type Role = 'admin' | 'user';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: string;
}

export interface StoredUser extends AuthUser {
  password: string;
}

// ---------- Tools (frontend config) ----------

export type ToolStatus = 'live' | 'soon';

export interface ToolEntry {
  id: string;
  slug: string;
  name: string;
  /** Hiển thị ngắn trên nav/dropdown */
  shortDescription: string;
  /** Hiển thị đầy đủ trên trang /tools */
  description: string;
  href: string;
  status: ToolStatus;
  isNew?: boolean;
  stats: { value: string; label: string }[];
}

// ---------- Admin: Products ----------

export interface Product {
  id: string;
  name: string;
  category: string;
  /** VND */
  price: number;
  url: string;
  active: boolean;
  createdAt: string;
}

// ---------- User saved items ----------

export type SavedItemType = 'scholarship' | 'product' | 'recommendation';

export interface SavedItem {
  id: string;
  type: SavedItemType;
  title: string;
  subtitle: string;
  href: string;
  savedAt: string;
}

// ---------- Vote / bình chọn ----------

export interface Candidate {
  id: string;
  title: string;
  description: string;
  proposer: string;
}

export interface VoteEntry {
  id: string;
  userId: string;
  userEmail: string;
  candidateId: string;
  votedAt: string;
}

// ---------- Chatbot Gợi ý giá ----------

export type Platform = 'Shopee' | 'Lazada' | 'Tiki' | 'TikTok Shop' | 'Website khác';

export type Trend = 'down' | 'up' | 'stable';

export type Verdict = 'buy' | 'wait' | 'good-deal';

export interface PriceAnalysis {
  productName: string;
  platform: Platform;
  currentPrice: number;
  avgPrice: number;
  minPrice: number;
  maxPrice: number;
  trend: Trend;
  trendPct: number;
  verdict: Verdict;
  verdictLabel: string;
  advice: string;
  bestTimeWindow: string;
}