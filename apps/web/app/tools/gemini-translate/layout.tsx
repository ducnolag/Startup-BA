import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Gemini Translate',
  description:
    'Dịch nhanh văn bản giữa 8 ngôn ngữ (Việt, Anh, Trung, Nhật, Hàn, Pháp, Tây Ban Nha, Đức). Giữ nguyên ý và giọng văn gốc.',
  alternates: { canonical: 'https://toolify.vn/tools/gemini-translate' },
  openGraph: {
    title: 'Gemini Translate — Dịch nhanh, giữ nguyên ý',
    description: 'Dịch thuật đa ngôn ngữ powered by Gemini 2.0 Flash. Miễn phí, nhanh dưới 2 giây.',
  },
};

export default function GeminiTranslateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-depth"
        aria-hidden
      />
      {children}
    </div>
  );
}
