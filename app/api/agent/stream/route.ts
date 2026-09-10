import { NextResponse } from 'next/server';

const AGENT_URL = process.env.COMMERCE_AGENT_URL ?? 'http://127.0.0.1:8765/turn';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const message = typeof body?.message === 'string' ? body.message.trim() : '';
    // The Python runner auto-creates a session when this is omitted; we forward it
    // when the client has one so the host stays stateless.
    const sessionId =
      typeof body?.sessionId === 'string'
        ? body.sessionId
        : typeof body?.session_id === 'string'
          ? body.session_id
          : undefined;

    if (!message) {
      return NextResponse.json(
        { error: 'Vui lòng nhập tin nhắn.' },
        { status: 400 }
      );
    }

    const upstreamResponse = await fetch(AGENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message,
        ...(sessionId ? { session_id: sessionId } : {}),
      }),
      signal: AbortSignal.timeout(180_000),
    });

    if (!upstreamResponse.ok) {
      const errorText = await upstreamResponse.text();
      return NextResponse.json(
        { error: `Backend error: ${errorText}` },
        { status: upstreamResponse.status }
      );
    }

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const reader = upstreamResponse.body?.getReader();
        if (!reader) {
          controller.close();
          return;
        }

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            controller.enqueue(value);
          }
        } catch (streamError) {
          console.error('Stream error:', streamError);
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    const headers: Record<string, string> = {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    };
    const upstreamSessionId = upstreamResponse.headers.get('X-Session-Id');
    if (upstreamSessionId) {
      headers['X-Session-Id'] = upstreamSessionId;
    }

    return new Response(stream, { headers });
  } catch (error) {
    console.error('Stream endpoint error:', error);
    return NextResponse.json(
      { error: 'Không kết nối được trợ lý mua sắm. Hãy khởi động backend Python trước.' },
      { status: 502 }
    );
  }
}
