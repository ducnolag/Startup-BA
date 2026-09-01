'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { Send, Sparkles, TrendingDown, TrendingUp, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';
import { PLATFORM_PATTERNS, SAMPLE_PRODUCTS } from '@/lib/constants';
import type { PriceAnalysis, Platform, Trend, Verdict } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: React.ReactNode;
  timestamp: string;
}

function detectPlatform(url: string): Platform {
  for (const p of PLATFORM_PATTERNS) {
    if (p.match.test(url)) return p.name as Platform;
  }
  return 'Website khác';
}

function mockAnalyze(url: string): PriceAnalysis {
  const platform = detectPlatform(url);
  const productName = SAMPLE_PRODUCTS[Math.floor((url.length * 7) % SAMPLE_PRODUCTS.length)];
  const base = 5000000 + ((url.length * 137423) % 25000000);
  const avg = Math.round(base * (0.92 + ((url.length * 31) % 18) / 100));
  const min = Math.round(avg * 0.78);
  const max = Math.round(avg * 1.22);
  const currentPrice = Math.round(avg * (0.85 + ((url.length * 13) % 22) / 100));
  const diff = ((currentPrice - avg) / avg) * 100;
  const trend: Trend = diff < -3 ? 'down' : diff > 3 ? 'up' : 'stable';

  let verdict: Verdict = 'wait';
  let verdictLabel = 'Nên chờ thêm';
  let advice =
    'Giá hiện tại cao hơn trung bình 90 ngày. Khuyến nghị theo dõi thêm 1-2 tuần.';
  if (currentPrice <= min * 1.05) {
    verdict = 'good-deal';
    verdictLabel = 'Giá tốt — nên mua';
    advice =
      'Đây là mức gần đáy 90 ngày. Nếu đang cần, đây là thời điểm hợp lý để chốt đơn.';
  } else if (trend === 'down') {
    verdict = 'buy';
    verdictLabel = 'Có thể mua';
    advice =
      'Xu hướng đang giảm. Nếu chênh lệch với giá bạn mong muốn không lớn, có thể chốt.';
  }

  return {
    productName,
    platform,
    currentPrice,
    avgPrice: avg,
    minPrice: min,
    maxPrice: max,
    trend,
    trendPct: Math.abs(Math.round(diff)),
    verdict,
    verdictLabel,
    advice,
    bestTimeWindow: 'Thứ 3 - Thứ 5, 10h-14h (ít sale flash, dễ săn mã freeship)',
  };
}

const fmt = (n: number) => `${n.toLocaleString('vi-VN')}đ`;

function AnalysisCard({ data }: { data: PriceAnalysis }) {
  return (
    <div className="bg-white border border-line rounded-2xl p-4 md:p-5 mt-2 space-y-4">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-violet-50 text-violet-700 flex items-center justify-center shrink-0">
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="text-xs text-ink-subtle">{data.platform}</div>
          <div className="font-semibold text-ink truncate">{data.productName}</div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <Stat label="Hiện tại" value={fmt(data.currentPrice)} highlight />
        <Stat label="Trung bình 90d" value={fmt(data.avgPrice)} />
        <Stat label="Thấp nhất 90d" value={fmt(data.minPrice)} />
      </div>

      <div className="flex items-center gap-2 text-xs">
        {data.trend === 'down' ? (
          <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full font-semibold">
            <TrendingDown className="w-3.5 h-3.5" />
            Giảm {data.trendPct}% so với trung bình
          </span>
        ) : data.trend === 'up' ? (
          <span className="inline-flex items-center gap-1 text-danger bg-danger/10 px-2 py-1 rounded-full font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            Tăng {data.trendPct}% so với trung bình
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 text-ink-muted bg-surface-muted px-2 py-1 rounded-full font-semibold">
            Ổn định
          </span>
        )}
      </div>

      <div
        className={cn(
          'rounded-xl p-3 text-sm font-semibold',
          data.verdict === 'good-deal'
            ? 'bg-emerald-50 text-emerald-800'
            : data.verdict === 'buy'
            ? 'bg-blue-50 text-blue-800'
            : 'bg-amber-50 text-amber-800'
        )}
      >
        {data.verdictLabel}
      </div>

      <div className="text-sm text-ink leading-relaxed">{data.advice}</div>

      <div className="flex items-start gap-2 p-3 rounded-lg bg-surface-muted text-xs text-ink-muted">
        <Lightbulb className="w-4 h-4 text-warning shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-ink">Khung giờ săn deal tốt nhất: </span>
          {data.bestTimeWindow}
        </div>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <Link href="/tools/price-compare" className="btn-ghost text-xs">
          Xem lịch sử giá chi tiết →
        </Link>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div
      className={cn(
        'rounded-lg p-2.5',
        highlight ? 'bg-ink text-white' : 'bg-surface-muted'
      )}
    >
      <div className="text-[10px] uppercase tracking-wider opacity-70">{label}</div>
      <div className="font-bold text-sm tabular-nums">{value}</div>
    </div>
  );
}

