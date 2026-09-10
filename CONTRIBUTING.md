# Contributing to Toolify

Cảm ơn bạn đã ghé qua. Đây là hướng dẫn ngắn để đóng góp mà không phá vỡ mọi thứ.

## Quy ước commit

- Một commit = một thay đổi logic. Tránh commit cả bug fix lẫn refactor trong cùng message.
- Tiếng Việt hoặc tiếng Anh đều OK, miễn subject dưới 72 ký tự và dạng imperative (`Add`, `Fix`, `Refactor`).
- Reference issue number nếu có: `Fix login redirect loop (#12)`.

## Workflow

1. Fork repo và tạo branch từ `main`:
   ```bash
   git checkout -b feat/short-description
   ```
2. Chỉnh sửa code trong `apps/agent-runner/` hoặc `apps/web/`. Không commit `.venv/`, `node_modules/`, `.next/`, `_refs/`.
3. Chạy lints và tests:
   ```bash
   # Python
   cd apps/agent-runner
   ruff check .
   pytest

   # Next.js
   cd ../web
   npm run lint
   npx tsc --noEmit
   ```
4. Commit và push:
   ```bash
   git commit -m "Mô tả thay đổi"
   git push origin feat/short-description
   ```
5. Mở Pull Request vào `main`. Mô tả ngắn gọn + screenshot nếu có UI change.

## Style

- **Python**: PEP 8 + ruff defaults. Type hints cho mọi public function. Pydantic models thay vì raw dict.
- **TypeScript**: ESLint config của Next.js. `strict: true` đã bật. Tránh `any`, dùng `unknown` rồi narrow.
- **Imports**: tuyệt đối (`@/lib/...`) trong Next.js, relative trong agent-runner.

## Cấu trúc thư mục

Đừng tự ý thêm file ở root. Mọi thứ phải nằm trong `apps/`, `services/`, `docs/`, `scripts/`, hoặc `.github/`.

## Bảo mật

Nếu bạn tìm thấy lỗ hổng bảo mật, **đừng** mở public issue. Email cho maintainer hoặc dùng GitHub Security Advisories.

## License

Bằng việc contribute, bạn đồng ý code của bạn được phát hành dưới Apache 2.0 — xem [LICENSE](LICENSE).
