# Architecture

Toolify là một monorepo gồm hai service độc lập giao tiếp qua HTTP/SSE.

## Tổng quan

```
┌─────────────────┐         ┌──────────────────┐         ┌────────────────┐
│   Browser       │  HTTPS  │   Next.js (web)  │  HTTP   │ Agent Runner   │
│                 │ ───────▶│   :3000          │ ───────▶│   :8765        │
│   React UI      │         │   App Router     │  SSE    │ Starlette      │
└─────────────────┘         └──────────────────┘         └────────────────┘
                                      │                           │
                                      │                           ▼
                                      │                  ┌──────────────────┐
                                      │                  │ Anthropic API    │
                                      ▼                  │ claude-sonnet-…  │
                              ┌──────────────────┐        └──────────────────┘
                              │ Supabase         │                │
                              │ auth + database  │                ▼
                              └──────────────────┘        ┌──────────────────┐
                                                         │ Local catalog    │
                                                         │ + Tiki API       │
                                                         └──────────────────┘
```

## Service boundaries

### `apps/agent-runner/`

- **Không biết** về Next.js, Supabase, hay UI. Chỉ biết về Claude + product catalog.
- Expose 3 endpoints: `/health`, `/session`, `/turn`.
- Stateless ngoài `sessions: dict[str, dict]` (in-memory).
- Đóng gói commerce-agents ShoppingAgent + VNBackend (Vietnamese storefront adapter).

### `apps/web/`

- **Không gọi** Anthropic API trực tiếp. Mọi LLM call đều đi qua agent runner.
- App Router với route groups: `(marketing)`, `(auth)`, `(app)`.
- Supabase chỉ cho auth + dashboard data (không lưu chat history ở đây — runner làm).

### `services/` (tương lai)

- Merchant-agent: API cho người bán quản lý catalog, pricing, campaigns.
- Analytics: event collector cho hành vi mua sắm.

## Data flow

### User gửi message

1. Browser POST `/api/agent/stream` (Next.js route handler).
2. Next.js proxy sang `agent-runner:8765/turn` qua SSE.
3. Agent runner khởi tạo ShoppingAgent turn loop với `session_id`.
4. Claude phản hồi, runner stream SSE events: `text_delta`, `present_products`, `present_comparison`, `cart_update`, `turn_complete`.
5. Browser append events vào chat UI.

### Cart update

1. Claude gọi tool `add_to_cart(product_id, qty)`.
2. Tool gọi `VNBackend.add_to_cart()` (in-memory store keyed by session).
3. Runner emit `cart_update` SSE event.
4. Browser update cart icon + drawer.

## Vendor vs. code-of-record

- `shopping_agent/`, `shopping_agent_runtime/`, `commerce_common/` — **vendored** từ [Anthropic commerce-agents](https://github.com/anthropics-commerce-agents), commit hash được pin trong `requirements.txt`.
- `agent_runner/` — code riêng của Toolify, nơi tất cả business logic Việt hoá sống.

Lý do vendor thay vì `pip install -e`: chúng ta kiểm soát được diff khi upstream thay đổi, và Docker build không cần clone lại repo.
