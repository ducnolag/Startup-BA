'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { CATALOG } from '@/lib/price/data';
import { fetchLivePrice, type LivePriceResult } from '@/lib/price/scraper';
import { analyzeProduct } from '@/lib/price/analyzer';
import type { ProductAnalysis, ProductRecord } from '@/lib/price/types';
import Hero from './components/Hero';
import PriceInput from './components/PriceInput';
import AnalysisResult from './components/AnalysisResult';
import PriceChart from './components/PriceChart';
import HowItWorks from './components/HowItWorks';
import Stats from './components/Stats';
import CategorySection from './components/CategorySection';
import FeaturedProducts from './components/FeaturedProducts';
import CTABanner from './components/CTABanner';

interface ErrorState {
  message: string;
  suggestions: ProductRecord[];
}

export default function PriceSmartPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [analysis, setAnalysis] = useState<ProductAnalysis | null>(null);
  const [error, setError] = useState<ErrorState | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [isMockData, setIsMockData] = useState(false);
  const [liveMeta, setLiveMeta] = useState<LivePriceResult | null>(null);

  const resultsRef = useRef<HTMLDivElement>(null);
  const inputSectionRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to results khi phân tích xong
  useEffect(() => {
    if (analysis && resultsRef.current) {
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
  }, [analysis]);

  // Animate input section reveal
  useEffect(() => {
    if (!inputSectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        inputSectionRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
      );
    });
    return () => ctx.revert();
  }, []);

  const handleAnalyze = async (input: string) => {
    setIsLoading(true);
    setError(null);
    setAnalysis(null);
    setIsDemo(false);
    setIsMockData(false);
    setLiveMeta(null);

    try {
      // Gọi API server-side: catalog → cache → Gemini Search → mock
      const live = await fetchLivePrice(input);
      const analysisResult = analyzeProduct(live.product);
      setAnalysis(analysisResult);
      setLiveMeta(live);

      // Đánh dấu mock nếu không có live data
      setIsMockData(!live.isLiveData);
    } catch (err) {
      console.error(err);
      setError({
        message: 'Có lỗi xảy ra khi phân tích. Vui lòng thử lại.',
        suggestions: CATALOG.slice(0, 3),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickProduct = (p: ProductRecord) => {
    // Direct pick = analyze without URL parsing
    setError(null);
    setIsDemo(false);
    setAnalysis(analyzeProduct(p));
  };

  const handleDemo = () => {
    // Demo với sản phẩm hot nhất (Xiaomi Air Purifier — đang sale)
    setError(null);
    setIsDemo(true);
    const demoProduct = CATALOG.find((p) => p.slug === 'xiaomi-air-purifier-4') ?? CATALOG[0];
    setAnalysis(analyzeProduct(demoProduct));
  };

  const handleReset = () => {
    setAnalysis(null);
    setError(null);
    setIsDemo(false);
    setIsMockData(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      <Navigation />

      <main className="bg-white min-h-screen">
        {/* Hero + Input (anchored for CTA link) */}
        <div id="analyze">
          <Hero />
          <div ref={inputSectionRef} className="pb-12 opacity-0">
            <div className="container-page">
              <PriceInput onAnalyze={handleAnalyze} isLoading={isLoading} onDemo={handleDemo} />
            </div>
          </div>
        </div>

        {/* Error state with suggestions */}
        {error && (
          <div className="container-page mb-12">
            <div className="max-w-3xl mx-auto">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0" />
                  <div className="text-sm text-ink leading-relaxed flex-1">
                    {error.message}
                  </div>
                </div>
              </div>
              {error.suggestions.length > 0 && (
                <>
                  <div className="text-center text-xs text-ink-subtle mb-4 uppercase tracking-wider">
                    Hoặc thử một trong những sản phẩm này
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {error.suggestions.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => handlePickProduct(p)}
                        className="text-left bg-white border border-line rounded-xl p-3 hover:border-line-strong hover:shadow-md transition-all group"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className="w-12 h-12 rounded-lg shrink-0 flex items-center justify-center text-2xl"
                            style={{
                              background: `linear-gradient(135deg, ${p.gradient[0]}, ${p.gradient[1]})`,
                            }}
                          >
                            {p.image}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-[10px] font-semibold text-ink-subtle uppercase tracking-wider">
                              {p.brand}
                            </div>
                            <div className="text-xs font-medium text-ink leading-snug line-clamp-2">
                              {p.name}
                            </div>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Analysis result section */}
        {analysis && (
          <div ref={resultsRef} className="container-page pb-16 md:pb-20 scroll-mt-24">
            {/* Demo mode indicator + reset */}
            <div className="max-w-5xl mx-auto mb-5 flex items-center justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-2 flex-wrap">
                {isDemo && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-brand/10 text-brand-deep">
                    Bản xem trước
                  </span>
                )}
                {liveMeta?.isLiveData && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-emerald-100 text-emerald-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Giá thật
                  </span>
                )}
                {!liveMeta?.isLiveData && isMockData && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md bg-amber-100 text-amber-700">
                    Ước tính
                  </span>
                )}
                <span className="text-xs text-ink-subtle">
                  {isDemo
                    ? 'Đây là phân tích mẫu — dán link thật để có dữ liệu chính xác'
                    : liveMeta?.isLiveData
                      ? `Cập nhật lúc ${new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })} từ Google Search`
                      : isMockData
                        ? 'Dữ liệu ước tính. Không tìm thấy trên Shopee/Lazada/Tiki/TikTok Shop.'
                        : 'Phân tích bởi AI · 4 sàn TMĐT VN'}
                </span>
                {liveMeta?.isLiveData && liveMeta.sources.length > 0 && (
                  <a
                    href={liveMeta.sources[0].url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-brand-deep hover:underline font-medium"
                  >
                    Xem nguồn ↗
                  </a>
                )}
              </div>
              <button
                onClick={handleReset}
                className="text-xs text-ink-muted hover:text-ink underline underline-offset-2"
              >
                ← Phân tích sản phẩm khác
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5 md:gap-6">
              <AnalysisResult analysis={analysis} />
              <PriceChart analysis={analysis} />
            </div>
          </div>
        )}

        {/* Empty state — full landing page sections */}
        {!analysis && !isLoading && (
          <>
            <Stats />
            <FeaturedProducts onPick={handlePickProduct} />
            <CategorySection />
            <HowItWorks />
            <CTABanner />
          </>
        )}

        {/* Back link */}
        <div className="container-page pb-16 text-center">
          <Link
            href="/tools"
            className="inline-flex items-center gap-1.5 text-sm text-ink-muted hover:text-ink transition-colors"
          >
            ← Quay lại tất cả công cụ
          </Link>
        </div>
      </main>

      <Footer />
    </>
  );
}