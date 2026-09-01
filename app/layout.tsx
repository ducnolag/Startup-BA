import type { Metadata, Viewport } from 'next';
import { Inter, Sora } from 'next/font/google';
import './globals.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import { AuthProvider } from '@/components/providers/AuthProvider';

const displayFont = Sora({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const bodyFont = Inter({
  subsets: ['latin', 'latin-ext'],
  variable: '--font-body',
  weight: ['400', '500', '600'],
  display: 'swap',
});

const SITE_URL = 'https://toolify.vn';
const SITE_NAME = 'Toolify.vn';
const SITE_DESC =
  'Toolify.vn — Nền tảng công cụ thông minh cho người Việt: săn học bổng quốc tế, so sánh giá 4 sàn TMĐT, theo dõi lịch sử giá và phát hiện giá ảo. Miễn phí, nhanh, chuẩn SEO.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Toolify.vn — Công cụ săn học bổng & so sánh giá thông minh',
    template: '%s · Toolify.vn',
  },
  description: SITE_DESC,
  keywords: [
    'săn học bổng',
    'so sánh giá',
    'học bổng Chevening',
    'học bổng Erasmus',
    'giá ảo',
    'Shopee',
    'Lazada',
    'Tiki',
    'TikTok Shop',
    'công cụ sinh viên',
    'toolify',
    'Việt Nam',
  ],
  authors: [{ name: 'Toolify Team' }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  applicationName: SITE_NAME,
  alternates: {
    canonical: SITE_URL,
    languages: {
      'vi-VN': SITE_URL,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: SITE_URL,
    siteName: SITE_NAME,
    title: 'Toolify.vn — Công cụ săn học bổng & so sánh giá thông minh',
    description: SITE_DESC,
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Toolify.vn — Công cụ săn học bổng & so sánh giá thông minh',
    description: SITE_DESC,
    images: ['/logo.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  category: 'technology',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

// JSON-LD organization data
const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/logo.png`,
  description: SITE_DESC,
  foundingDate: '2024',
  sameAs: [],
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: SITE_NAME,
  url: SITE_URL,
  inLanguage: 'vi-VN',
  potentialAction: {
    '@type': 'SearchAction',
    target: `${SITE_URL}/tools/scholarship?q={search_term_string}`,
    'query-input': 'required name=search_term_string',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body className="bg-white text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <AuthProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </AuthProvider>
      </body>
    </html>
  );
}