'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
  onAnalyze: (input: string) => void;
  isLoading: boolean;
  onDemo?: () => void;
}

const SAMPLE_INPUTS = [
  'Son 3CE Lip Killer',
  'Nồi cơm Philips HD4515',
  'Xiaomi Air Purifier 4',
  'Đầm nữ Ivy Moda',
];

export default function PriceInput({ onAnalyze, isLoading, onDemo }: Props) {
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);

  const submit = () => {
    if (!value.trim() || isLoading) return;
    onAnalyze(value.trim());
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div
        className={cn(
          'relative bg-white rounded-2xl border transition-all duration-300',
          focused
            ? 'border-ink shadow-[0_8px_30px_rgba(0,0,0,0.06)]'
            : 'border-line shadow-[0_2px_8px_rgba(0,0,0,0.04)]'
        )}
      >
        <div className="flex items-center gap-4 px-5 py-4">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && submit()}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            placeholder="Dán link Shopee, Lazada, Tiki... hoặc gõ tên sản phẩm"
            className="flex-1 bg-transparent text-ink placeholder:text-ink-tertiary outline-none text-[15px] tracking-tight"
            disabled={isLoading}
          />
          <button
            onClick={submit}
            disabled={!value.trim() || isLoading}
            className={cn(
              'px-5 py-2.5 rounded-full text-sm font-semibold transition-all shrink-0',
              'bg-ink text-white',
              'hover:bg-ink/90 hover:-translate-y-0.5',
              'disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:translate-y-0'
            )}
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Đang phân tích</span>
              </span>
            ) : (
              <span>Phân tích</span>
            )}
          </button>
        </div>
      </div>

      {/* Sample inputs + demo link */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-[11px] uppercase tracking-wider text-ink-subtle mr-1">Thử</span>
        {SAMPLE_INPUTS.map((s) => (
          <button
            key={s}
            onClick={() => {
              setValue(s);
              onAnalyze(s);
            }}
            disabled={isLoading}
            className="text-xs text-ink-muted hover:text-ink px-3 py-1.5 rounded-full bg-surface-muted hover:bg-surface-subtle transition-colors disabled:opacity-50"
          >
            {s}
          </button>
        ))}
        {onDemo && (
          <>
            <span className="text-ink-tertiary mx-1">·</span>
            <button
              onClick={onDemo}
              disabled={isLoading}
              className="text-xs text-brand-deep hover:text-ink px-3 py-1.5 rounded-full font-semibold disabled:opacity-50"
            >
              Xem bản demo →
            </button>
          </>
        )}
      </div>
    </div>
  );
}