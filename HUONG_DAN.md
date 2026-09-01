# HƯỚNG DẪN THAO TÁC THỦ CÔNG — Toolify.vn

Tài liệu này liệt kê **mọi việc cần làm thủ công** mà AI không thể làm thay (vì cần tài khoản cá nhân, domain thật, dịch vụ bên ngoài). Làm song song với code, mỗi việc có thời gian ước tính.

> **Quy tắc chung**: Tạo file `.env.local` ở thư mục gốc dự án và paste API key vào đó. **KHÔNG commit file này lên git.**

```bash
# .env.local — KHÔNG commit
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

SHOPEE_AFFILIATE_ID=
SHOPEE_AFFILIATE_KEY=
LAZADA_AFFILIATE_KEY=
TIKI_AFFILIATE_ID=
TIKI_AFFILIATE_KEY=
TIKTOK_SHOP_APP_KEY=
TIKTOK_SHOP_APP_SECRET=

TELEGRAM_BOT_TOKEN=
RESEND_API_KEY=

NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

---

## PHẦN A — BACKEND (CẦN TRƯỚC KHI DEPLOY)

### A1. Tạo tài khoản Supabase ⏱ 10 phút
**Vì sao**: Database + Auth + Storage cho toàn bộ Toolify.

1. Vào https://supabase.com → Sign up bằng GitHub
2. New project → tên `toolify-vn` → chọn region Singapore (gần VN nhất)
3. Đặt database password (lưu vào password manager)
4. Chờ ~2 phút project được tạo
5. Vào **Settings → API** → copy 3 giá trị:
   - `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **KHÔNG expose ra frontend**

> ⚠️ **KHÔNG bao giờ commit file `.env.local` hoặc paste key thật vào code/doc đã push lên git.** Repo có bật GitHub Push Protection — sẽ block push và lộ key. Nếu lỡ lộ → rotate key ngay trong Supabase Dashboard.

**Gửi tôi**: 3 giá trị trên (qua chat) → tôi sẽ wire authentication + database.

### A2. Tạo schema database ⏱ 20 phút
> ⚠️ **Nếu gặp lỗi `relation already exists`** → chạy phần **"Dọn dẹp"** ở bước 3 TRƯỚC, rồi chạy lại schema.

1. Vào Supabase Dashboard → **SQL Editor**
2. **TRƯỚC TIÊN** chạy lệnh dọn dẹp (nếu bảng đã tồn tại từ lần trước):

```sql
-- ⚠️ XÓA TOÀN BỘ BẢNG CŨ (chạy 1 lần duy nhất khi muốn tạo lại từ đầu)
-- Bỏ qua nếu chạy lần đầu tiên
drop table if exists public.alerts cascade;
drop table if exists public.wishlist cascade;
drop table if exists public.price_history cascade;
drop table if exists public.products cascade;
drop table if exists public.scholarships cascade;
drop table if exists public.tool_votes cascade;
drop table if exists public.profiles cascade;
```

3. Paste schema dưới → Run

