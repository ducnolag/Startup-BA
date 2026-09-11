'use client';

import { useState } from 'react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from './components/Hero';
import UploadForm from './components/UploadForm';
import DownloadResult from './components/DownloadResult';
import { Loader2, ShieldCheck, Info } from 'lucide-react';

export default function WatermarkRemoverPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<{
    cleanedFilename: string;
    originalSize: number;
    cleanedSize: number;
    downloadUrl: string;
  } | null>(null);

  const handleClean = async () => {
    if (!file) {
      setError('Vui lòng chọn file trước.');
      return;
    }
    setError('');
    setLoading(true);
    setResult(null);

    try {
      const form = new FormData();
      form.append('file', file);

      const res = await fetch('/api/tools/watermark-remover', {
        method: 'POST',
        body: form,
      });

      if (!res.ok) {
        // Thử parse JSON error
        let msg = `Lỗi ${res.status} từ server.`;
        try {
          const data = await res.json();
          if (data?.detail) msg = data.detail;
        } catch {
          /* not JSON, ignore */
        }
        setError(msg);
        return;
      }

      // Lấy cleaned filename từ header Content-Disposition
      const cd = res.headers.get('content-disposition') ?? '';
      const m = cd.match(/filename="?([^"]+)"?/);
      const cleanedFilename = m?.[1] ?? `cleaned-${file.name}`;

      const blob = await res.blob();
      const downloadUrl = URL.createObjectURL(blob);

      const originalSize = Number(res.headers.get('x-original-size') ?? file.size);
      const cleanedSize = Number(res.headers.get('x-cleaned-size') ?? blob.size);

      setResult({
        cleanedFilename,
        originalSize,
        cleanedSize,
        downloadUrl,
      });

      setTimeout(() => {
        document
          .getElementById('result-section')
          ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 60);
    } catch (e) {
      console.error('[watermark-remover]', e);
      setError('Không kết nối được với máy chủ xử lý. Hãy thử lại sau vài giây.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    if (result?.downloadUrl) URL.revokeObjectURL(result.downloadUrl);
    setResult(null);
    setError('');
    setFile(null);
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

      {/* Uploader */}
      <section id="uploader" className="py-12 md:py-16">
        <div className="container-page max-w-4xl">
          <div className="card p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-brand/5 border border-brand/20">
              <Info className="h-4 w-4 text-brand-deep shrink-0 mt-0.5" />
              <p className="text-sm text-ink leading-relaxed">
                <strong>Strip metadata AI provenance</strong> — C2PA manifest, EXIF,
                XMP, doc properties — khỏi file của bạn. Hỗ trợ Claude, Gemini SynthID,
                OpenAI provenance. <em>Chỉ dùng cho nội dung bạn sở hữu</em>.
              </p>
            </div>

            <UploadForm file={file} onFile={setFile} disabled={loading} />

            <div className="flex items-center justify-between pt-4 border-t border-line">
              <div className="text-xs text-ink-subtle">
                {file ? (
                  <span>
                    Sẵn sàng strip <strong className="text-ink">{file.name}</strong>
                    {' · '}
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </span>
                ) : (
                  'Chưa có file nào được chọn.'
                )}
              </div>
              <button
                type="button"
                onClick={handleClean}
                disabled={!file || loading}
                className="btn-primary disabled:opacity-60"
                style={{ backgroundColor: '#5b21b6' }} // depth color
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang xử lý…
                  </>
                ) : (
                  <>
                    <ShieldCheck className="h-4 w-4" />
                    Strip metadata
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

      {/* Result */}
      {result && (
        <section id="result-section" className="pb-12 md:pb-16">
          <div className="container-page max-w-4xl">
            <DownloadResult
              cleanedFilename={result.cleanedFilename}
              originalSize={result.originalSize}
              cleanedSize={result.cleanedSize}
              downloadUrl={result.downloadUrl}
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
                title: 'Upload file',
                body:
                  'Kéo thả hoặc chọn PDF, DOCX, hoặc ảnh. Hỗ trợ PNG, JPG, WebP, HEIC, AVIF, BMP, GIF, TIFF, SVG. Tối đa 50 MB.',
              },
              {
                n: '02',
                title: 'Engine xử lý local',
                body:
                  'Sidecar Python (exiftool + qpdf + ghostscript) đọc file, ghi lại không có metadata AI. Logic adapted từ guillaumemeyer/watermarks-remover.',
              },
              {
                n: '03',
                title: 'Tải về file sạch',
                body:
                  'File mới không có C2PA manifest, không có EXIF/XMP AI tags, không có doc props. File cũ + mới đều bị xoá sau khi response trả về.',
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
            <h3 className="font-display font-semibold text-ink text-lg mb-3">
              Metadata nào bị strip?
            </h3>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-ink-muted">
              <div>
                <div className="font-semibold text-ink mb-1">Trên PDF</div>
                <ul className="space-y-0.5 leading-relaxed">
                  <li>· XMP metadata (Adobe, C2PA claim)</li>
                  <li>· Document Info dictionary (Author, Producer, Creator)</li>
                  <li>· Embedded image EXIF / XMP / IPTC</li>
                  <li>· C2PA JUMBF manifest</li>
                  <li>· File attachment metadata</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink mb-1">Trên ảnh (PNG / JPG / WebP / …)</div>
                <ul className="space-y-0.5 leading-relaxed">
                  <li>· EXIF (Camera, GPS, Make, Model)</li>
                  <li>· XMP (Adobe, C2PA)</li>
                  <li>· IPTC (caption, credit)</li>
                  <li>· PNG tEXt / zTXt chunks (Author, Software)</li>
                  <li>· C2PA / SynthID manifest box</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink mb-1">Trên DOCX / XLSX / PPTX</div>
                <ul className="space-y-0.5 leading-relaxed">
                  <li>· core.xml (creator, lastModifiedBy)</li>
                  <li>· app.xml (application, template)</li>
                  <li>· custom.xml (custom properties)</li>
                </ul>
              </div>
              <div>
                <div className="font-semibold text-ink mb-1">Lưu ý</div>
                <ul className="space-y-0.5 leading-relaxed">
                  <li>· Pixel-domain watermarks (SynthID image) không bị strip — đó là research-only.</li>
                  <li>· Bảo toàn nội dung file 100%, chỉ metadata bị xoá.</li>
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
