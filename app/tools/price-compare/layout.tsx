import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'So sánh giá thông minh',
  description:
    'So sánh giá Shopee, Lazada, Tiki, TikTok Shop. Lịch sử giá 90 ngày, phát hiện giá ảo, gợi ý thời điểm mua tối ưu.',
  keywords: [
    'so sánh giá',
    'giá ảo',
    'lịch sử giá',
    'Shopee',
    'Lazada',
    'Tiki',
    'TikTok Shop',
  ],
  alternates: { canonical: 'https://toolify.vn/tools/price-compare' },
  openGraph: {
    title: 'So sánh giá thông minh — Toolify.vn',
    description:
      'So sánh giá 4 sàn TMĐT VN, lịch sử 90 ngày, phát hiện giá ảo, gợi ý thời điểm mua.',
    url: 'https://toolify.vn/tools/price-compare',
    siteName: 'Toolify.vn',
    locale: 'vi_VN',
    type: 'website',
  },
};

export default function PriceCompareLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}