```sql
-- Users (extends Supabase auth.users)
create table public.profiles (
  id uuid references auth.users primary key,
  email text,
  full_name text,
  avatar_url text,
  telegram_chat_id text,
  is_premium boolean default false,
  premium_expires_at timestamptz,
  created_at timestamptz default now()
);

-- Scholarships
create table public.scholarships (
  id text primary key,                    -- 'chevening-2026'
  title text not null,
  provider text,
  country text,
  flag text,
  category text,                          -- 'hoc-bong' | 'khoa-hoc' | 'trao-doi'
  field text[],                           -- ['IT', 'Kinh tế']
  deadline date,
  value text,
  duration text,
  description text,
  requirements jsonb,
  source_url text,
  source text,
  verified boolean default false,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);
create index on public.scholarships (deadline);
create index on public.scholarships using gin (field);

-- Products
create table public.products (
  id text primary key,                    -- 'macbook-air-m2'
  name text not null,
  brand text,
  category text,                          -- 'laptop' | 'phone' | 'audio'
  image_url text,
  current_price bigint,
  original_price bigint,
  average_price bigint,
  rating numeric(3,2),
  review_count int,
  recommendation text,                    -- 'mua-ngay' | 'doi-them' | 'gia-ao'
  recommendation_reason text,
  active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Price history per store per product
create table public.price_history (
  id bigserial primary key,
  product_id text references public.products(id) on delete cascade,
  store text not null,                    -- 'Shopee' | 'Lazada' | 'Tiki' | 'TikTok Shop'
  price bigint not null,
  in_stock boolean default true,
  recorded_at timestamptz default now()
);
create index on public.price_history (product_id, recorded_at desc);

-- User saved items (wishlist)
create table public.wishlist (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  product_id text references public.products(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, product_id)
);

-- User alerts
create table public.alerts (
  id bigserial primary key,
  user_id uuid references public.profiles(id) on delete cascade,
  target_type text not null,              -- 'product' | 'scholarship'
  target_id text not null,
  condition jsonb,                        -- {"below_price": 20000000} or {"deadline_within_days": 7}
  channel text default 'telegram',        -- 'telegram' | 'email'
  active boolean default true,
  created_at timestamptz default now()
);

-- Vote tracking for Tool #3
create table public.tool_votes (
  id bigserial primary key,
  candidate_id text not null,
  user_id uuid references public.profiles(id),
  ip_hash text,                           -- cho anonymous voting
  created_at timestamptz default now(),
  unique (candidate_id, user_id)
);

-- RLS policies
alter table public.profiles enable row level security;
alter table public.wishlist enable row level security;
alter table public.alerts enable row level security;

create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can view own wishlist" on public.wishlist for select using (auth.uid() = user_id);
create policy "Users can manage own wishlist" on public.wishlist for all using (auth.uid() = user_id);
create policy "Users can manage own alerts" on public.alerts for all using (auth.uid() = user_id);

-- Public read for scholarships/products
alter table public.scholarships enable row level security;
alter table public.products enable row level security;
alter table public.price_history enable row level security;
create policy "Public read scholarships" on public.scholarships for select using (active = true);
create policy "Public read products" on public.products for select using (active = true);
create policy "Public read price history" on public.price_history for select using (true);
```

3. Vào **Authentication → Providers** → bật **Email** (mặc định) + **Google** + **GitHub**:
   - Google: cần tạo OAuth app tại https://console.cloud.google.com (xem A3)
   - GitHub: cần tạo OAuth app tại https://github.com/settings/developers (xem A4)

### A3. Tạo Google OAuth ⏱ 10 phút
> **Trên Google Cloud Console:**
1. Vào https://console.cloud.google.com → **New Project** → tên `toolify-vn`
2. Bên trái: **APIs & Services → Library** → tìm "Google+ API" → **Enable**
3. Bên trái: **OAuth consent screen** → **Create** → chọn **External** → điền:
   - App name: `Toolify.vn`
   - User support email: email của bạn
   - Developer contact: email của bạn
   → **Save and Continue** (bỏ qua các bước scopes không cần thiết)
4. Bên trái: **Credentials** → **Create Credentials → OAuth client ID** → **Web application**
   - Name: `Toolify Web`
   - **Authorized redirect URIs**: `https://<your-project>.supabase.co/auth/v1/callback`
     > Thay `<your-project>` bằng project ID thật của bạn (xem trong Supabase → Settings → General)
   - Nhấn **Create** → copy **Client ID** và **Client Secret**

> **Trên Supabase Dashboard:**
5. Vào Supabase → **Authentication → Providers** → click vào **Google**
6. Bật **Enable Sign in with Google**
7. Paste Client ID + Client Secret vào → **Save**