export default function PriceRecommendPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'm_welcome',
      role: 'bot',
      content:
        'Chào bạn! Mình là trợ lý giá của Toolify. Dán link sản phẩm từ Shopee, Lazada, Tiki hoặc TikTok Shop — mình sẽ phân tích lịch sử giá 90 ngày và khuyến nghị có nên mua ngay không nhé.',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, typing]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const userMsg: Message = {
      id: `m_${Date.now()}`,
      role: 'user',
      content: trimmed,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    await new Promise((r) => setTimeout(r, 900));

    const analysis = mockAnalyze(trimmed);
    const botMsg: Message = {
      id: `m_${Date.now() + 1}`,
      role: 'bot',
      content: <AnalysisCard data={analysis} />,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, botMsg]);
    setTyping(false);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
  };

  const suggestions = [
    'https://shopee.vn/iphone-15-pro-256gb',
    'https://tiki.vn/macbook-air-m3',
    'https://lazada.vn/airpods-pro-2',
  ];

  return (
    <main className="bg-white min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <section className="bg-surface-muted border-b border-line py-10 md:py-12 mt-16 md:mt-20">
        <div className="container-page">
          <div className="eyebrow mb-3">Công cụ mới</div>
          <h1
            className="font-display font-bold text-ink tracking-tight"
            style={{ fontSize: 'clamp(1.875rem, 4vw, 2.75rem)', letterSpacing: '-0.03em' }}
          >
            Gợi ý giá AI
          </h1>
          <p className="text-ink-muted mt-2 max-w-2xl">
            Dán link sản phẩm — bot phân tích lịch sử 90 ngày, phát hiện giá ảo và khuyến nghị
            thời điểm mua hợp lý nhất.
          </p>
        </div>
      </section>

      {/* Chat */}
      <section className="flex-1 flex flex-col">
        <div className="container-page flex-1 flex flex-col py-6">
          <div
            ref={scrollRef}
            className="flex-1 max-h-[60vh] overflow-y-auto pr-2 space-y-4 pb-4"
          >
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}
            {typing && (
              <div className="flex items-start gap-3">
                <BotAvatar />
                <div className="bg-surface-muted px-4 py-3 rounded-2xl rounded-tl-sm">
                  <TypingDots />
                </div>
              </div>
            )}
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="flex flex-wrap gap-2 pb-3">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-line text-ink-muted hover:text-ink hover:border-ink-muted transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <form
            onSubmit={onSubmit}
            className="card p-2 flex items-center gap-2 sticky bottom-4 bg-white"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Dán link sản phẩm Shopee, Lazada, Tiki hoặc TikTok Shop..."
              className="flex-1 px-3 py-2 bg-transparent outline-none text-sm placeholder:text-ink-subtle"
              disabled={typing}
            />
            <button
              type="submit"
              disabled={typing || !input.trim()}
              className="btn-primary disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Phân tích</span>
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isBot = message.role === 'bot';
  if (isBot) {
    return (
      <div className="flex items-start gap-3 max-w-[90%] md:max-w-[80%]">
        <BotAvatar />
        <div className="bg-surface-muted px-4 py-3 rounded-2xl rounded-tl-sm text-sm text-ink max-w-full">
          {message.content}
        </div>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 justify-end">
      <div className="bg-ink text-white px-4 py-3 rounded-2xl rounded-tr-sm text-sm max-w-[85%] break-all">
        {message.content}
      </div>
    </div>
  );
}

function BotAvatar() {
  return (
    <div className="w-8 h-8 rounded-full bg-brand text-white flex items-center justify-center shrink-0">
      <Sparkles className="w-4 h-4" />
    </div>
  );
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1">
      <span className="w-1.5 h-1.5 rounded-full bg-ink-subtle animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-ink-subtle animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1.5 h-1.5 rounded-full bg-ink-subtle animate-bounce" />
    </div>
  );
}