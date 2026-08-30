import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';

// Sora — geometric, premium display font matching Toolify logo's bold italic style
const displayFont = Sora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  weight: ['300', '400', '500', '600', '700', '800'],
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  weight: ['300', '400', '500', '600'],
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://toolify.vn'),
  title: {
    default: 'Toolify.vn — Nền tảng công cụ thông minh cho người Việt',
    template: '%s · Toolify.vn',
  },
  description:
    'Toolify.vn cung cấp các công cụ nhỏ, giải quyết vấn đề thực tế: săn học bổng, so sánh giá thông minh. Nhanh, miễn phí, và được tin dùng bởi cộng đồng.',
  keywords: ['học bổng', 'so sánh giá', 'công cụ sinh viên', 'săn sale', 'toolify', 'Việt Nam'],
  authors: [{ name: 'Toolify Team' }],
  creator: 'Toolify.vn',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://toolify.vn',
    siteName: 'Toolify.vn',
    title: 'Toolify.vn — Nền tảng công cụ thông minh',
    description: 'Hàng chục công cụ nhỏ, miễn phí/có phí thấp, giải quyết vấn đề thực tế của người Việt.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolify.vn — Nền tảng công cụ thông minh',
    description: 'Săn học bổng, so sánh giá, và hơn thế nữa — tất cả ở một nơi.',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#020409',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-[#020409] text-white antialiased">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
