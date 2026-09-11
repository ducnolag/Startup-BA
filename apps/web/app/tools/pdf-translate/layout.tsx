import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'PDF Translate',
  description:
    'Upload PDF (báo, tạp chí, tài liệu). AI đọc từng trang và dịch sang tiếng Việt hoặc 5 ngôn ngữ khác. Xuất Markdown.',
  alternates: { canonical: 'https://toolify.vn/tools/pdf-translate' },
  openGraph: {
    title: 'PDF Translate — Dịch tài liệu PDF sang tiếng Việt',
    description:
      'Upload PDF (báo, tạp chí, giáo trình). AI đọc từng trang và dịch sang tiếng Việt. Tải về bản Markdown.',
  },
};

export default function PdfTranslateLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Subtle top accent — đồng nhất với idea-to-tool layout */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-depth"
        aria-hidden
      />
      {children}
    </div>
  );
}
