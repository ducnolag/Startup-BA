'use client';

import { useState } from 'react';

const SOURCE_LANGS = [
  { code: 'auto', label: 'Tự động' },
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
];

const TARGET_LANGS = [
  { code: 'vi', label: 'Tiếng Việt' },
  { code: 'en', label: 'English' },
  { code: 'zh', label: '中文' },
  { code: 'ja', label: '日本語' },
  { code: 'ko', label: '한국어' },
  { code: 'fr', label: 'Français' },
  { code: 'es', label: 'Español' },
  { code: 'de', label: 'Deutsch' },
];

interface TranslatorProps {
  initialSource?: string;
  initialTarget?: string;
}

export default function Translator({ initialSource = 'auto', initialTarget = 'vi' }: TranslatorProps) {
  const [source, setSource] = useState(initialSource);
  const [target, setTarget] = useState(initialTarget);
  const [text, setText] = useState('');
  const [translated, setTranslated] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [demoMode, setDemoMode] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSwap = () => {
    if (source === 'auto') return; // cannot swap with auto
    const tmp = source;
    setSource(target);
    setTarget(tmp);
    setText(translated);
    setTranslated(text);
  };

  const handleTranslate = async () => {
    if (loading) return;
    if (!text.trim()) {
      setError('Vui lòng nhập văn bản cần dịch.');
      return;
    }
    setError('');
    setLoading(true);
    setDemoMode(false);
    try {
      const res = await fetch('/api/tools/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, source, target }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'Có lỗi xảy ra.');
        return;
      }
      setTranslated(data.translated);
      setDemoMode(Boolean(data.demo_mode));
    } catch {
      setError('Không kết nối được với máy chủ.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!translated) return;
    try {
      await navigator.clipboard.writeText(translated);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const remaining = 5000 - text.length;

  return (
    <section id="translator" className="py-12 md:py-16">
      <div className="container-page max-w-6xl">
        <div className="card p-6 md:p-8">
          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-4 md:gap-6 items-start">
            {/* Source */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="source-lang" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Ngôn ngữ nguồn
                </label>
                <span className="text-xs text-ink-subtle">
                  {text.length} / 5000
                </span>
              </div>
              <select
                id="source-lang"
                value={source}
                onChange={(e) => setSource(e.target.value)}
                disabled={loading}
                className="input-field mb-3 cursor-pointer"
              >
                {SOURCE_LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value.slice(0, 5000))}
                placeholder="Dán hoặc gõ văn bản cần dịch..."
                rows={10}
                disabled={loading}
                className="input-field resize-y flex-1 min-h-[240px] disabled:opacity-60"
              />
            </div>

            {/* Swap */}
            <div className="flex md:flex-col items-center justify-center gap-2 md:py-0 py-2">
              <button
                type="button"
                onClick={handleSwap}
                disabled={source === 'auto' || loading}
                className="w-10 h-10 rounded-full border border-line bg-white hover:bg-surface-muted flex items-center justify-center text-ink-muted hover:text-ink disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Đổi chiều dịch"
                title={source === 'auto' ? 'Tắt "Tự động" để đổi chiều' : 'Đổi chiều dịch'}
              >
                ⇄
              </button>
            </div>

            {/* Target */}
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <label htmlFor="target-lang" className="text-xs font-semibold text-ink-muted uppercase tracking-wider">
                  Dịch sang
                </label>
                {translated && (
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="text-xs text-ink-muted hover:text-ink flex items-center gap-1.5"
                    aria-label="Sao chép bản dịch"
                  >
                    {copied ? '✓ Đã copy' : '⧉ Sao chép'}
                  </button>
                )}
              </div>
              <select
                id="target-lang"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                disabled={loading}
                className="input-field mb-3 cursor-pointer"
              >
                {TARGET_LANGS.map((l) => (
                  <option key={l.code} value={l.code}>
                    {l.label}
                  </option>
                ))}
              </select>
              <div className="input-field flex-1 min-h-[240px] bg-surface-muted whitespace-pre-wrap text-ink">
                {loading ? (
                  <div className="flex items-center gap-2 text-ink-muted">
                    <span className="inline-block w-3 h-3 rounded-full bg-brand animate-pulse" />
                    Đang dịch…
                  </div>
                ) : translated ? (
                  translated
                ) : (
                  <span className="text-ink-subtle">Bản dịch sẽ xuất hiện ở đây.</span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-line">
            <div className="text-xs text-ink-subtle">
              {remaining < 500 && (
                <span className={remaining < 100 ? 'text-warning' : ''}>
                  Còn lại {remaining} ký tự
                </span>
              )}
              {demoMode && (
                <span className="ml-2 chip text-[10px]">Demo mode</span>
              )}
            </div>
            <button
              type="button"
              onClick={handleTranslate}
              disabled={loading || !text.trim()}
              className="btn-primary disabled:opacity-60"
            >
              {loading ? 'Đang dịch…' : 'Dịch'}
            </button>
          </div>

          {error && (
            <div className="mt-4 px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
              {error}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
