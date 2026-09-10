'use client';

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from './components/Hero';
import ProblemForm from './components/ProblemForm';
import ResultCard from './components/ResultCard';

interface IdeaToolResult {
  category: string;
  tools: { name: string; description: string; effort: 'low' | 'medium' | 'high'; impact: 'low' | 'medium' | 'high' }[];
  next_steps: string[];
  refinement_question: string;
  summary: string;
}

export default function IdeaToToolPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{ data: IdeaToolResult; demoMode: boolean } | null>(null);

  const handleResult = (data: unknown, demoMode: boolean) => {
    setResult({ data: data as IdeaToolResult, demoMode });
    // Scroll to result
    setTimeout(() => {
      document.getElementById('result-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleRefine = () => {
    setResult(null);
    setError('');
    setTimeout(() => {
      document.getElementById('problem-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <Hero />

      <ProblemForm
        onResult={handleResult}
        onError={setError}
        onLoading={setLoading}
        loading={loading}
      />

      {error && (
        <section className="pb-8">
          <div className="container-page max-w-3xl">
            <div className="px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
              {error}
            </div>
          </div>
        </section>
      )}

      {result && (
        <section id="result-section" className="pb-12">
          <div className="container-page max-w-3xl">
            <ResultCard result={result.data} demoMode={result.demoMode} onRefine={handleRefine} />
          </div>
        </section>
      )}

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-20 bg-surface-muted border-t border-line">
        <div className="container-page max-w-4xl">
          <div className="eyebrow mb-5">Cách hoạt động</div>
          <h2 className="font-display font-bold text-ink tracking-tight text-3xl md:text-4xl mb-10">
            3 bước đơn giản.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                n: '01',
                title: 'Mô tả vấn đề',
                body:
                  'Viết 2-3 câu về điều bạn đang vướng mắc — đối tượng, quy mô, ngân sách nếu có. Càng cụ thể, AI gợi ý càng chính xác.',
              },
              {
                n: '02',
                title: 'AI phân tích',
                body:
                  'Gemini 2.0 Flash đọc mô tả, phân loại vào 9 danh mục vấn đề (productivity, sales, content…), sau đó gợi ý 3 công cụ phù hợp nhất.',
              },
              {
                n: '03',
                title: 'Hành động ngay',
                body:
                  'Bạn nhận 3 công cụ + 3 bước cụ thể để bắt đầu trong 24h. Nếu cần hiểu rõ hơn, đặt câu hỏi refinement cho lượt sau.',
              },
            ].map((step) => (
              <div key={step.n} className="card p-6">
                <div className="font-mono text-xs text-brand mb-3">{step.n}</div>
                <h3 className="font-display font-semibold text-ink text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