### A4. Tạo GitHub OAuth ⏱ 5 phút
> **Trên GitHub:**
1. Vào https://github.com/settings/developers → **New OAuth App**
2. Điền:
   - **Application name**: `Toolify.vn`
   - **Homepage URL**: `https://toolify.vn` (hoặc `http://localhost:3000` khi dev local)
   - **Authorization callback URL**: `https://<your-project>.supabase.co/auth/v1/callback`
3. Nhấn **Register application** → copy **Client ID**
4. Nhấn **Generate a new client secret** → copy **Client Secret**

> **Trên Supabase Dashboard:**
5. Vào Supabase → **Authentication → Providers** → click vào **GitHub**
6. Bật **Enable Sign in with GitHub**
7. Paste Client ID + Client Secret vào → **Save**

### A5. Bật Email Auth (mặc định đã có, kiểm tra lại) ⏱ 2 phút
1. Vào Supabase → **Authentication → Providers** → click vào **Email**
2. Đảm bảo **Enable Sign in with Email** đã bật
3. Kiểm tra phần **Confirm email** — có thể tắt nếu muốn user không cần xác nhận email (OK cho dev)

---

## PHẦN B — SCRAPING 4 SÀN TMĐT VN ⏱ TỔNG 2-4 NGÀY

### B1. Shopee Affiliate ⏱ 30 phút
1. Vào https://affiliate.shopee.vn → Đăng ký tài khoản affiliate
2. Xác minh danh tính (CMND/CCCD + ảnh selfie)
3. Chờ duyệt 1-3 ngày làm việc
4. Sau khi duyệt → API Center → tạo app → lấy:
   - `APP_ID` → `SHOPEE_AFFILIATE_ID`
   - `APP_SECRET` → `SHOPEE_AFFILIATE_KEY`
5. Docs API: https://affiliate.shopee.vn/docs

### B2. Lazada Affiliate ⏱ 30 phút
1. Vào https://affiliate.lazada.vn → Đăng ký
2. Chờ duyệt 2-5 ngày
3. Sau duyệt → Tools → API Access → tạo key
4. Lấy `API Key` → `LAZADA_AFFILIATE_KEY`
5. Docs: https://lazada-developers.openresty.com/

### B3. Tiki Affiliate ⏱ 30 phút
1. Vào https://affiliate.tiki.vn → Đăng ký
2. Chờ duyệt 1-3 ngày
3. Sau duyệt → Dashboard → API → lấy:
   - `Account ID` → `TIKI_AFFILIATE_ID`
   - `API Key` → `TIKI_AFFILIATE_KEY`
4. Docs: https://affiliate.tiki.vn/help

### B4. TikTok Shop Affiliate ⏱ 1 giờ
1. Vào https://seller-th.tiktok.com → Đăng ký TikTok Shop Partner
2. Tạo app trên https://developers.tiktok.com → TikTok Shop API
3. Apply for Production access (cần KYC + giấy phép kinh doanh nếu production)
4. Lấy:
   - `App Key` → `TIKTOK_SHOP_APP_KEY`
   - `App Secret` → `TIKTOK_SHOP_APP_SECRET`
5. Docs: https://developers.tiktok.com/doc/tiktok-shop-api-overview

### B5. Cron job thu thập giá (sau khi có API) ⏱ 1 giờ setup
1. Vào Vercel Dashboard → Project → Settings → Crons
2. Tạo 4 cron jobs:
   - Mỗi 6 giờ: gọi `/api/cron/scrape-shopee`
   - Mỗi 6 giờ: gọi `/api/cron/scrape-lazada`
   - Mỗi 6 giờ: gọi `/api/cron/scrape-tiki`
   - Mỗi 6 giờ: gọi `/api/cron/scrape-tiktok`
3. Mỗi cron sẽ trigger hàm scrape → lưu vào `price_history`
4. **Gửi tôi URL cron** để tôi viết code scrape.

---

## PHẦN C — SCHOLARSHIPS & COURSES ⏱ TỔNG 2 GIỜ

