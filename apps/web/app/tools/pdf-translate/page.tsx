'use client';

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from './components/Hero';
import PdfUploader from './components/PdfUploader';
import ResultView, { TranslateResult } from './components/ResultView';
import { Languages, Loader2, Sparkles } from 'lucide-react';

const TARGET_LANGS = [
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'zh', label: '中文 (Trung)', flag: '🇨🇳' },
  { code: 'ja', label: '日本語 (Nhật)', flag: '🇯🇵' },
  { code: 'ko', label: '한국어 (Hàn)', flag: '🇰🇷' },
  { code: 'fr', label: 'Français (Pháp)', flag: '🇫🇷' },
];

export default function PdfTranslatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [target, setTarget] = useState('vi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<TranslateResult | null>(null);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfFilename, setPdfFilename] = useState('translated.pdf');

  const handleTranslate = async () => {
    if (!file) {
      setError('Vui lòng chọn file PDF trước.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);
    setPdfBlob(null);

    try {
      // Bước 1: Tải về PDF đã dịch (binary) — đây là output chính, giữ layout gốc.
      const pdfForm = new FormData();
      pdfForm.append('file', file);
      pdfForm.append('target', target);
      pdfForm.append('format', 'pdf');

      const pdfRes = await fetch('/api/tools/pdf-translate', {
        method: 'POST',
        body: pdfForm,
      });

      if (!pdfRes.ok) {
        let msg = 'Có lỗi xảy ra khi xử lý PDF.';
        try {
          const data = await pdfRes.json();
          if (data?.error) msg = String(data.error);
        } catch {
          msg = `Server trả về lỗi ${pdfRes.status}`;
        }
        setError(msg);
        return;
      }

      const pdfBuf = await pdfRes.blob();
      const downloadName =
        pdfRes.headers.get('content-disposition')?.match(/filename="?([^";]+)"?/)?.[1] ??
        'translated.pdf';
      setPdfBlob(pdfBuf);
      setPdfFilename(downloadName);

      // Bước 2: Song song — lấy bản text để hiển thị preview bên dưới.
      const textForm = new FormData();
      textForm.append('file', file);
      textForm.append('target', target);
      textForm.append('format', 'text');

      let textData: TranslateResult | null = null;
      try {
        const textRes = await fetch('/api/tools/pdf-translate', {
          method: 'POST',
          body: textForm,
        });
        if (textRes.ok) {
          const json = await textRes.json();
          textData = {
            source_language: json.source_language,
            page_count: json.page_count,
            pages: json.pages ?? [],
            target_label: json.target_label,
            reason: json.reason,
            demo_mode: json.demo_mode,
          };
        }
        // Nếu text mode fail, không chặn người dùng tải PDF — chỉ thiếu preview.
      } catch (e) {
        console.warn('[pdf-translate] text preview fetch failed:', e);
      }

      setResult(textData);

      setTimeout(() => {
        document
          .getElementById('result-section')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } catch (e) {
      setError('Không kết nối được với máy chủ. Vui lòng thử lại.');
      console.error('[pdf-translate]', e);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setResult(null);
    setError('');
    setFile(null);
    setPdfBlob(null);
    setTimeout(() => {
      document
        .getElementById('uploader')
        ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 60);
  };

  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <Hero />

      {/* Uploader section */}
      <section id="uploader" className="py-12 md:py-16">
        <div className="container-page max-w-4xl">
          <div className="card p-6 md:p-8 space-y-6">
            <div>
              <h2 className="font-display font-bold text-xl text-ink mb-1">
                1. Chọn file PDF
              </h2>
              <p className="text-sm text-ink-muted">
                Báo, tạp chí, giáo trình, tài liệu kỹ thuật — tối đa 20 MB.
              </p>
              <div className="mt-4">
                <PdfUploader file={file} onFile={setFile} disabled={loading} />
              </div>
            </div>

            <div>
              <h2 className="font-display font-bold text-xl text-ink mb-1">
                2. Chọn ngôn ngữ đích
              </h2>
              <p className="text-sm text-ink-muted mb-4">
                Mặc định dịch sang tiếng Việt. Chọn ngôn ngữ khác nếu cần.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {TARGET_LANGS.map((l) => (
                  <button
                    key={l.code}
                    type="button"
                    onClick={() => setTarget(l.code)}
                    disabled={loading}
                    className={[
                      'flex items-center gap-2.5 px-4 py-3 rounded-xl border text-left text-sm transition-all',
                      target === l.code
                        ? 'border-ink bg-ink text-white shadow-card'
                        : 'border-line bg-white text-ink hover:border-ink hover:bg-surface-muted',
                      loading ? 'opacity-60 pointer-events-none' : '',
                    ].join(' ')}
                  >
                    <span className="text-xl">{l.flag}</span>
                    <span className="font-semibold">{l.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-line">
              <div className="text-xs text-ink-subtle">
                {file ? (
                  <span>
                    Sẵn sàng dịch <strong className="text-ink">{file.name}</strong>
                    {' · '}
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                ) : (
                  'Chưa có file nào được chọn.'
                )}
              </div>
              <button
                type="button"
                onClick={handleTranslate}
                disabled={!file || loading}
                className="btn-primary disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang dịch…
                  </>
                ) : (
                  <>
                    <Languages className="h-4 w-4" />
                    Dịch PDF
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="px-4 py-3 rounded-lg bg-danger/10 border border-danger/30 text-sm text-danger">
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Result section */}
      {result && (
        <section id="result-section" className="pb-12 md:pb-16">
          <div className="container-page max-w-4xl">
            <ResultView
              result={result}
              pdfBlob={pdfBlob}
              pdfFilename={pdfFilename}
              onReset={handleReset}
            />
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
                title: 'Upload PDF',
                body:
                  'Kéo thả hoặc chọn file PDF từ máy. Hỗ trợ tối đa 20 MB — phù hợp báo, tạp chí, slide bài giảng.',
              },
              {
                n: '02',
                title: 'AI đọc và dịch',
                body:
                  'Gemini 2.5 Flash nhận file qua Files API, đọc từng trang và dịch sang ngôn ngữ đích. Giữ heading, bullet, bảng biểu.',
              },
              {
                n: '03',
                title: 'Tải về PDF giữ layout',
                body:
                  'Tải về bản PDF đã dịch — giữ nguyên font, cột, hình ảnh, header/footer của bản gốc. Xem nhanh bản text bên dưới.',
              },
            ].map((step) => (
              <div key={step.n} className="card p-6">
                <div className="font-mono text-xs text-brand mb-3">{step.n}</div>
                <h3 className="font-display font-semibold text-ink text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 card p-6 md:p-7 bg-white">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-brand shrink-0 mt-0.5" />
              <div>
                <h3 className="font-display font-semibold text-ink text-lg mb-2">
                  Mẹo để bản dịch tốt nhất
                </h3>
                <ul className="space-y-1.5 text-sm text-ink-muted leading-relaxed">
                  <li>· PDF dạng text (Word/Google Docs export) cho bản dịch chính xác nhất — layout được giữ nguyên.</li>
                  <li>· PDF scan (chỉ có hình ảnh) vẫn dịch được — AI sẽ OCR nội dung và dịch. Chất lượng phụ thuộc độ phân giải.</li>
                  <li>· File PDF gốc từ Word/Google Docs có chất lượng tốt nhất. Tránh PDF là scan ảnh mờ.</li>
                  <li>· Bảng biểu phức tạp / biểu đồ được dịch dạng text tại vị trí gốc.</li>
                  <li>· Tài liệu có nhiều trang (&gt; 50 trang) sẽ mất nhiều thời gian hơn — kiên nhẫn chờ.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}