# Tích hợp Toolify + Claude Commerce Agents

> Ghi chú kỹ thuật cho việc tích hợp `anthropics/commerce-agents` vào Toolify.vn.
> Cập nhật: 2026-09-09

---

## ✅ Đã hoàn thành

### 1. Setup môi trường Python

| Bước | Trạng thái | Chi tiết |
|---|---|---|
| Cài `uv` (Python package manager) | ✅ | `~/.local/bin/uv.exe` — binary local, không cần admin |
| Tạo venv Python 3.12.14 | ✅ | `D:\Startup-BA\commerce-agents-temp\.venv` |
| Cài 47 packages | ✅ | `requirements.txt` — 7 editable packages + Anthropic SDK 0.122 |

### 2. Vietnamese StorefrontBackend

File: `commerce-agents-temp/backend_vn.py`

| Tính năng | Triển khai |
|---|---|
| **Catalog** | 18 sản phẩm phổ biến VN: iPhone 15, MacBook M3, Samsung S24, Xiaomi 14T, Dell, ASUS ROG, AirPods Pro 2, Sony XM5, iPad Pro M4, Galaxy Tab S9, Apple Watch S9, Galaxy Watch 6, Anker, Logitech, SanDisk SSD, Uniqlo, sách Đắc Nhân Tâm |
| **Giá 4 sàn** | Mỗi sản phẩm có `store_prices` riêng: Shopee, Lazada, Tiki, TikTok Shop |
| **Currency** | VND (đồng) |
| **Search** | Keyword + synonym + filter (category, price range) |
| **Cart** | In-memory per session, add/update/remove |
| **Orders** | 2 demo orders (DH001, DH002) |
| **Policies** | 5 chính sách VN: shipping, return, warranty, payment, fake |
| **Disclosures** | Auto-generate price facts box cho mỗi sản phẩm |
| **Fulfillment** | 2 options: delivery (2-5 ngày) + pickup (1 ngày) |

**Test đã chạy OK** — `backend_vn_test.py`:
- Search "iphone" → 5 kết quả
- Search "laptop" + filter giá → 5 kết quả
- Add/remove cart → OK
- Disclose giá → rows cho 4 sàn + rating

### 3. Entry point cho Agent SDK

File: `commerce-agents-temp/shopping-agent/runtime-agent-sdk/main_vn.py`

Sử dụng:
```bash
cd D:\Startup-BA\commerce-agents-temp
.venv\Scripts\python.exe shopping-agent/runtime-agent-sdk/main_vn.py --once "tìm iphone 15"
```

### 4. Redesign UI — "Precision Studio"

**Files đã update:**

| File | Thay đổi |
|---|---|
| `tailwind.config.ts` | Palette mới: brand `#2563eb` (electric blue), depth `#7c3aed` (violet), surface warm off-white, ink warm black. Shadow system: `card`, `card-hover`, `float`, `elevated`, `glass`, `brand`, `glow`, `hard`. Animations: `orb-1`, `orb-2` |
| `app/globals.css` | Tokens mới, refined shadows, noise texture utility, glass-card component, accent-underline, semantic keyframes |
| `components/hero/Hero3D.tsx` | **Vision Pro-inspired three.js scene** — 4 floating cards với shadow planes, soft volumetric lighting (warm key + cool fill + brand rim), particle field brand blue, mouse parallax. Loại bỏ generic radial-gradient blur40px |
| `components/hero/Hero.tsx` | Refined typography, grain texture overlay, no 3D-tilt rotation effects. Two preview cards với top accent gradient line. Reduced logo marquee saturation |
| `components/sections/Tools.tsx` | Bỏ rotateY 3D tilt + scale animations. Cards có top accent gradient line thay vì full gradient border. Lucide icons cho bullets |
| `components/sections/Features.tsx` | Lucide icons thật (Zap, Shield, Bell, BadgeCheck, Users, Sparkles), bỏ empty `<span>` icon placeholders + rotateY animation. Icon trong branded bg circle |
| `components/sections/Pricing.tsx` | Bỏ scale-85 → scale-1 + scale lg:scale-[1.02]. Featured card có top accent gradient. Lucide Check icons cho features |
| `components/sections/Mission.tsx` | Refined copy, tracking-tight headings, top accent gradient cho main card |
| `components/sections/VoteTool.tsx` | Refined copy, refined typography |
| `components/sections/CTA.tsx` | Top accent gradient line, refined copy |
| `components/layout/Footer.tsx` | Subtle top gradient accent line (brand → depth), live status indicator |
| `components/layout/Navigation.tsx` | Active state với white bg + border + shadow-sm (refined) |
| `app/tools/page.tsx` | Hub page với top accent gradient line, refined cards |
| `app/tools/scholarship/page.tsx` | Header có radial gradient background, StatCells dùng card style thay vì joined grid, ScholarshipCard có hover gradient line |
| `app/tools/price-smart/components/Hero.tsx` | Updated radial gradient color (cyan → electric blue) |

**Build verified:** ✅ Tất cả 17 pages compile không lỗi

### 5. Frontend polish + a11y pass (2026-09-09)

