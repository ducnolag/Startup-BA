'use client';

import { CheckCircle2, Download, Shield } from 'lucide-react';

interface DownloadResultProps {
  cleanedFilename: string;
  originalSize: number;
  cleanedSize: number;
  downloadUrl: string;
  onReset: () => void;
}

function fmtSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default function DownloadResult({
  cleanedFilename,
  originalSize,
  cleanedSize,
  downloadUrl,
  onReset,
}: DownloadResultProps) {
  const diff = cleanedSize - originalSize;
  const diffPct = originalSize > 0 ? (diff / originalSize) * 100 : 0;

  return (
    <div className="space-y-5">
      <div className="card p-6 md:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-success/10 text-success shrink-0">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display font-bold text-xl text-ink">
              Strip xong metadata AI
            </h3>
            <p className="text-sm text-ink-muted mt-1">
              File của bạn đã được xử lý local — không upload lên cloud. C2PA / EXIF /
              XMP / doc props đã được loại bỏ (hoặc tối đa hóa khả năng strip của
              upstream engine).
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
          <div className="card-soft p-3">
            <div className="text-[10px] uppercase tracking-wider text-ink-subtle font-semibold">
              File gốc
            </div>
            <div className="text-lg font-display font-bold text-ink mt-1">
              {fmtSize(originalSize)}
            </div>
          </div>
          <div className="card-soft p-3">
            <div className="text-[10px] uppercase tracking-wider text-ink-subtle font-semibold">
              File đã strip
            </div>
            <div className="text-lg font-display font-bold text-ink mt-1">
              {fmtSize(cleanedSize)}
            </div>
          </div>
          <div className="card-soft p-3 col-span-2 md:col-span-1">
            <div className="text-[10px] uppercase tracking-wider text-ink-subtle font-semibold">
              Chênh lệch
            </div>
            <div
              className={`text-lg font-display font-bold mt-1 ${
                diff < 0 ? 'text-success' : diff > 0 ? 'text-warning' : 'text-ink-muted'
              }`}
            >
              {diff === 0 ? '0 B' : `${diff > 0 ? '+' : ''}${fmtSize(Math.abs(diff))}`}
              <span className="text-xs font-normal text-ink-muted ml-1">
                ({diffPct > 0 ? '+' : ''}
                {diffPct.toFixed(1)}%)
              </span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-5 border-t border-line">
          <div className="text-sm text-ink-muted">
            <span className="font-semibold text-ink">{cleanedFilename}</span>
            {' · '}{fmtSize(cleanedSize)}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReset}
              className="px-4 py-2 rounded-full text-sm font-semibold text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
            >
              Xử lý file khác
            </button>
            <a
              href={downloadUrl}
              download={cleanedFilename}
              className="btn-primary"
            >
              <Download className="h-4 w-4" />
              Tải về file đã strip
            </a>
          </div>
        </div>
      </div>

      {/* Privacy assurance */}
      <div className="card p-5 md:p-6 bg-surface-muted">
        <div className="flex items-start gap-3">
          <Shield className="h-5 w-5 text-brand-deep shrink-0 mt-0.5" />
          <div>
            <h4 className="font-display font-semibold text-ink mb-1">
              File không bị lưu lại
            </h4>
            <p className="text-sm text-ink-muted leading-relaxed">
              File được xử lý trong container Docker tạm thời. Sau khi response trả về,
              file input + output đều bị xoá. Không có log, không có cache, không có
              telemetry gửi ra ngoài.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
