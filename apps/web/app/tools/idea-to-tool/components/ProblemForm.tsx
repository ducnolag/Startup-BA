'use client';

import { useState } from 'react';

interface ProblemFormProps {
  onResult: (data: unknown, demoMode: boolean) => void;
  onError: (msg: string) => void;
  onLoading: (loading: boolean) => void;
  loading: boolean;
}

const EXAMPLES = [
  'Tôi là founder startup giai đoạn đầu, cần quản lý task hàng ngày cho team 5 người mà không phức tạp như Jira.',
  'Freelancer thiết kế đồ họa, cần tool lên lịch đăng TikTok 30 ngày và theo dõi tương tác.',
  'Chủ shop online bán mỹ phẩm, muốn tự động trả lời inbox khách hàng về giá, size, công dụng sản phẩm.',
];

export default function ProblemForm({ onResult, onError, onLoading, loading }: ProblemFormProps) {
  const [problem, setProblem] = useState('');
  const max = 2000;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (problem.trim().length < 10) {
      onError('Mô tả vấn đề chi tiết hơn một chút nhé (ít nhất 10 ký tự).');
      return;
    }
    onError('');
    onLoading(true);
    try {
      const res = await fetch('/api/tools/idea-to-tool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem }),
      });
      const data = await res.json();
      if (!res.ok) {
        onError(data.error ?? 'Có lỗi xảy ra. Thử lại sau.');
        onLoading(false);
        return;
      }
      onResult(data.result, Boolean(data.demo_mode));
    } catch (err) {
      onError('Không kết nối được với máy chủ. Kiểm tra mạng rồi thử lại.');
    } finally {
      onLoading(false);
    }
  };

  return (
    <section id="problem-form" className="py-12 md:py-16">
      <div className="container-page max-w-3xl">
        <form onSubmit={handleSubmit} className="card p-6 md:p-8">
          <label htmlFor="problem" className="block text-sm font-semibold text-ink mb-3">
            Mô tả vấn đề của bạn
          </label>
          <textarea
            id="problem"
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="VD: Tôi cần quản lý task hàng ngày cho team 5 người, dùng tiếng Việt, ngân sách hạn chế..."
            rows={6}
            maxLength={max}
            disabled={loading}
            className="input-field resize-y min-h-[140px] disabled:opacity-60"
          />
          <div className="flex items-center justify-between mt-3 text-xs text-ink-subtle">
            <span>
              {problem.length} / {max} ký tự
            </span>
            <span>Tip: càng cụ thể (đối tượng, quy mô, ngân sách) càng chính xác</span>
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            <span className="text-xs text-ink-muted">Thử nhanh:</span>
            {EXAMPLES.map((ex) => (
              <button
                key={ex.slice(0, 30)}
                type="button"
                onClick={() => setProblem(ex)}
                className="chip text-[11px] hover:bg-surface-subtle"
                disabled={loading}
              >
                {ex.slice(0, 50)}…
              </button>
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary mt-6 w-full justify-center disabled:opacity-60"
          >
            {loading ? 'AI đang phân tích…' : 'Gợi ý công cụ phù hợp'}
          </button>
        </form>
      </div>
    </section>
  );
}
