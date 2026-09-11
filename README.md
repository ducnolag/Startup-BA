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
| **PDF Translate** (`/tools/pdf-translate`) | Upload PDF (báo, tạp chí, tài liệu) → AI đọc từng trang và dịch sang tiếng Việt hoặc 5 ngôn ngữ khác. Xuất Markdown. | `GEMINI_API_KEY` | ✓ |
| **Watermark Remover** (`/tools/watermark-remover`) | Xoá metadata AI provenance (C2PA / SynthID / EXIF / XMP / doc props) khỏi PDF, DOCX, ảnh. Xử lý local. | (sidecar) | (graceful error) |
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
#   GEMINI_API_KEY=AIza-...         (cho PDF Translate)
docker-compose up -d
open http://localhost:3000
```

Sau khi stack lên, các service sẽ chạy ở:
- Web (Next.js): `http://localhost:3000`
- Agent runner (Claude): `http://localhost:8765` (`/health`)
- Watermark remover (sidecar): `http://localhost:8766` (`/health`)

Công cụ mới nhất: [http://localhost:3000/tools/pdf-translate](http://localhost:3000/tools/pdf-translate) và [http://localhost:3000/tools/watermark-remover](http://localhost:3000/tools/watermark-remover).

Xem log:
```bash
docker-compose logs -f agent-runner
docker-compose logs -f web
docker-compose logs -f watermark-remover
```

Tắt stack: `docker-compose down`.

## Troubleshooting

### Sau khi đổi biến trong `.env`, container vẫn dùng giá trị cũ
Docker compose chỉ inject env khi **tạo container**. Nếu bạn sửa `.env` xong
mà `docker-compose up -d` không rebuild image, container cũ vẫn chạy với env cũ.
Cách chuẩn:

```bash
# Force tạo lại container (giữ nguyên image, chỉ restart với env mới)
docker-compose up -d --force-recreate web

# Hoặc rebuild từ đầu (khi đổi Dockerfile / deps)
docker-compose build web
docker-compose up -d --force-recreate web
```

### PDF Translate báo lỗi `404 Model not found`
Google đã shutdown `gemini-2.0-flash` từ ngày **01/06/2026** (xem
https://ai.google.dev/gemini-api/docs/deprecations). Nếu `.env` của bạn
vẫn ghim `GEMINI_MODEL=gemini-2.0-flash`, đổi sang:
- `gemini-2.5-flash` (phổ biến nhất, multimodal, free tier OK), hoặc
- `gemini-2.5-pro` (chất lượng cao hơn, free tier giới hạn hơn).

Sau đó `docker-compose up -d --force-recreate web` để áp env mới.

### Watermark Remover container không lên
```bash
docker-compose logs watermark-remover
```
Lỗi thường gặp: exiftool / qpdf chưa cài trong image. Re-build:
```bash
docker-compose build watermark-remover
docker-compose up -d watermark-remover
```

### Gemini API rate-limit (429)
Free tier giới hạn ~15 RPM. Service tự trả về message thân thiện; chờ 30s rồi thử
lại. Nếu lặp lại liên tục, cân nhắc nâng cấp API plan hoặc dùng `GEMINI_MODEL`
chỉ định model Pro có quota riêng.

## Demo mode

Tất cả công cụ Gemini đều chạy được **kể cả khi chưa có `GEMINI_API_KEY`**:
- **PDF Translate**: trả message "GEMINI_API_KEY chưa được cấu hình" + hướng dẫn set key.
- **Idea-to-Tool** (legacy): trả gợi ý mặc định + banner "Demo mode".
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
│   ├── watermark-remover/    # Python 3.12 FastAPI sidecar (port 8766)
│   │   ├── app.py            # Thin FastAPI wrapper (MIT attribution)
│   │   ├── requirements.txt
│   │   ├── Dockerfile        # Multi-stage: clone upstream + exiftool/qpdf
│   │   ├── ATTRIBUTION.md    # Upstream license + changes
│   │   └── .dockerignore
│   └── web/                  # Next.js 14 (App Router)
│       ├── app/              # Routes: /, /agent, /admin, /dashboard, /tools/*, /api/…
│       │   ├── tools/
│       │   │   ├── pdf-translate/      # Upload PDF → Gemini translate
│       │   │   ├── watermark-remover/  # Strip AI metadata
│       │   │   └── price-smart/
│       │   └── api/tools/             # API cho 3 tool trên
│       ├── components/
│       ├── lib/
│       │   └── gemini/                # Gemini client + prompts
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
├── docker-compose.yml        # Production-like orchestration (3 services)
├── docker-compose.dev.yml    # Dev overrides (hot reload)
├── LICENSE
└── README.md
```

## Tech stack

**Agent runner (Python)**
- Python 3.12, Starlette + SSE-Starlette (async HTTP + streaming)
- Anthropic SDK 0.122, commerce-agents ShoppingAgent (vendored)
- Pydantic 2.13 cho schemas

**Watermark remover (Python sidecar)**
- Python 3.12, FastAPI + Uvicorn
- Logic adapted từ [guillaumemeyer/watermarks-remover](https://github.com/guillaumemeyer/watermarks-remover) (MIT)
- Hệ thống deps: `exiftool` (EXIF/XMP/IPTC), `qpdf` (PDF rewriting), `ghostscript` (deep re-distill)

**Web (Next.js)**
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS, Framer Motion, GSAP, Lenis
- React Three Fiber / Drei (3D hero)
- Supabase SSR cho auth (optional)
- **Gemini REST API** (PDF Translate + Idea-to-Tool) — dùng fetch thuần, không cần SDK
- **Gemini Files API** cho PDF input (multipart upload qua resumable protocol)

**Deployment**
- Docker multi-stage builds (mỗi service có Dockerfile riêng)
- docker-compose cho local + production-like (3 services: agent-runner, watermark-remover, web)
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
