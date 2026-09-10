# services/

Nơi để các service Python độc lập với `apps/agent-runner/`.

## Kế hoạch

- `merchant-agent/` — service cho phía người bán (catalog management, pricing, campaigns).
- `analytics/` — event collector + dashboard cho hành vi mua sắm.

Mỗi service sẽ có cùng shape với `apps/agent-runner/`:

```
services/<name>/
├── <name>/          # Module code
├── tests/
├── requirements.txt
├── Dockerfile
└── README.md
```

Hiện tại thư mục này còn trống — xem [Roadmap](../README.md#roadmap) trong README gốc.
