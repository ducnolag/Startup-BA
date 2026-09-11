'use client';

import { useCallback, useRef, useState } from 'react';
import { Upload, FileText, Image as ImageIcon, FileType2, X } from 'lucide-react';

interface UploadFormProps {
  file: File | null;
  onFile: (file: File | null) => void;
  disabled?: boolean;
}

const MAX_BYTES = 50 * 1024 * 1024; // 50 MB

const ALLOWED_EXTS = [
  '.pdf', '.docx', '.xlsx', '.pptx', '.odt', '.epub',
  '.png', '.jpg', '.jpeg', '.webp', '.avif', '.heic', '.heif',
  '.bmp', '.gif', '.tiff', '.tif', '.svg',
];

const ACCEPT_MIME = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.oasis.opendocument.text',
  'application/epub+zip',
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
  'image/bmp',
  'image/gif',
  'image/tiff',
  'image/svg+xml',
].join(',');

function pickIcon(name: string) {
  const lower = name.toLowerCase();
  if (lower.endsWith('.pdf')) return <FileType2 className="h-6 w-6" />;
  if (/\.(png|jpe?g|webp|avif|heic|heif|bmp|gif|tiff?|svg)$/i.test(lower))
    return <ImageIcon className="h-6 w-6" />;
  return <FileText className="h-6 w-6" />;
}

export default function UploadForm({ file, onFile, disabled }: UploadFormProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState('');

  const validate = useCallback((f: File): string | null => {
    const ext = '.' + (f.name.split('.').pop() ?? '').toLowerCase();
    if (!ALLOWED_EXTS.includes(ext)) {
      return `Định dạng không hỗ trợ: "${ext}". Hỗ trợ: PDF, DOCX, XLSX, PPTX, ODT, EPUB, và ảnh phổ biến.`;
    }
    if (f.size === 0) {
      return 'File rỗng — không có gì để xử lý.';
    }
    if (f.size > MAX_BYTES) {
      const mb = (f.size / 1024 / 1024).toFixed(1);
      return `File ${mb} MB vượt quá giới hạn 50 MB.`;
    }
    return null;
  }, []);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const f = files[0];
      const err = validate(f);
      if (err) {
        setError(err);
        return;
      }
      setError('');
      onFile(f);
    },
    [onFile, validate],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragging(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragging(false);
  };

  const clearFile = () => {
    onFile(null);
    setError('');
    if (inputRef.current) inputRef.current.value = '';
  };

  const sizeMb = file ? (file.size / 1024 / 1024).toFixed(2) : '0';

  return (
    <div>
      {file ? (
        <div className="card p-5 flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-depth/10 text-depth shrink-0">
            {pickIcon(file.name)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-ink truncate" title={file.name}>
              {file.name}
            </div>
            <div className="text-xs text-ink-muted mt-0.5">
              {sizeMb} MB · sẵn sàng strip metadata
            </div>
          </div>
          <button
            type="button"
            onClick={clearFile}
            disabled={disabled}
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-surface-muted text-ink-muted hover:bg-line hover:text-ink transition-colors disabled:opacity-50"
          >
            <X className="h-3.5 w-3.5" />
            Chọn file khác
          </button>
        </div>
      ) : (
        <label
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          htmlFor="wm-file-input"
          className={[
            'block cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-200',
            dragging
              ? 'border-depth bg-depth/5 scale-[1.01]'
              : 'border-line bg-white hover:border-depth hover:bg-surface-muted',
            disabled ? 'opacity-60 pointer-events-none' : '',
          ].join(' ')}
          style={{ padding: 'clamp(2rem, 5vw, 3rem) 1.5rem' }}
        >
          <div className="flex flex-col items-center text-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-depth/10 text-depth">
              <Upload className="h-7 w-7" />
            </div>
            <div>
              <div className="font-display font-semibold text-ink text-lg">
                Kéo thả file vào đây
              </div>
              <div className="text-sm text-ink-muted mt-1">
                hoặc{' '}
                <span className="text-depth font-semibold underline underline-offset-2">
                  chọn file từ máy
                </span>
                {' · '}PDF, DOCX, ảnh · tối đa 50 MB
              </div>
            </div>
          </div>
          <input
            ref={inputRef}
            id="wm-file-input"
            type="file"
            accept={ACCEPT_MIME}
            onChange={(e) => handleFiles(e.target.files)}
            disabled={disabled}
            className="sr-only"
          />
        </label>
      )}

      {error && (
        <div className="mt-3 px-4 py-2.5 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
          {error}
        </div>
      )}

      {/* Supported format chips */}
      <div className="mt-5 flex flex-wrap gap-2">
        <span className="text-xs text-ink-subtle font-semibold uppercase tracking-wider self-center mr-1">
          Hỗ trợ:
        </span>
        {['PDF', 'DOCX', 'XLSX', 'PPTX', 'PNG', 'JPG', 'WEBP', 'HEIC', 'SVG'].map((f) => (
          <span key={f} className="chip text-[10px]">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}
