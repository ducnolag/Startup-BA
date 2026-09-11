import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Strip AI Metadata',
  description:
    'Xoá metadata AI provenance (C2PA / SynthID / EXIF / XMP / doc props) khỏi PDF, DOCX, ảnh. Xử lý local, không upload lên cloud.',
  alternates: { canonical: 'https://toolify.vn/tools/watermark-remover' },
  openGraph: {
    title: 'Strip AI Metadata — xoá C2PA / SynthID / EXIF khỏi PDF, DOCX, ảnh',
    description:
      'Xoá metadata AI khỏi PDF, DOCX, ảnh. Hỗ trợ Claude / Gemini SynthID / OpenAI provenance.',
  },
};

export default function WatermarkRemoverLayout({ children }: { children: React.ReactNode }) {
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
