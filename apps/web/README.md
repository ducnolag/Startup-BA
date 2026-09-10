# Toolify — Web

Next.js 14 frontend cho Toolify. App Router, TypeScript, Tailwind.

## Chạy local

```bash
npm install
npm run dev
```

Mở [http://localhost:3000](http://localhost:3000).

## Scripts

| Script          | Mô tả                              |
|-----------------|-------------------------------------|
| `npm run dev`   | Dev server với hot reload          |
| `npm run build` | Production build (standalone mode) |
| `npm run start` | Chạy production server             |
| `npm run lint`  | ESLint                              |

## Routes

- `/` — landing page
- `/agent` — chat với AI shopping assistant
- `/dashboard` — user dashboard (cần Supabase auth)
- `/admin/*` — admin pages (products, tools, votes)
- `/login`, `/signup` — auth flows
- `/tools/price-smart` — price comparison tool

## API routes

- `POST /api/agent/stream` — proxy SSE stream sang agent runner
- `POST /api/agent/analyze` — analyze intent, route tới skill
- `GET  /api/storefront` — storefront data
- `POST /api/price/fetch` — fetch price từ external API
- `POST /api/chat` — direct chat (legacy)

## Env vars

Xem `.env.example` ở root. Service cần:

- `NEXT_PUBLIC_AGENT_URL` — URL của agent runner (browser-side)
- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Supabase anon key

## Docker

```bash
docker build -t toolify/web:latest .
docker run --rm -p 3000:3000 \
  -e NEXT_PUBLIC_AGENT_URL=http://localhost:8765 \
  toolify/web:latest
```

## Build standalone

`next.config.mjs` đã bật `output: 'standalone'` để Docker image chỉ cần copy `.next/standalone/` thay vì toàn bộ `node_modules`.
