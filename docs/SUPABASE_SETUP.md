# Hướng dẫn tạo Supabase project mới

> Tại sao cần làm việc này: Project Supabase cũ đã bị khóa / hết quota. Để toolify login Google/GitHub hoạt động, ta cần một project Supabase mới với credentials hợp lệ.

## Bước 1 — Tạo tài khoản / đăng nhập

Mở: <https://supabase.com/dashboard>

- Nếu chưa có tài khoản: bấm **Sign up** (Google / GitHub / email).
- Nếu có rồi: bấm **Sign in**.

## Bước 2 — Tạo project mới

1. Trong dashboard, bấm **New project** (góc trên bên trái).
2. **Organization**: chọn cá nhân (hoặc org bạn đang dùng).
3. **Name**: đặt `toolify-prod` (viết thường, không dấu, gạch ngang).
4. **Database password**:
   - Đặt một password mạnh (>= 12 ký tự).
   - **Lưu lại vào password manager** (vd. Bitwarden / 1Password).
   - Toolify KHÔNG cần password này — chỉ Supabase dùng để admin DB. Không cần đưa vào `.env.local`.
5. **Region**: chọn **Singapore** (`ap-southeast-1`) — gần Việt Nam nhất trong free tier.
6. **Pricing plan**: chọn **Free** (đủ cho use case cá nhân).
7. Bấm **Create new project**.

## Bước 3 — Chờ project khởi tạo

- Mất khoảng **1–2 phút** (status badge sẽ chuyển từ `CREATING` sang `ACTIVE_HEALTHY`).
- Có thể đóng tab — Supabase gửi email khi ready.

## Bước 4 — Lấy API keys

Trong project Supabase vừa tạo:

1. Vào **Project Settings** (icon bánh răng, thanh trái) → **API**.
2. Copy 3 giá trị sau (cần cả 3):

| Tên hiển thị | Format | Dùng cho biến env |
|--------------|--------|-------------------|
| **Project URL** | `https://abcdefghijk.supabase.co` | `NEXT_PUBLIC_SUPABASE_URL` |
| **Project API keys → `anon` `public`** | Chuỗi JWT dài ~200 ký tự, bắt đầu `eyJ...` | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| **Project API keys → `service_role` `secret`** | Chuỗi JWT dài ~200 ký tự, bắt đầu `eyJ...` | `SUPABASE_SERVICE_ROLE_KEY` |

> ⚠️ **service_role key có full quyền admin DB** — không bao giờ commit vào git, không đưa cho browser. File `.env.local` đã được `.gitignore` nên an toàn.

Cách kiểm tra key đúng format:
- Mở key ra, nếu thấy 3 đoạn phân cách bởi dấu `.` và đoạn giữa giải mã base64 ra JSON có `"role": "anon"` hoặc `"role": "service_role"` → đúng.
- Nếu chỉ thấy chuỗi hex / random không có `eyJ` ở đầu → copy nhầm, kiểm tra lại tab.

## Bước 5 — Bật Auth providers (optional nhưng khuyến nghị)

Vào **Authentication** (thanh trái) → **Providers**:

