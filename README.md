# Toolify

> Nơi kết nối nhu cầu thực tế với công cụ AI phù hợp — cho sinh viên, founder, freelancer và SMB Việt Nam.

[![GitHub](https://img.shields.io/badge/github-ducnolag%2FStartup--BA-blue)](https://github.com/ducnolag/Startup-BA)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-green.svg)](LICENSE)
[![Python 3.12](https://img.shields.io/badge/python-3.12-blue)](apps/agent-runner)
[![Next.js 14](https://img.shields.io/badge/next.js-14-black)](apps/web)

## Toolify là gì?

Trong thực tế, có rất nhiều vấn đề mà cá nhân và doanh nghiệp gặp phải mỗi ngày nhưng chưa có một công cụ phù hợp để giải quyết. Có những nhu cầu rất cụ thể, chỉ xuất hiện trong một công việc hoặc một nhóm đối tượng nhất định. Toolify ra đời với mong muốn trở thành nơi kết nối giữa nhu cầu thực tế và các công cụ hỗ trợ phù hợp.

Mỗi tool giải quyết một vấn đề cụ thể, dùng chung hạ tầng (domain, database, xác thực). Bắt đầu miễn phí, dùng được ngay cả khi chưa cấu hình API key (chạy ở demo mode).

## Công cụ hiện có

| Tool | Mô tả | Cần API key | Demo mode |
|------|-------|-------------|-----------|
| **Idea-to-Tool** (`/tools/idea-to-tool`) | Mô tả vấn đề → AI gợi ý 3 công cụ + 3 bước hành động. Phân loại 9 danh mục vấn đề. | `GEMINI_API_KEY` | ✓ |
| **Gemini Translate** (`/tools/gemini-translate`) | Dịch giữa 8 ngôn ngữ (Việt, Anh, Trung, Nhật, Hàn, Pháp, Tây Ban Nha, Đức). Giữ nguyên ý và format. | `GEMINI_API_KEY` | ✓ |
| **Mua thông minh** (`/tools/price-smart`) | So sánh giá Shopee/Lazada/Tiki/TikTok Shop, phát hiện giá ảo, gợi ý mua ngay. | (mock data) | Không |
| **Agent Chat** (`/agent`) | Chat với Claude AI bằng tiếng Việt — tìm sản phẩm, so sánh, đặt vào giỏ. | `ANTHROPIC_API_KEY` | graceful error |

## Quickstart với Docker (5 phút)

Yêu cầu: Docker Desktop đang chạy.

```bash
git clone https://github.com/ducnolag/Startup-BA.git
cd Startup-BA
cp .env.example .env
# Mở .env và dán API key (không bắt buộc — chạy được với demo mode):
#   ANTHROPIC_API_KEY=sk-ant-...   (cho Agent Chat)
#   GEMINI_API_KEY=AIza-...         (cho Idea-to-Tool + Gemini Translate)
docker-compose up -d
open http://localhost:3000
```

Mở [http://localhost:3000/tools/idea-to-tool](http://localhost:3000/tools/idea-to-tool) để thử công cụ mới. Agent runner chạy ở `http://localhost:8765` (health check `/health`).

Xem log:
```bash
docker-compose logs -f agent-runner
docker-compose logs -f web
```

Tắt stack: `docker-compose down`.

## Demo mode

Tất cả công cụ Gemini đều chạy được **kể cả khi chưa có `GEMINI_API_KEY`**:
- **Idea-to-Tool**: trả gợi ý mặc định + banner "Demo mode".
- **Gemini Translate**: trả placeholder giải thích.
- **Agent Chat** (cần `ANTHROPIC_API_KEY`): nếu thiếu key, runner trả graceful error không crash.

Lấy Gemini API key miễn phí tại [aistudio.google.com/apikey](https://aistudio.google.com/apikey) (free tier đủ cho mục đích cá nhân, ~15 RPM).

## Cài thủ công (dev mode, hot-reload)

Nếu muốn edit code và thấy thay đổi ngay không cần rebuild image:

### Terminal 1 — Agent runner

```bash
cd apps/agent-runner
python -m venv .venv
.\.venv\Scripts\Activate.ps1     # PowerShell
pip install -r requirements.txt
python -m agent_runner.runner
```

Server chạy ở `http://localhost:8765`. Restart thủ công sau khi sửa code.

### Terminal 2 — Next.js

```bash
cd apps/web
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000). Edit code trong `app/`, `components/`, `lib/` → Next.js tự reload.

## Kiến trúc

```
┌─────────────────┐         ┌──────────────────┐         ┌────────────────┐
│   Browser       │  HTTPS  │   Next.js (web)  │  HTTP   │ Agent Runner   │
│                 │ ───────▶│   :3000          │ ───────▶│   :8765        │
│   React UI      │         │   App Router     │         │ Starlette      │
└─────────────────┘         └──────────────────┘         └────────────────┘
                                      │                           │
                                      ▼                           ▼
                              ┌──────────────────┐        ┌──────────────────┐
                              │ Gemini API       │        │ Anthropic API    │
                              │ (Idea + Translate)│       │ (Agent Chat)     │
                              └──────────────────┘        └──────────────────┘
```

- **Web** (`apps/web/`): Next.js 14 (App Router + Tailwind). Expose các tool ở `/tools/*`. Gọi Gemini trực tiếp từ API routes (`/api/tools/*`).
- **Agent Runner** (`apps/agent-runner/`): Python HTTP server bọc Anthropic SDK + commerce-agents ShoppingAgent. Expose SSE streaming cho `/agent`.
- **Vendor**: `shopping_agent/`, `commerce_common/` được vendor từ Anthropic commerce-agents (commit pin trong `requirements.txt`).

## API keys cần thiết

| Key | Dùng cho | Bắt buộc? | Lấy ở đâu |
|-----|----------|-----------|-----------|
| `ANTHROPIC_API_KEY` | Agent Chat (`/agent`) | Khuyến nghị | [console.anthropic.com](https://console.anthropic.com/) |
| `GEMINI_API_KEY` | Idea-to-Tool, Gemini Translate | Khuyến nghị | [aistudio.google.com/apikey](https://aistudio.google.com/apikey) |
| `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth, dashboard, admin | Tùy chọn | [supabase.com](https://supabase.com/) |

Thiếu key → tool chạy ở demo mode hoặc graceful error. Đủ key → tool chạy với AI thật.

## Cấu trúc project

```
Startup-BA/
├── apps/
│   ├── agent-runner/         # Python 3.12, Starlette HTTP server
│   │   ├── agent_runner/     # Module chính: runner, agent_core
│   │   ├── shopping_agent/   # Vendored commerce-agents core
│   │   ├── shopping_agent_runtime/  # Vendored orchestrator
│   │   ├── commerce_common/  # Vendored shared types
│   │   ├── skills/           # Skill definitions
│   │   ├── tests/
│   │   ├── requirements.txt
│   │   ├── pyproject.toml
│   │   ├── Dockerfile
│   │   └── README.md
│   └── web/                  # Next.js 14 (App Router)
│       ├── app/              # Routes: /, /agent, /admin, /dashboard, /tools/*, /api/…
│       │   ├── tools/
│       │   │   ├── idea-to-tool/      # ← NEW: AI gợi ý công cụ
│       │   │   ├── gemini-translate/  # ← NEW: Dịch đa ngôn ngữ
│       │   │   └── price-smart/
│       │   └── api/tools/             # ← NEW: API cho 2 tool trên
│       ├── components/
│       ├── lib/
│       │   └── gemini/                # ← NEW: Gemini client + prompts
│       ├── public/
│       ├── supabase/
│       ├── package.json
│       ├── next.config.mjs
│       ├── tailwind.config.ts
│       ├── Dockerfile
│       └── README.md
├── docs/                     # Tài liệu kiến trúc (architecture, deployment, business-analysis)
├── services/                 # Services tương lai (merchant-agent, …)
├── scripts/                  # Helper scripts
├── .github/workflows/        # CI/CD
├── .gitignore
├── .dockerignore
├── .env.example
├── docker-compose.yml        # Production-like orchestration
├── docker-compose.dev.yml    # Dev overrides (hot reload)
├── LICENSE
└── README.md
```

## Tech stack

**Agent runner (Python)**
- Python 3.12, Starlette + SSE-Starlette (async HTTP + streaming)
- Anthropic SDK 0.122, commerce-agents ShoppingAgent (vendored)
- Pydantic 2.13 cho schemas

**Web (Next.js)**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS, Framer Motion, GSAP, Lenis
- React Three Fiber / Drei (3D hero)
- Supabase SSR cho auth (optional)
- **Gemini REST API** (Idea-to-Tool + Gemini Translate) — dùng fetch thuần, không cần SDK

**Deployment**
- Docker multi-stage builds
- docker-compose cho local + production-like
- GitHub Actions CI

## Scripts hữu ích

```bash
# Type-check Next.js
cd apps/web
npx tsc --noEmit

# Build production image (không chạy container)
docker-compose build

# Chạy dev compose (override volume mounts + disable healthcheck)
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up
```

## Roadmap

- [ ] Idea-to-Tool: thêm lịch sử gợi ý cho user đã đăng ký
- [ ] Gemini Translate: thêm chế độ batch dịch nhiều file
- [ ] Mua thông minh: thêm Shopee + Lazada APIs (đang dùng mock data)
- [ ] User authentication + lưu lịch sử chat (Supabase)
- [ ] Production deployment lên fly.io / Railway
- [ ] Merchant-agent: cho người bán quản lý catalog và campaigns

## Đóng góp

Xem [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Apache 2.0 — xem [LICENSE](LICENSE).