| Cải tiến | File | Chi tiết |
|---|---|---|
| **prefers-reduced-motion** | `components/hero/Hero3D.tsx` | React `useState` + `useEffect` lắng nghe `matchMedia('(prefers-reduced-motion: reduce)')`. Khi người dùng bật "reduce motion", fallback sang `<div>` gradient tĩnh (radial brand→depth) thay vì khởi tạo THREE.js scene, không tốn GPU. `mousemove` parallax cũng tắt. Listen qua `mql.addEventListener('change', …)` để swap scene khi setting thay đổi live. |
| **Build verification** | — | `npm run build` pass clean: 18 routes, home bundle 143 kB, không warning. |
| **Lint pass** | `.eslintrc.json` (new), `app/admin/products/page.tsx` | Tạo `.eslintrc.json` extending `next/core-web-vitals` để `npm run lint` chạy được. Fix 2 lỗi `react/no-unescaped-entities` (escape `"`). Sau fix: `✔ No ESLint warnings or errors`. |
| **Smoke test HTTP** | — | 11/11 routes trả 200 OK qua `Invoke-WebRequest`. HTML audit: 0 `<img>` thiếu alt; inputs có label hoặc aria-label đầy đủ. |
| **A11y inputs** | `app/tools/scholarship/page.tsx`, `app/tools/price-smart/components/PriceInput.tsx` | Thêm `aria-label` cho 2 input search free-text (chỉ có placeholder, không có label liên kết). |
| **`color-scheme: light`** | `app/globals.css` | Set `color-scheme: light` ở `:root` để UA render scrollbar / form controls theo light scheme ngay cả khi OS đang ở dark mode — tránh native widget clashing với warm-light design system. |
| **Admin polish — mock data labels** | `app/admin/page.tsx` | Trang `/admin` trước đây hiển thị biểu đồ mock và nói "cập nhật realtime từ localStorage" → gây hiểu nhầm. Sửa copy + thêm badge "Dữ liệu minh họa" cho 4 khu vực có mock data (Lượt xem chart, Phân bổ danh mục, Hoạt động hệ thống, Trạng thái kỹ thuật). |
| **Admin page polish** | `app/admin/*` | Các trang admin (overview, products, tools, votes) đã được redesign ở session trước — breadcrumb + gradient title + top accent line + empty state với Inbox icon đồng bộ design language. Không cần sửa thêm. |

---

## ✅ Đã hoàn thành

### A. Wire Vietnamese Agent vào Next.js (cần API key)

Đã ship:

1. **Bridge Python** ở `commerce-agents-temp/bridge_vn.py` — subprocess wrapper, expose `POST /analyze` ở `127.0.0.1:8765`, timeout 180 s.
2. **Next.js API route** `app/api/agent/analyze/route.ts` — proxy HTTP tới bridge, validate `input`, forward status upstream, 502 khi bridge down, timeout 180 s.
3. **Hướng dẫn vận hành** trong `INTEGRATION_GUIDE.md` (cách start bridge + dev server, nơi đặt `ANTHROPIC_API_KEY`).

Chỉ còn phụ thuộc operator: cung cấp `ANTHROPIC_API_KEY` trong `.env.local` (hoặc env của Python venv) để bridge trả về kết quả thật.

### B. Cập nhật `lib/price/*` hiện tại

Code hiện tại ở `app/lib/price/` dùng:
- Mock analyzer
- Gemini Search (chưa wire)
- localStorage

Khi wire Agent: chuyển sang gọi Agent microservice thay vì mock.

### C. Polish dashboard / admin pages

Dashboard (`/dashboard`) và admin (`/admin/*`) đã được update nhẹ (font tokens mới), nhưng chưa qua redesign chi tiết. Làm sau khi core flows ổn định.

---

## 📋 Quick start commands

```bash
# 1. Verify backend VN hoạt động (không cần API key)
cd D:\Startup-BA\commerce-agents-temp
.venv\Scripts\python.exe backend_vn_test.py

# 2. Verify frontend với design mới
cd D:\Startup-BA
npm run build
npm run dev

# 3. Test Agent SDK CLI (cần ANTHROPIC_API_KEY trong .env)
# Tạo .env tại commerce-agents-temp/.env:
#   ANTHROPIC_API_KEY=sk-ant-xxx
cd D:\Startup-BA\commerce-agents-temp
.venv\Scripts\python.exe shopping-agent/runtime-agent-sdk/main_vn.py --once "tìm iphone 15 dưới 25 triệu"
```

---

## 🎨 Design Direction — "Precision Studio"

**Triết lý:**
- Warm off-white background (không cold gray) — `#fafaf9`
- Electric blue accent (Vision Pro-inspired) — `#2563eb`
- Violet depth accent cho layering — `#7c3aed`
- Layered shadows thay vì harsh borders
- Top accent gradient line cho cards (thay vì full gradient border animation)
- SVG noise texture overlay cho hero
- Refined typography: tight tracking, generous spacing
- Three.js hero: floating UI cards trong 3D space, soft volumetric lighting, particle field brand blue
- Loại bỏ AI-generative tells: 3D rotateY on hover, gradient border animation, big colored glow, generic blobby backgrounds

**Texture system:**
- SVG noise grain overlay trên hero (3% opacity)
- Soft layered shadows (không harsh)
- Top accent gradient line cho featured cards (brand → depth)

**Color sync across pages:**
- Mọi page dùng cùng `--brand`, `--depth`, `--ink`, `--surface`
- Featured/CTA cards có top accent gradient (brand → depth)
- Eyebrow labels dùng brand color
- Active states dùng ink + border + shadow-sm