### C1. Đăng ký Coursera for Education ⏱ 30 phút
> ⚠️ Link gốc https://www.coursera.org/courseraplusforeducation không truy cập được ở VN.
> **Cách thay thế**: Vào https://www.coursera.org → tài khoản cá nhân → tìm mục **Financial Aid** cho từng course nếu cần miễn phí.
> Nếu cần API access thật → liên hệ Coursera Partner team qua https://www.coursera.org/about/partners

### C2. Đăng ký edX Partner ⏱ 1 giờ
> ⚠️ Link gốc https://www.edx.org/partners không truy cập được ở VN.
> **Cách thay thế**: Liên hệ trực tiếp qua email partners@edx.org hoặc vào https://www.edx.org/schools-partners để tìm thông tin chương trình đối tác.

### C3. Manually seed initial scholarships ⏱ 1 giờ
Database đang trống — cần insert 30-50 scholarship records đầu tiên từ các nguồn:
- https://www.chevening.org/scholarships/who-can-apply/
- https://erasmus-plus.ec.europa.eu/opportunities
- https://foreigndegrees.com (VN-based aggregator)
- https://www.scholarshipportal.com

**Gửi tôi**: danh sách 30 scholarship URLs bạn muốn tôi crawl → tôi sẽ viết script.

---

## PHẦN D — TELEGRAM BOT ⏱ 30 PHÚT

1. Mở Telegram → tìm `@BotFather`
2. Gửi `/newbot` → đặt tên `Toolify Alerts Bot`
3. Copy token → `TELEGRAM_BOT_TOKEN`
4. Tạo channel/group: `t.me/toolify_alerts`
5. Cài webhook:
   ```bash
   curl -X POST "https://api.telegram.org/bot<TOKEN>/setWebhook" \
        -d "url=https://toolify.vn/api/telegram/webhook"
   ```
6. **Gửi tôi**: token để tôi code webhook handler.

---

## PHẦN E — EMAIL SERVICE ⏱ 15 PHÚT

### Resend (khuyến nghị — free 100 email/ngày)
1. Vào https://resend.com → Sign up
2. **Add Domain** → `toolify.vn`
3. Resend sẽ cung cấp 3 DNS records (CNAME, TXT) → thêm vào DNS provider
4. Chờ verify (~5 phút)
5. **API Keys** → Create → copy → `RESEND_API_KEY`

---

## PHẦN F — DOMAIN & DEPLOY ⏱ 1 GIỜ

### F1. Mua domain toolify.vn ⏱ 10 phút
1. Vào https://www.matbao.vn hoặc https://www.pavietnam.vn
2. Tìm `toolify.vn` → Add to cart
3. Thanh toán ~150-300k/năm
4. Verify email → domain active sau 5 phút

