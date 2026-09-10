import { NextResponse } from 'next/server';

const AGENT_URL = process.env.COMMERCE_AGENT_URL ?? 'http://127.0.0.1:8765/analyze';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const input = typeof body?.input === 'string' ? body.input.trim() : '';
    if (!input) return NextResponse.json({ error: 'Vui lòng nhập tên hoặc đường dẫn sản phẩm.' }, { status: 400 });

    const response = await fetch(AGENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input }),
      cache: 'no-store',
      signal: AbortSignal.timeout(180_000),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch {
    return NextResponse.json(
      { error: 'Không kết nối được trợ lý mua sắm. Hãy khởi động backend Python trước.' },
      { status: 502 },
    );
  }
}
