# Deployment

## Local (Docker)

```bash
docker-compose up -d
```

- `agent-runner` lắng nghe ở `localhost:8765`.
- `web` lắng nghe ở `localhost:3000`.
- Volume `toolify-agent-data` mount vào `/app/data` cho state persistence.

## Local (không Docker)

Xem `README.md` ở root, mục "Cài thủ công (dev mode, hot-reload)".

## Production checklist

- [ ] Set `ANTHROPIC_API_KEY` thật trong secret manager (không commit vào repo).
- [ ] Set `AGENT_MODEL` rõ ràng (vd `claude-sonnet-4-5`).
- [ ] Nếu dùng Supabase: set `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- [ ] Build images locally trước khi push: `docker-compose build`.
- [ ] Smoke test: `curl http://localhost:8765/health` trả về `200 OK`.
- [ ] Smoke test: mở `/agent` trên browser, gửi "tìm iPhone 15", nhận được response.

## Cloud options

| Platform      | Cách deploy                                | Pros                              |
|---------------|---------------------------------------------|-----------------------------------|
| Fly.io        | `fly launch` từ repo                        | Free tier, gần users Việt Nam     |
| Railway       | Connect GitHub repo, auto-deploy             | Đơn giản, có free tier            |
| Vercel (web)  | Import repo, root = `apps/web`              | Tối ưu cho Next.js                |
| Render        | Docker Compose support                      | Persistent disk cho volumes       |

### Gợi ý: tách web và runner

Nếu scale lớn, deploy hai service riêng:

- **Runner**: container có CPU thấp, RAM trung bình. Stateless → dễ scale horizontal.
- **Web**: Next.js standalone → chạy trên Vercel / Fly.io / Render.

Kết nối chúng qua env var `NEXT_PUBLIC_AGENT_URL` (browser gọi runner trực tiếp) hoặc proxy qua web (che giấu runner URL khỏi client).

## Monitoring

- Agent runner: log JSON ra stdout, ship sang Loki/CloudWatch tuỳ ý.
- Web: Next.js telemetry đã tắt (`NEXT_TELEMETRY_DISABLED=1`).
- Recommend: thêm Sentry cho cả hai để track exceptions.

## Rollback

- Docker images tag theo git SHA. `docker-compose pull && docker-compose up -d` rollback về tag cũ.
- DB schema: Supabase migrations nằm trong `apps/web/supabase/migrations/`. Rollback bằng cách apply migration ngược.