### F2. Trỏ DNS về Vercel ⏱ 15 phút
1. Vào Vercel (https://vercel.com) → Sign up bằng GitHub
2. Import project `toolify-vn` từ GitHub repo
3. Vào **Settings → Domains** → Add `toolify.vn` + `www.toolify.vn`
4. Vercel sẽ cho 4 DNS records:
   - 2 A records (apex domain)
   - 1 CNAME www
   - 1 TXT (verification)
5. Vào DNS provider → thêm đúng records
6. Chờ ~10 phút DNS propagate

### F3. Environment variables trên Vercel ⏱ 10 phút
1. Vercel → Project → Settings → Environment Variables
2. Paste tất cả giá trị từ file `.env.local`
3. **Production** scope
4. Save → redeploy

---

## PHẦN G — ANALYTICS & MONITORING ⏱ 30 PHÚT

### G1. Google Analytics 4
1. Vào https://analytics.google.com → Create Account
2. Property name: `Toolify.vn`
3. Copy `Measurement ID` (G-XXXXXXX) → `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### G2. PostHog (product analytics)
1. Vào https://posthog.com → Sign up free
2. Create project `toolify-vn`
3. Copy `Project API Key` → `NEXT_PUBLIC_POSTHOG_KEY`

### G3. Sentry (error tracking)
1. Vào https://sentry.io → Sign up
2. Create project → Next.js → copy DSN
3. Paste vào `NEXT_PUBLIC_SENTRY_DSN`

---

## PHẦN H — NỘI DUNG & PHÁP LÝ ⏱ TỔNG 3-5 NGÀY

### H1. Terms of Service & Privacy Policy ⏱ outsource
- Khuyến nghị thuê luật sư hoặc dùng https://www.termsfeed.com (~$50)
- Bắt buộc trước khi launch thật

### H2. Đăng ký hộ kinh doanh ⏱ 2 ngày
Khi bắt đầu có doanh thu > 100 triệu/năm hoặc muốn xuất VAT:
1. UBND Quận/Huyện nơi cư trú → đăng ký HKD cá thể
2. Phí: ~100-300k/năm
3. Cần: CMND + sổ hộ khẩu (photo)

### H3. Kết nối payment gateway ⏱ 1-2 tuần
- **PayOS**: https://payos.vn → đăng ký merchant → KYC → ~7 ngày
- **Momo Business**: https://business.momo.vn → tương tự
- **VNPay**: https://vnpay.vn → doanh nghiệp phải có MST

---

## PHẦN I — MARKETING (NGOÀI CODE) ⏱ LIÊN TỤC

| Việc | Tần suất | Công cụ |
|------|----------|---------|
| Đăng bài TikTok về học bổng | 3-5 lần/tuần | CapCut + điện thoại |
| Chia sẻ deal lên Facebook groups SV | Hàng ngày | Facebook |
| Trả lời comment trên Telegram | Hàng ngày | Telegram |
| Viết blog SEO về "học bổng X" | 2-3 bài/tuần | Notion + Next.js blog (sẽ build) |
| KOL partnership (reviewers TikTok) | Hàng tháng | Liên hệ qua email |

---

## CHECKLIST TỔNG — BẠN LÀM SONG SONG VỚI AI

### ✅ Ngay hôm nay (30 phút)
- [ ] Tạo file `.env.local` (copy từ template trên)
- [ ] Tạo tài khoản GitHub nếu chưa có
- [ ] Push code lên GitHub (chạy `git init && git add . && git commit -m "init" && git remote add origin ...`)

### ✅ Tuần này (2 giờ)
- [ ] Đăng ký Supabase + chạy schema SQL (A1, A2)
- [ ] Mua domain `toolify.vn` (F1)
- [ ] Tạo Telegram bot (Phần D)
- [ ] Tạo Resend account (Phần E)

### ✅ Tuần sau (3 giờ)
- [ ] Đăng ký 4 affiliate programs (B1-B4) — chờ duyệt 2-5 ngày
- [ ] Đăng ký Google Analytics + PostHog (G1, G2)
- [ ] Trỏ DNS về Vercel (F2)
- [ ] Deploy lên Vercel (F3)

### ✅ Trong 2 tuần tới
- [ ] Nhận affiliate API keys → gửi tôi để wire
- [ ] Đăng ký Coursera + edX (C1, C2)
- [ ] Seed 30 scholarships đầu tiên (C3)
- [ ] Test toàn bộ flow end-to-end

### ✅ Trước khi launch
- [ ] Viết Terms of Service + Privacy Policy (H1)
- [ ] Đăng ký HKD cá thể (H2)
- [ ] Kết nối payment gateway (H3)
- [ ] Tạo content marketing plan

---

## 🤝 ĐIỀU PHỐI VỚI AI

Khi bạn hoàn thành mỗi mục trên, hãy báo cho tôi:
- "Đã có Supabase URL + key" → tôi sẽ wire auth ngay
- "Đã có Shopee API key" → tôi sẽ viết code scrape Shopee
- "Đã deploy lên Vercel" → tôi sẽ fix mọi bug production
- "Đã có domain" → tôi sẽ setup SEO meta + Open Graph

Tôi sẽ **không** dừng coding — sẽ tiếp tục build:
- [ ] Trang `/dashboard` cho user sau login
- [ ] Trang chi tiết `/tools/scholarship/[id]` cho SEO
- [ ] Trang `/blog` để viết content SEO
- [ ] Email templates cho alerts
- [ ] Telegram bot handler
- [ ] Admin dashboard để bạn tự thêm scholarship

---

## PHẦN J — AUTH, DASHBOARD & ADMIN (ĐÃ CÓ SẴN, CẦN NÂNG CẤP KHI WIRE BACKEND)

### J1. Cấu trúc hiện tại ⏱ 0 phút (đã có)
Code đã có sẵn flow hoàn chỉnh — chạy được ngay trên localStorage để demo:

| Route | Mô tả | Quyền |
|---|---|---|
| `/login` | Đăng nhập | Public |
| `/signup` | Đăng ký | Public |
| `/dashboard` | Trang cá nhân người dùng (Tổng quan / Đã lưu / Cài đặt) | Cần đăng nhập |
| `/admin` | Tổng quan admin | Chỉ admin |
| `/admin/products` | CRUD sản phẩm theo dõi | Chỉ admin |
| `/admin/tools` | Bật/tắt hiển thị từng công cụ | Chỉ admin |
| `/admin/votes` | Xem kết quả bình chọn tool #3 | Chỉ admin |
| `/tools/price-recommend` | Chatbot gợi ý giá AI (mới) | Public |

### J2. Tài khoản demo ⏱ 0 phút
Đã seed sẵn tài khoản admin (luôn được khôi phục nếu user xoá nhầm):

- **Email**: `admin@toolify.vn`
- **Mật khẩu**: `admin123`
- **Role**: `admin`

Đăng nhập → tự redirect `/admin`. User đăng ký thường sẽ có role `user` → redirect `/dashboard`.

### J3. Nghiệp vụ phân quyền ⏱ 15 phút (cần làm khi wire Supabase)

**Quy tắc hiện tại trong code:**
- Mọi user đều xem được công cụ công khai (`/tools/*`).
- `useAuth()` trả `{ user, isAdmin, login, signup, logout }` — mọi component có thể dùng.
- `app/admin/layout.tsx` chặn: nếu `!user` → `/login`; nếu `!isAdmin` → `/dashboard`.
- `app/dashboard/page.tsx` chặn: nếu `!user` → `/login`.

**Khi wire Supabase:**
1. Thay `AuthProvider` (file `components/providers/AuthProvider.tsx`) bằng `@supabase/supabase-js`:
   ```ts
   import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
   // trong useEffect: const { data: { session } } = await supabase.auth.getSession();
   ```
2. Bảng `profiles` (đã có schema trong PHẦN A) chứa cột `role` (enum `'admin' | 'user'`).
3. Trong Supabase Dashboard → SQL Editor, chạy thêm:
   ```sql
   -- Phân quyền: chỉ admin mới vào được /admin
   alter table public.profiles enable row level security;
   create policy "profiles_select_self_or_admin" on public.profiles
     for select using (auth.uid() = id or auth.jwt() ->> 'role' = 'admin');
   ```
4. Trong code, lấy role bằng `supabase.from('profiles').select('role').eq('id', session.user.id).single()` rồi set vào context — phần còn lại của code không cần đổi.

### J4. CRUD sản phẩm (admin) ⏱ 30 phút (khi có DB)
Hiện tại `/admin/products` lưu vào `localStorage`. Khi wire Supabase:

1. Bảng `products` đã có sẵn schema trong PHẦN A2 — copy nguyên.
2. Trong `app/admin/products/page.tsx`, thay `readProducts()` / `writeProducts()` bằng:
   ```ts
   const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
   await supabase.from('products').insert({ name, category, price, url, active });
   await supabase.from('products').update({...}).eq('id', id);
   await supabase.from('products').delete().eq('id', id);
   ```
3. Enable RLS:
   ```sql
   alter table public.products enable row level security;
   create policy "products_admin_all" on public.products
     for all using (auth.jwt() ->> 'role' = 'admin');
   ```

### J5. Công cụ Gợi ý giá AI ⏱ cần backend thật
Hiện tại `/tools/price-recommend` dùng mock analyzer (URL → phân tích giả). Khi có affiliate API (PHẦN B):

1. Thay hàm `mockAnalyze()` (file `app/tools/price-recommend/page.tsx`) bằng call backend:
   ```ts
   const res = await fetch('/api/analyze', { method: 'POST', body: JSON.stringify({ url }) });
   const data = await res.json();
   ```
2. Tạo route `app/api/analyze/route.ts` gọi 4 sàn song song (Shopee Open API, Lazada Affiliate, Tiki Affiliate, TikTok Shop Open Platform) → cache lịch sử 90 ngày vào Supabase → trả về `{ current, avg, min, max, trend }`.
3. Thêm AI summary: gọi OpenAI/Claude API với prompt tiếng Việt → sinh verdict ngắn gọn.

### J6. Test thủ công flow admin ⏱ 10 phút

Sau khi deploy, kiểm tra theo checklist:

```
[ ] Đăng nhập admin → /admin hiển thị 4 card thống kê
[ ] /admin/products → thêm 1 sản phẩm → reload → vẫn còn (localStorage)
[ ] /admin/products → sửa → xóa → reload
[ ] /admin/tools → tắt "Săn học bổng" → mở /tools → không thấy "Săn học bổng" nữa
[ ] /admin/votes → xem được 3 ứng viên, đếm vote từ localStorage
[ ] Đăng xuất → click /admin → tự đẩy về /login
[ ] Đăng ký user mới → redirect /dashboard
[ ] User thường vào /admin → tự đẩy về /dashboard (không phải /login)
[ ] /tools/price-recommend → dán link → bot reply sau ~1s với analysis card
```

---

## CÂU HỎI THƯỜNG GẶP

**Q: Tôi có cần thẻ tín dụng quốc tế không?**
A: Có — cho Vercel Pro (nếu upgrade), Resend, PostHog, Sentry. Một số free tier đủ dùng cho MVP.

**Q: Mất bao lâu để launch thật?**
A: 4-6 tuần nếu làm song song: tuần 1 setup infra, tuần 2-3 chờ affiliate duyệt + seed data, tuần 4-5 build dashboard + test, tuần 6 launch beta.

**Q: Tôi có cần thuê dev không?**
A: Không cần nếu bạn quen với Next.js + Git. Tôi có thể handle toàn bộ phần code. Bạn tập trung vào: API keys, content, marketing.

**Q: Domain `.vn` có đắt hơn `.com` không?**
A: `.vn` ~150-300k/năm, `.com` ~250k/năm. Gần tương đương.

**Q: Có cần công ty để ký hợp đồng với affiliate không?**
A: Không — HKD cá thể đủ cho Shopee/Lazada. Tiki và TikTok Shop yêu cầu doanh nghiệp có MST nếu scale lớn.

**Q: Tài khoản admin có bị user xoá mất không?**
A: Không — seed admin được `AuthProvider` tự khôi phục mỗi lần load trang (xem file `components/providers/AuthProvider.tsx`, hàm `readUsers`).

**Q: Khi nào cần chuyển từ localStorage sang Supabase?**
A: Ngay khi bạn muốn nhiều thiết bị đăng nhập cùng tài khoản, hoặc khi bắt đầu có user thật. Làm theo PHẦN J3 ở trên — chỉ thay 1 file provider, các trang khác không cần đổi.

---

Bạn có câu hỏi gì về manual steps không? Hỏi ngay tôi sẽ hướng dẫn chi tiết từng bước.