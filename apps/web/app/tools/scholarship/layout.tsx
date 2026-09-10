import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Săn học bổng quốc tế',
  description:
    'Tổng hợp 500+ học bổng Chevening, Erasmus, Fulbright, Coursera. Lọc theo ngành, GPA, quốc gia. Cập nhật liên tục và miễn phí.',
  keywords: [
    'học bổng Chevening',
    'học bổng Erasmus',
    'học bổng Fulbright',
    'học bổng DAAD',
    'Coursera miễn phí',
    'học bổng quốc tế',
  ],
  alternates: { canonical: 'https://toolify.vn/tools/scholarship' },
  openGraph: {
    title: 'Săn học bổng quốc tế — Toolify.vn',
    description:
      '500+ học bổng Chevening, Erasmus, Fulbright và khóa học miễn phí. Lọc theo ngành, GPA, quốc gia.',
    url: 'https://toolify.vn/tools/scholarship',
    siteName: 'Toolify.vn',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function ScholarshipLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}