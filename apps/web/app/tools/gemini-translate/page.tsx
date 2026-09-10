import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import Hero from './components/Hero';
import Translator from './components/Translator';

export default function GeminiTranslatePage() {
  return (
    <main className="bg-white min-h-screen">
      <Navigation />
      <Hero />
      <Translator />

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-20 bg-surface-muted border-t border-line">
        <div className="container-page max-w-4xl">
          <div className="eyebrow mb-5">Cách hoạt động</div>
          <h2 className="font-display font-bold text-ink tracking-tight text-3xl md:text-4xl mb-10">
            Dịch trong 3 bước.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { n: '01', title: 'Chọn ngôn ngữ', body: 'Chọn ngôn ngữ nguồn (hoặc để "Tự động") và ngôn ngữ đích trong 8 ngôn ngữ được hỗ trợ.' },
              { n: '02', title: 'Dán văn bản', body: 'Tối đa 5000 ký tự mỗi lượt. Phù hợp email, đoạn văn ngắn, caption mạng xã hội.' },
              { n: '03', title: 'Nhận bản dịch', body: 'Gemini giữ nguyên format và giọng văn. Bạn có thể copy, đổi chiều hoặc dịch tiếp ngay.' },
            ].map((step) => (
              <div key={step.n} className="card p-6">
                <div className="font-mono text-xs text-brand mb-3">{step.n}</div>
                <h3 className="font-display font-semibold text-ink text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-ink-muted leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 card p-6 md:p-7 bg-white">
            <h3 className="font-display font-semibold text-ink text-lg mb-3">Hỗ trợ</h3>
            <div className="flex flex-wrap gap-2">
              {['Tiếng Việt', 'English', '中文 (Trung)', '日本語 (Nhật)', '한국어 (Hàn)', 'Français (Pháp)', 'Español (Tây Ban Nha)', 'Deutsch (Đức)'].map((l) => (
                <span key={l} className="chip">{l}</span>
              ))}
            </div>
            <p className="text-xs text-ink-muted mt-4 leading-relaxed">
              Đối với văn bản dài hơn 5000 ký tự, hãy chia nhỏ thành nhiều lượt. Văn bản được gửi đến Gemini API của Google theo chính sách bảo mật của Google.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
