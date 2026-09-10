// =====================================================================
// POST /api/price/fetch
// Body: { input: "url or product name" }
// Returns: LivePriceResult (giá thật từ Gemini Search + cached)
// =====================================================================

import { NextResponse } from 'next/server';
import { fetchLivePrice } from '@/lib/price/scraper';

// Force dynamic — không cache
export const dynamic = 'force-dynamic';
export const maxDuration = 30; // 30s timeout cho Gemini call

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = String(body?.input ?? '').trim();
    if (!input) {
      return NextResponse.json(
        { error: 'Missing input' },
        { status: 400 }
      );
    }

    const result = await fetchLivePrice(input);
    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'private, max-age=300', // client-side cache 5 phút
      },
    });
  } catch (err) {
    console.error('[api/price/fetch]', err);
    return NextResponse.json(
      { error: 'Internal server error', message: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}

// GET cũng hỗ trợ để test nhanh (vd: ?input=url)
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const input = searchParams.get('input')?.trim();
  if (!input) {
    return NextResponse.json({ error: 'Missing ?input=' }, { status: 400 });
  }
  const result = await fetchLivePrice(input);
  return NextResponse.json(result);
}