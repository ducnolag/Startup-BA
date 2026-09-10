'use client';

import { useState } from 'react';

interface ToolSuggestion {
  name: string;
  description: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

interface IdeaToolResult {
  category: string;
  tools: ToolSuggestion[];
  next_steps: string[];
  refinement_question: string;
  summary: string;
}

interface ResultCardProps {
  result: IdeaToolResult;
  demoMode: boolean;
  onRefine: () => void;
}

const CATEGORY_LABEL: Record<string, string> = {
  productivity: 'Năng suất',
  sales: 'Bán hàng',
  content: 'Sáng tạo nội dung',
  finance: 'Tài chính',
  learning: 'Học tập',
  ops: 'Vận hành',
  'customer-support': 'Chăm sóc khách hàng',
  'data-analysis': 'Phân tích dữ liệu',
  'hiring-team': 'Tuyển dụng & nhân sự',
  khác: 'Khác',
};

function dot(level: 'low' | 'medium' | 'high') {
  return (
    <span
      className={`inline-block w-2 h-2 rounded-full ${
        level === 'high' ? 'bg-success' : level === 'medium' ? 'bg-warning' : 'bg-ink-subtle'
      }`}
      aria-hidden
    />
  );
}

export default function ResultCard({ result, demoMode, onRefine }: ResultCardProps) {
  const [copied, setCopied] = useState(false);
  const cat = CATEGORY_LABEL[result.category] ?? result.category;

  const copySummary = async () => {
    const text = [
      `Phân loại: ${cat}`,
      '',
      'Công cụ gợi ý:',
      ...result.tools.map((t, i) => `  ${i + 1}. ${t.name} — ${t.description}`),
      '',
      'Bước tiếp theo:',
      ...result.next_steps.map((s, i) => `  ${i + 1}. ${s}`),
    ].join('\n');
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  return (
    <div className="card p-6 md:p-8">
      {demoMode && (
        <div className="mb-5 px-3 py-2 rounded-lg bg-warning/10 border border-warning/30 text-xs text-warning">
          Đang chạy ở demo mode — set <code className="font-mono">GEMINI_API_KEY</code> trong
          môi trường để nhận gợi ý cá nhân hoá.
        </div>
      )}

      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-wider text-ink-subtle mb-1.5">
            Phân loại vấn đề
          </div>
          <div className="chip chip-active">{cat}</div>
        </div>
        <button
          type="button"
          onClick={copySummary}
          className="text-xs text-ink-muted hover:text-ink flex items-center gap-1.5 flex-shrink-0"
          aria-label="Sao chép tóm tắt"
        >
          {copied ? '✓ Đã copy' : '⧉ Sao chép'}
        </button>
      </div>

      {/* Tools */}
      <div className="mb-7">
        <div className="text-[11px] font-mono uppercase tracking-wider text-ink-subtle mb-3">
          Công cụ gợi ý
        </div>
        <div className="space-y-3">
          {result.tools.map((t, idx) => (
            <div
              key={t.name}
              className="card-soft p-4 hover:border-line transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="font-mono text-xs text-ink-subtle">0{idx + 1}</span>
                    <h4 className="font-display font-semibold text-ink">{t.name}</h4>
                  </div>
                  <p className="text-sm text-ink-muted leading-relaxed">{t.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-3 text-xs text-ink-subtle">
                <span className="flex items-center gap-1.5">
                  Effort {dot(t.effort)} <span className="capitalize">{t.effort}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  Impact {dot(t.impact)} <span className="capitalize">{t.impact}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Next steps */}
      <div className="mb-6">
        <div className="text-[11px] font-mono uppercase tracking-wider text-ink-subtle mb-3">
          Bước tiếp theo (24h)
        </div>
        <ol className="space-y-2.5">
          {result.next_steps.map((step, idx) => (
            <li key={idx} className="flex items-start gap-3 text-sm text-ink">
              <span className="status-dot mt-2" aria-hidden />
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Refinement */}
      {result.refinement_question && (
        <div className="mb-6 px-4 py-3 rounded-lg bg-brand/5 border border-brand/15">
          <div className="text-[11px] font-mono uppercase tracking-wider text-brand-deep mb-1">
            Câu hỏi refinement
          </div>
          <p className="text-sm text-ink leading-relaxed">{result.refinement_question}</p>
        </div>
      )}

      {/* Summary */}
      <div className="pt-5 border-t border-line">
        <p className="text-sm text-ink-muted leading-relaxed">{result.summary}</p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button type="button" onClick={onRefine} className="btn-ghost">
          ↻ Mô tả lại / thử vấn đề khác
        </button>
      </div>
    </div>
  );
}
