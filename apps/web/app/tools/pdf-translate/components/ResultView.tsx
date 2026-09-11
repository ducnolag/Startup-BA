'use client';

import { useMemo, useState } from 'react';
import { Download, FileText, Globe, ChevronDown, FileDown } from 'lucide-react';

export interface TranslatedPage {
  page: number;
  text: string;
}

export interface TranslateResult {
  source_language?: string;
  page_count?: number;
  pages: TranslatedPage[];
  target_label?: string;
  reason?: string;
  demo_mode?: boolean;
}

interface ResultViewProps {
  result: TranslateResult;
  pdfBlob: Blob | null;
  pdfFilename: string;
  onReset: () => void;
}

function toMarkdown(result: TranslateResult): string {
  const lines: string[] = [];
  lines.push(`# Bản dịch PDF`);
  lines.push('');
  if (result.target_label) lines.push(`**Ngôn ngữ đích:** ${result.target_label}`);
  if (result.source_language) lines.push(`**Ngôn ngữ gốc:** ${result.source_language}`);
  if (result.page_count) lines.push(`**Số trang:** ${result.page_count}`);
  lines.push('');
  lines.push('---');
  lines.push('');
  for (const p of result.pages) {
    lines.push(`## Trang ${p.page}`);
    lines.push('');
    lines.push(p.text.trim());
    lines.push('');
  }
  return lines.join('\n');
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function ResultView({ result, pdfBlob, pdfFilename, onReset }: ResultViewProps) {
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    // Mở sẵn trang đầu tiên
    return new Set(result.pages.length > 0 ? [result.pages[0].page] : []);
  });
  const [downloadOpen, setDownloadOpen] = useState(false);

  const markdown = useMemo(() => toMarkdown(result), [result]);

  const toggle = (page: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(page)) next.delete(page);
      else next.add(page);
      return next;
    });
  };

  const downloadText = (filename: string, mime: string) => {
    const blob = new Blob([markdown], { type: mime });
    downloadBlob(blob, filename);
  };

  return (
    <div className="space-y-5">
      {result.reason && (
        <div className="px-4 py-3 rounded-lg bg-warning/10 border border-warning/30 text-sm text-ink">
          <span className="font-semibold mr-2">Lưu ý:</span>
          {result.reason}
        </div>
      )}

      {/* Summary card */}
      <div className="card p-5 md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10 text-success">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display font-bold text-lg text-ink">
                Dịch xong {result.pages.length || 1} trang
              </div>
              <div className="text-xs text-ink-muted mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                {result.source_language && (
                  <span>
                    <Globe className="inline h-3 w-3 mr-1 -mt-0.5" />
                    {result.source_language} → {result.target_label ?? '?'}
                  </span>
                )}
                {result.demo_mode && <span className="chip text-[10px]">Demo mode</span>}
                {pdfBlob && (
                  <span className="chip text-[10px]">
                    {(pdfBlob.size / 1024).toFixed(0)} KB · PDF giữ layout
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-full text-sm font-semibold text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
            >
              Dịch file khác
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setDownloadOpen((v) => !v)}
                className="btn-primary"
              >
                <Download className="h-4 w-4" />
                Tải về
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${downloadOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {downloadOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setDownloadOpen(false)}
                    aria-hidden
                  />
                  <div className="absolute right-0 top-full mt-2 z-20 w-64 bg-white border border-line rounded-2xl shadow-pop p-2">
                    {pdfBlob && (
                      <>
                        <button
                          type="button"
                          onClick={() => {
                            downloadBlob(pdfBlob, pdfFilename);
                            setDownloadOpen(false);
                          }}
                          className="w-full text-left px-3 py-2.5 rounded-lg hover:bg-surface-muted text-sm text-ink flex items-start gap-2.5"
                        >
                          <FileDown className="h-4 w-4 text-brand shrink-0 mt-0.5" />
                          <div>
                            <div className="font-semibold">PDF giữ layout (.pdf)</div>
                            <div className="text-xs text-ink-subtle mt-0.5">
                              Font, cột, hình ảnh được giữ nguyên
                            </div>
                          </div>
                        </button>
                        <div className="my-1 border-t border-line" />
                      </>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        downloadText('translated.md', 'text/markdown;charset=utf-8');
                        setDownloadOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-muted text-sm text-ink"
                    >
                      <div className="font-semibold">Markdown (.md)</div>
                      <div className="text-xs text-ink-subtle mt-0.5">
                        Copy/paste dễ, giữ heading
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        downloadText('translated.txt', 'text/plain;charset=utf-8');
                        setDownloadOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-surface-muted text-sm text-ink"
                    >
                      <div className="font-semibold">Plain text (.txt)</div>
                      <div className="text-xs text-ink-subtle mt-0.5">
                        Văn bản thuần, không format
                      </div>
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Big primary download CTA for the layout-preserving PDF */}
        {pdfBlob && (
          <div className="mt-5 pt-5 border-t border-line">
            <button
              type="button"
              onClick={() => downloadBlob(pdfBlob, pdfFilename)}
              className="w-full flex items-center justify-center gap-3 px-5 py-4 rounded-2xl bg-ink text-white hover:bg-ink/90 transition-colors group"
            >
              <FileDown className="h-5 w-5" />
              <span className="font-display font-semibold text-base">
                Tải về PDF đã dịch (giữ layout)
              </span>
              <span className="text-white/60 text-sm">· {(pdfBlob.size / 1024).toFixed(0)} KB</span>
            </button>
            <p className="mt-3 text-xs text-ink-subtle text-center">
              Mở bằng Acrobat Reader, Preview, hoặc Chrome để xem. Bản PDF giữ nguyên
              font, cột, hình ảnh, header/footer của bản gốc — chỉ thay phần văn bản.
            </p>
          </div>
        )}
      </div>

      {/* Pages accordion — text preview */}
      <div className="space-y-3">
        {result.pages.length === 0 ? (
          <div className="card p-6 text-sm text-ink-muted">
            Bản PDF đã sẵn sàng để tải về. Nếu bạn muốn xem trước nội dung dạng text,
            hãy thử lại hoặc dùng bản PDF trực tiếp.
          </div>
        ) : (
          result.pages.map((p) => {
            const isOpen = expanded.has(p.page);
            return (
              <div key={p.page} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggle(p.page)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-surface-muted transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand/10 text-brand-deep text-xs font-bold shrink-0">
                      {p.page}
                    </div>
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-ink">
                        Trang {p.page}
                      </div>
                      <div className="text-xs text-ink-muted truncate">
                        {p.text.slice(0, 80).replace(/\n+/g, ' ')}
                        {p.text.length > 80 ? '…' : ''}
                      </div>
                    </div>
                  </div>
                  <ChevronDown
                    className={`h-4 w-4 text-ink-muted shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-line px-5 py-4 bg-surface-muted">
                    <pre className="whitespace-pre-wrap font-body text-sm text-ink leading-relaxed">
                      {p.text}
                    </pre>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}