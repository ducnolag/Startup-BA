// =====================================================================
// Watermark Remover API — proxy Next.js → watermark-remover sidecar
//
// Endpoint: POST /api/tools/watermark-remover
// Body: multipart/form-data với field "file"
// Response: binary cleaned file (PDF / DOCX / ảnh)
//
// Service URL mặc định: http://watermark-remover:8766 (trong compose).
// Override bằng WATERMARK_SERVICE_URL khi chạy ngoài compose (vd test local).
// =====================================================================

import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const DEFAULT_SERVICE_URL = 'http://watermark-remover:8766';

function getServiceUrl(): string {
  return (
    process.env.WATERMARK_SERVICE_URL?.replace(/\/+$/, '') ||
    process.env.NEXT_PUBLIC_WATERMARK_URL?.replace(/\/+$/, '') ||
    DEFAULT_SERVICE_URL
  );
}

export async function POST(req: NextRequest) {
  // Lấy FormData từ client (multipart)
  let clientForm: FormData;
  try {
    clientForm = await req.formData();
  } catch {
    return NextResponse.json(
      { ok: false, error: 'Body không phải multipart/form-data hợp lệ.' },
      { status: 400 },
    );
  }

  const file = clientForm.get('file');
  if (!(file instanceof File)) {
    return NextResponse.json(
      { ok: false, error: 'Thiếu file upload.' },
      { status: 400 },
    );
  }

  // Forward sang sidecar. Tạo FormData mới với field "file".
  const upstreamForm = new FormData();
  upstreamForm.append('file', file, file.name);

  const serviceUrl = getServiceUrl();
  const url = `${serviceUrl}/remove`;

  let upstreamRes: Response;
  try {
    upstreamRes = await fetch(url, {
      method: 'POST',
      body: upstreamForm,
      // Node 20 fetch sẽ tự set Content-Type cho FormData
      signal: AbortSignal.timeout(180_000), // 3 phút timeout
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error('[watermark-remover] upstream unreachable:', msg);
    return NextResponse.json(
      {
        ok: false,
        error:
          `Không kết nối được với sidecar watermark-remover tại ${url}. ` +
          `Kiểm tra service có chạy không: \`docker-compose ps\`. ` +
          `Chi tiết: ${msg}`,
      },
      { status: 502 },
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

  // Stream cleaned file về client. Pass-through các header quan trọng.
  const buffer = await upstreamRes.arrayBuffer();

  const headers = new Headers();
  headers.set(
    'Content-Disposition',
    upstreamRes.headers.get('content-disposition') ?? `attachment; filename="cleaned-${file.name}"`,
  );
  const contentType = upstreamRes.headers.get('content-type');
  if (contentType) headers.set('Content-Type', contentType);
  const cleanedSize = upstreamRes.headers.get('x-cleaned-size');
  if (cleanedSize) headers.set('X-Cleaned-Size', cleanedSize);
  headers.set('X-Original-Size', String(file.size));

  return new NextResponse(buffer, {
    status: 200,
    headers,
  });
}

export async function GET() {
  // Health info cho frontend có thể ping.
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
    upstream: upstreamDetail,
  });
}