- **Email**: mặc định đã bật, giữ nguyên.
- **Google** (khuyến nghị cho OAuth):
  1. Bật toggle Enable.
  2. Cần tạo OAuth credentials ở [Google Cloud Console](https://console.cloud.google.com/apis/credentials) — Authorized redirect URI:
     ```
     https://<project-ref>.supabase.co/auth/v1/callback
     ```
  3. Copy `Client ID` + `Client secret` dán vào Supabase → Save.
- **GitHub** (optional):
  1. Tạo OAuth app ở <https://github.com/settings/developers> → callback URI cũng là:
     ```
     https://<project-ref>.supabase.co/auth/v1/callback
     ```
  2. Copy Client ID + Client secret dán vào Supabase.

> Nếu chưa có OAuth credentials, **bỏ qua bước này** — Email login vẫn hoạt động. OAuth có thể bật sau.

## Bước 6 — Chạy schema SQL

Toolify có 1 schema cần chạy trong Supabase SQL Editor:

1. Vào **SQL Editor** (thanh trái) → **New query**.
2. Paste nội dung file: `apps/web/supabase/price-cache-schema.sql`.
3. Bấm **Run** (hoặc Ctrl+Enter).

File SQL sẽ tạo bảng `price_cache` (cache cho price-scraper, không liên quan đến auth). An toàn chạy nhiều lần (dùng `IF NOT EXISTS`).

> Nếu sau này thêm schema mới, copy từ `apps/web/supabase/*.sql` rồi chạy trong SQL Editor.

## Bước 7 — Cập nhật `.env.local` & restart

Mở file `D:\Startup-BA\.env.local` trong editor và thay đúng **3 dòng** sau (xóa placeholder, dán giá trị thật):

```env
NEXT_PUBLIC_SUPABASE_URL='https://YOUR_NEW.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
SUPABASE_SERVICE_ROLE_KEY='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
```

> **Lưu ý cú pháp**: giữ nguyên dấu `=` và cặp nháy đơn `'` quanh giá trị. Nếu thiếu nháy, Docker Compose sẽ không parse được.

Sau khi save, rebuild & restart container web:

```powershell
cd D:\Startup-BA
docker-compose up -d --build web
```

Lệnh này chỉ rebuild `web` (cần env mới), giữ nguyên 3 sidecar khác (`agent-runner`, `watermark-remover`, `pdf-translator`).

## Bước 8 — Verify credentials

Sau khi container `web` chạy lại (~30 giây), test:

```powershell
# Health check (bắt buộc OK trước khi test key)
curl.exe http://localhost:3000/api/health

# Test login page render (sẽ ra HTML / redirect)
curl.exe -I http://localhost:3000/login
```

Nếu đăng nhập Google/GitHub vẫn báo lỗi `chưa kết nối`:

1. Vào container `web` xem env đã load chưa:
   ```powershell
   docker exec toolify-web env | Select-String -Pattern "SUPABASE"
   ```
   Kỳ vọng thấy 3 biến có giá trị thật (không phải `YOUR_NEW` / placeholder).

2. Test trực tiếp key với Supabase REST API:
   ```powershell
   curl.exe "https://<project-ref>.supabase.co/rest/v1/?apikey=<anon-key>" -H "Authorization: Bearer <anon-key>"
   ```
   Nếu trả JSON `{...}` (không phải empty / 401) → key OK.

## Troubleshooting

| Triệu chứng | Nguyên nhân thường gặp | Cách xử lý |
|-------------|----------------------|-----------|
| Login báo `Invalid API key` | Copy nhầm `service_role` vào `anon` (hoặc ngược lại) | Quay lại Project Settings → API, copy lại đúng ô |
| Container crash ngay khi start với env mới | Sai cú pháp `.env.local` (thiếu nháy, có ký tự escape lạ) | Mở file bằng VSCode, kiểm tra encoding UTF-8 + không có BOM |
| Google OAuth redirect về loop | Callback URI chưa add vào Google Cloud Console | Thêm đúng `https://<ref>.supabase.co/auth/v1/callback` |
| `permission denied for table price_cache` | Chưa chạy `price-cache-schema.sql` | Quay lại Bước 6 |

## Không cần làm

- ❌ Không cần tạo database mới trong Supabase — project mới đã có sẵn `postgres`.
- ❌ Không cần config CORS — Next.js chạy cùng origin với Supabase Auth.
- ❌ Không cần add vào `.env.example` (file này là template, không commit giá trị thật).
- ❌ Không cần restart `agent-runner` / `watermark-remover` / `pdf-translator` — chúng không đụng Supabase.

---

**Tóm tắt**: Tạo project → lấy 3 key → dán vào `.env.local` → `docker-compose up -d --build web`. Mất khoảng **5–10 phút** end-to-end (bao gồm chờ Supabase khởi tạo).
