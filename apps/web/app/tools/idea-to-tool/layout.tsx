import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Idea-to-Tool',
  description:
    'Mô tả vấn đề của bạn — AI gợi ý công cụ phù hợp trong 30 giây. Phân loại 9 danh mục, 3 công cụ + 3 bước hành động cụ thể.',
  alternates: { canonical: 'https://toolify.vn/tools/idea-to-tool' },
  openGraph: {
    title: 'Idea-to-Tool — Từ vấn đề đến giải pháp, trong 30 giây',
    description:
      'AI phân loại vấn đề và gợi ý công cụ phù hợp — kèm action plan cụ thể để bạn bắt đầu ngay hôm nay.',
  },
};

export default function IdeaToToolLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      {/* Subtle top accent */}
      <div
        className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-depth"
        aria-hidden
      />
      {children}
    </div>
  );
}
