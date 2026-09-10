# Toolify — Agent Runner

Python HTTP server bọc Anthropic SDK + commerce-agents ShoppingAgent, expose SSE streaming cho frontend Next.js.

## Chạy local

```bash
# Tạo venv (lần đầu)
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt

# Set API key
$env:ANTHROPIC_API_KEY = "sk-ant-..."

# Chạy server
python -m agent_runner.runner
```

Server lắng nghe ở `http://localhost:8765`.

## Endpoints

| Method | Path      | Mô tả                                                |
|--------|-----------|-------------------------------------------------------|
| GET    | `/health` | Health check — trả về status, model, API key status   |
| POST   | `/session`| Tạo session mới, trả về `session_id`                 |
| POST   | `/turn`   | Nhận message, stream SSE về UI events                 |

## SSE event shape

Mỗi event là một dòng `data: {"type": "<name>", ...}`. Các `type`:

- `text_delta` — text streaming từ Claude
- `present_products` — danh sách sản phẩm để render card
- `present_comparison` — bảng so sánh nhiều sản phẩm
- `cart_update` — thay đổi giỏ hàng (add/remove)
- `turn_complete` — kết thúc turn, kèm `session_id`
- `error` — lỗi runtime

## Module layout

```
apps/agent-runner/
├── agent_runner/              # Module chính của chúng ta
│   ├── runner.py              # HTTP server (Starlette)
│   ├── agent_core.py          # AgentCore + VNBackend
│   ├── catalog.py             # 18 sản phẩm mẫu + policies
│   ├── prompts.py             # System prompts tiếng Việt
│   └── skills_alias.py        # Skill aliases cho UI
├── shopping_agent/            # Vendored commerce-agents core
├── shopping_agent_runtime/    # Vendored orchestrator
├── commerce_common/           # Vendored shared types
├── skills/                    # Skill definitions
├── tests/
├── requirements.txt
├── pyproject.toml
└── Dockerfile
```

## Test

```bash
pytest
```

## Docker

```bash
# Build image
docker build -t toolify/agent-runner:latest .

# Run container
docker run --rm -p 8765:8765 -e ANTHROPIC_API_KEY=sk-ant-... toolify/agent-runner:latest

# Hoặc dùng compose ở root
cd ../..
docker-compose up -d agent-runner
```
