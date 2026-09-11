// =====================================================================
// PDF Translate API — proxy Next.js → pdf-translator sidecar (FastAPI)
//
// Endpoint: POST /api/tools/pdf-translate
// Body: multipart/form-data
//   - file:   PDF file (application/pdf), max 20 MB
//   - target: target language code (vi/en/zh/ja/ko/fr/de/es), default 'vi'
//   - format: "pdf" (default — returns binary PDF, layout-preserving)
//             | "text" (returns JSON envelope with translated text per page)
//
// Why the move from inline Gemini to a sidecar:
//   The previous inline implementation called Gemini's Files API and returned
//   plain text, which lost the original layout (fonts, columns, images,
//   headers, footers). The new sidecar uses PyMuPDF to extract text spans
//   with positions/fonts, asks Gemini to translate each page, then redacts
//   the original text and re-renders translated text at the same anchors.
//   See apps/pdf-translator/app.py for the pipeline.
//
// Service URL mặc định: http://pdf-translator:8767 (trong compose).
// Override bằng PDF_TRANSLATOR_SERVICE_URL khi chạy ngoài compose.
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_SERVICE_URL = 'http://pdf-translator:8767';
const MAX_BYTES = 20 * 1024 * 1024; // 20 MB — kept in sync with sidecar.
const ALLOWED_MIME = new Set(['application/pdf']);
const SUPPORTED_LANGS = ['vi', 'en', 'zh', 'ja', 'ko', 'fr', 'de', 'es'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const LANG_NAMES: Record<Lang, string> = {
  vi: 'tiếng Việt',
  en: 'tiếng Anh (English)',
  zh: 'tiếng Trung (中文)',
  ja: 'tiếng Nhật (日本語)',
  ko: 'tiếng Hàn (한국어)',
  fr: 'tiếng Pháp (Français)',
  de: 'tiếng Đức (Deutsch)',
  es: 'tiếng Tây Ban Nha (Español)',
};

function getServiceUrl(): string {
  return (
    process.env.PDF_TRANSLATOR_SERVICE_URL?.replace(/\/+$/, '') ||
    DEFAULT_SERVICE_URL
  );
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: NextRequest) {
  // Lấy FormData từ client (multipart)
  let clientForm: FormData;
  try {
    clientForm = await req.formData();
  } catch {
    return jsonError('Body không phải multipart/form-data hợp lệ.', 400);
  }

  const file = clientForm.get('file');
  if (!(file instanceof File)) {
    return jsonError('Thiếu file PDF. Hãy chọn một file .pdf rồi thử lại.', 400);
  }
  if (!ALLOWED_MIME.has(file.type)) {
    return jsonError(
      `Định dạng không hỗ trợ: "${file.type || 'unknown'}". Chỉ chấp nhận application/pdf.`,
      400,
    );
  }
  if (file.size === 0) {
    return jsonError('File rỗng — không có gì để dịch.', 400);
  }
  if (file.size > MAX_BYTES) {
    const sizeMb = (file.size / 1024 / 1024).toFixed(1);
    return jsonError(
      `File ${sizeMb} MB vượt quá giới hạn 20 MB. Hãy tách nhỏ PDF hoặc nén trước khi upload.`,
      413,
    );
  }

  // target / format lấy từ form (POST multipart) hoặc query (?format=text).
  const targetRaw = String(
    clientForm.get('target') ?? req.nextUrl.searchParams.get('target') ?? 'vi',
  ).toLowerCase();
  const target = (SUPPORTED_LANGS as readonly string[]).includes(targetRaw)
    ? (targetRaw as Lang)
    : null;
  if (!target) {
    return jsonError(
      `Ngôn ngữ đích "${targetRaw}" không hỗ trợ. Hỗ trợ: ${SUPPORTED_LANGS.join(', ')}`,
      400,
    );
  }

  const formatRaw = String(
    clientForm.get('format') ?? req.nextUrl.searchParams.get('format') ?? 'pdf',
  ).toLowerCase();
  const format: 'pdf' | 'text' = formatRaw === 'text' ? 'text' : 'pdf';

  // Forward sang sidecar.
  const upstreamForm = new FormData();
  upstreamForm.append('file', file, file.name);
  upstreamForm.append('target', target);
  upstreamForm.append('format', format);

  const serviceUrl = getServiceUrl();
  const url = `${serviceUrl}/translate`;

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(url, {
      method: 'POST',
      body: upstreamForm,
      // PDF translation có thể mất vài phút cho file lớn — đặt timeout 5 phút.
      signal: AbortSignal.timeout(300_000),
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[pdf-translate] upstream unreachable:', msg);
    return jsonError(
      `Không kết nối được với sidecar pdf-translator tại ${url}. ` +
        `Kiểm tra service có chạy không: \`docker-compose ps\`. ` +
        `Chi tiết: ${msg}`,
      502,
    );
  }

  if (!upstreamRes.ok) {
    let detail = `Sidecar trả về lỗi ${upstreamRes.status}`;
    try {
      const data = await upstreamRes.json();
      if (data?.detail) detail = String(data.detail);
    } catch {
      try {
        const text = await upstreamRes.text();
        if (text) detail = text.slice(0, 300);
      } catch {
        /* ignore */
      }
    }
    return NextResponse.json({ ok: false, error: detail }, { status: upstreamRes.status });
  }

  // PDF mode → trả về binary attachment.
  if (format === 'pdf') {
    const buffer = await upstreamRes.arrayBuffer();

    const headers = new Headers();
    headers.set(
      'Content-Disposition',
      upstreamRes.headers.get('content-disposition') ??
        `attachment; filename="translated-${file.name}"`,
    );
    headers.set(
      'Content-Type',
      upstreamRes.headers.get('content-type') ?? 'application/pdf',
    );
    const rendered = upstreamRes.headers.get('x-pages-rendered');
    if (rendered) headers.set('X-Pages-Rendered', rendered);
    const lang = upstreamRes.headers.get('x-target-lang');
    if (lang) headers.set('X-Target-Lang', lang);
    headers.set('X-Original-Size', String(file.size));

    return new NextResponse(buffer, { status: 200, headers });
  }

  // Text mode → forward JSON envelope as-is.
  const data = await upstreamRes.json();
  return NextResponse.json({
    ...(data as Record<string, unknown>),
    target_label: LANG_NAMES[target],
  });
}

export async function GET() {
  const serviceUrl = getServiceUrl();
  let upstreamOk = false;
  let upstreamDetail: Record<string, unknown> | null = null;
  try {
    const r = await fetch(`${serviceUrl}/health`, {
      signal: AbortSignal.timeout(5_000),
    });
    upstreamOk = r.ok;
    if (r.ok) {
      upstreamDetail = await r.json();
    }
  } catch {
    upstreamOk = false;
  }
  return NextResponse.json({
    ok: upstreamOk,
    service_url: serviceUrl,
    supported_languages: SUPPORTED_LANGS,
    language_names: LANG_NAMES,
    supported_formats: ['pdf', 'text'],
    max_bytes: MAX_BYTES,
    upstream: upstreamDetail,
  });
}