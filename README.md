# Toolify.vn

Nền tảng công cụ thông minh cho người Việt: săn học bổng quốc tế, so sánh giá 4 sàn TMĐT, theo dõi lịch sử giá và phát hiện giá ảo.

## Tech Stack

| Layer | Công nghệ |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS với custom design tokens |
| Animation | Framer Motion, GSAP, Lenis smooth scroll |
| 3D | React Three Fiber + Three.js + Drei |
| Icons | Lucide React |
| Auth (mock) | localStorage + React Context |
| Backend | TBD (Supabase đang chờ setup — xem HUONG_DAN.md Phần J) |

## Cài đặt

```bash
# Cài dependencies
npm install

# Dev server
npm run dev
# → Mở http://localhost:3000

# Production build
npm run build
npm start
```

## Tài khoản demo

| Email | Mật khẩu | Role |
|---|---|---|
| `admin@toolify.vn` | `admin123` | **Admin** → `/admin` |

User đăng ký mới sẽ có role `user` → `/dashboard`. Tài khoản admin được tự động khôi phục nếu bị xoá nhầm.

## Các trang

| Route | Mô tả | Ghi chú |
|---|---|---|
| `/` | Trang chủ | Hero 3D, 3 công cụ, pricing, vote |
| `/login` | Đăng nhập | Form → redirect admin/user |
| `/signup` | Đăng ký | → redirect `/dashboard` |
| `/dashboard` | Sản phẩm của tôi | Cần đăng nhập |
| `/admin` | Tổng quan | Chỉ admin |
| `/admin/products` | CRUD sản phẩm | Chỉ admin |
| `/admin/tools` | Bật/tắt công cụ | Chỉ admin |
| `/admin/votes` | Kết quả bình chọn | Chỉ admin |
| `/tools` | Tất cả công cụ | Public |
| `/tools/scholarship` | Săn học bổng | Public |
| `/tools/price-compare` | So sánh giá | Public |
| `/tools/price-recommend` | Gợi ý giá AI (chat) | Public |

## Cấu trúc dự án

```
toolify-vn/
├── app/                          # Next.js App Router
│   ├── layout.tsx                # Root layout (AuthProvider + SmoothScrollProvider)
│   ├── page.tsx                  # Trang chủ
│   ├── login/page.tsx
│   ├── signup/page.tsx
│   ├── dashboard/page.tsx        # User dashboard (Tổng quan / Đã lưu / Cài đặt)
│   ├── admin/                    # Admin panel (role-gated)
│   │   ├── layout.tsx           # Sidebar nav + access guard
│   │   ├── page.tsx             # Tổng quan thống kê
│   │   ├── products/page.tsx    # CRUD sản phẩm
│   │   ├── tools/page.tsx        # Bật/tắt công cụ
│   │   └── votes/page.tsx        # Kết quả bình chọn
│   └── tools/
│       ├── page.tsx              # Hub tất cả công cụ
│       ├── scholarship/page.tsx
│       ├── price-compare/page.tsx
│       └── price-recommend/page.tsx  # Chatbot gợi ý giá
├── components/
│   ├── hero/
│   │   ├── Hero.tsx              # Hero content + GSAP animation
│   │   └── Hero3D.tsx           # R3F 3D scene
│   ├── layout/
│   │   ├── Navigation.tsx         # Fixed nav + scroll-spy anchor active
│   │   └── Footer.tsx
│   ├── providers/
│   │   ├── AuthProvider.tsx       # Auth context (localStorage mock)
│   │   └── SmoothScrollProvider.tsx
│   └── sections/                 # Trang chủ sections
│       ├── Tools.tsx, Features.tsx, Pricing.tsx,
│       ├── Mission.tsx, VoteTool.tsx, CTA.tsx
├── lib/
│   ├── constants.ts               # TOOLS, seed data, storage keys, ROUTES
│   ├── types.ts                   # Shared TypeScript interfaces
│   ├── storage.ts                 # Typed localStorage helpers (SSR-safe)
│   └── utils.ts                   # cn() helper (clsx + tailwind-merge)
├── public/
├── tailwind.config.ts             # Brand tokens, container, animations
├── HUONG_DAN.md                   # ⚠️ READ THIS — hướng dẫn manual steps
└── README.md
```

**Quy tắc thêm trang mới:**
- Public page: tạo `app/[slug]/page.tsx`, import `Navigation` + `Footer` riêng.
- Auth-gated page: wrap bằng `useAuth()` hook, check `user` trong `useEffect`.
- Admin page: tất cả trong `app/admin/`, `layout.tsx` đã guard.

## Tầng dữ liệu

| Key localStorage | Dùng bởi | Seed |
|---|---|---|
| `toolify.users` | AuthProvider | ✅ `admin@toolify.vn / admin123` |
| `toolify.session` | AuthProvider | — |
| `toolify.products` | Admin products | ✅ iPhone 15, MacBook Air |
| `toolify.saved` | Dashboard "Đã lưu" | ✅ 2 items |
| `toolify.votes` | Admin votes | ✅ 3 demo votes |
| `toolify.vote_candidates` | Admin votes + VoteTool | ✅ 3 candidates |
| `toolify.admin_tools` | Admin tools, Tools hub | ✅ 3 tools |

Khi chuyển sang Supabase: thay `lib/storage.ts` và `AuthProvider`, giữ nguyên signature — các trang không cần đổi.

## Chuyển sang backend thật

Xem **HUONG_DAN.md → PHẦN J** để biết:
- [ ] Wire Supabase Auth (thay AuthProvider)
- [ ] Wire Supabase DB (thay storage)
- [ ] Wire affiliate API cho so sánh giá
- [ ] Wire AI cho chatbot gợi ý giá

## Scripts

```bash
npm run dev      # Dev server với HMR
npm run build    # Production build
npm run start    # Serve production build
npm run lint     # ESLint
```
