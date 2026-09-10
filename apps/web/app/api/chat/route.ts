// =====================================================================
// POST /api/chat
// Streams Anthropic Messages API responses as Server-Sent Events.
//
// Body:
//   {
//     messages: Anthropic.MessageParam[],
//     sessionId?: string,
//     system?: string
//   }
//
// Behaviour:
//   - If ANTHROPIC_API_KEY is not set → 503 with { error: 'ANTHROPIC_API_KEY not set' }
//   - Otherwise streams `text/event-stream` with `data:` lines carrying
//     `{ type: 'content_block_delta' | 'message_stop' | 'tool_use' | 'error', ... }`.
//
// Tools exposed mirror the vnBackend actions:
//   - search_products, get_product, get_policies, get_disclosures,
//     get_cart, add_to_cart, remove_from_cart, place_order, get_order.
// =====================================================================

import { NextResponse } from 'next/server';
import { vnBackend } from '@/lib/storefront/vn-backend';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

interface ChatRequestBody {
  messages?: unknown;
  sessionId?: string;
  system?: string;
}

const DEFAULT_SYSTEM =
  'Bạn là trợ lý mua sắm của Toolify.vn. Trả lời bằng tiếng Việt, ngắn gọn, ' +
  'thân thiện. Khi cần tra cứu sản phẩm, chính sách hoặc giỏ hàng, hãy gọi tool ' +
  'tương ứng thay vì tự bịa thông tin.';

function buildTools() {
  return [
    {
      name: 'search_products',
      description:
        'Tìm sản phẩm theo từ khoá và bộ lọc (khoảng giá, danh mục). Trả về danh sách sản phẩm với giá hiện tại ở VND.',
      input_schema: {
        type: 'object' as const,
        properties: {
          query: { type: 'string', description: 'Từ khoá tìm kiếm, vd: "iphone", "laptop", "tai nghe"' },
          filters: {
            type: 'object',
            description: 'Bộ lọc tuỳ chọn',
            properties: {
              min_price: { type: 'number', description: 'Giá tối thiểu (VND)' },
              max_price: { type: 'number', description: 'Giá tối đa (VND)' },
              category: { type: 'string', description: 'Tên danh mục cần lọc' },
            },
          },
          limit: { type: 'number', description: 'Số kết quả tối đa (mặc định 8)' },
        },
        required: ['query'],
      },
    },
    {
      name: 'get_product',
      description: 'Lấy thông tin chi tiết (mô tả, thông số, giá ở 4 sàn) của một sản phẩm theo product_id.',
      input_schema: {
        type: 'object' as const,
        properties: {
          productId: { type: 'string', description: 'product_id, vd: "iphone-15-128"' },
        },
        required: ['productId'],
      },
    },
    {
      name: 'get_cart',
      description: 'Lấy giỏ hàng hiện tại của session.',
      input_schema: {
        type: 'object' as const,
        properties: {
          sessionId: { type: 'string', description: 'ID phiên của người dùng' },
        },
        required: ['sessionId'],
      },
    },
    {
      name: 'add_to_cart',
      description: 'Thêm sản phẩm vào giỏ hàng. Trả về giỏ hàng sau khi thêm.',
      input_schema: {
        type: 'object' as const,
        properties: {
          sessionId: { type: 'string' },
          productId: { type: 'string' },
          quantity: { type: 'number', description: 'Số lượng (>0)' },
        },
        required: ['sessionId', 'productId', 'quantity'],
      },
    },
    {
      name: 'remove_from_cart',
      description: 'Xoá một sản phẩm khỏi giỏ hàng.',
      input_schema: {
        type: 'object' as const,
        properties: {
          sessionId: { type: 'string' },
          productId: { type: 'string' },
        },
        required: ['sessionId', 'productId'],
      },
    },
    {
      name: 'place_order',
      description: 'Tạo đơn hàng từ giỏ hiện tại và xoá giỏ.',
      input_schema: {
        type: 'object' as const,
        properties: {
          sessionId: { type: 'string' },
        },
        required: ['sessionId'],
      },
    },
    {
      name: 'get_order',
      description: 'Tra cứu đơn hàng theo order_id.',
      input_schema: {
        type: 'object' as const,
        properties: {
          orderId: { type: 'string' },
        },
        required: ['orderId'],
      },
    },
    {
      name: 'get_policies',
      description: 'Tra cứu chính sách vận chuyển / đổi trả / bảo hành / thanh toán.',
      input_schema: {
        type: 'object' as const,
        properties: {
          query: { type: 'string', description: 'Từ khoá tuỳ chọn, vd: "vận chuyển", "đổi trả"' },
        },
      },
    },
    {
      name: 'get_disclosures',
      description: 'Lấy bảng thông tin giá (disclosure) cho một sản phẩm.',
      input_schema: {
        type: 'object' as const,
        properties: {
          productId: { type: 'string' },
        },
        required: ['productId'],
      },
    },
  ];
}

type SseEvent =
  | { type: 'content_block_delta'; delta: string }
  | { type: 'tool_use'; name: string; input: unknown }
  | { type: 'message_stop' }
  | { type: 'error'; message: string };

function encodeSse(event: SseEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

/** Execute a tool call against the local vnBackend singleton. */
async function executeTool(name: string, input: unknown): Promise<unknown> {
  const args = (input ?? {}) as Record<string, unknown>;
  switch (name) {
    case 'search_products': {
      const query = String(args.query ?? '');
      const filters =
        args.filters && typeof args.filters === 'object'
          ? (args.filters as Parameters<typeof vnBackend.searchProducts>[1])
          : undefined;
      const limit = typeof args.limit === 'number' ? args.limit : 8;
      return vnBackend.searchProducts(query, filters, limit);
    }
    case 'get_product':
      return vnBackend.getProduct(String(args.productId ?? ''));
    case 'get_cart':
      return vnBackend.getCart(String(args.sessionId ?? ''));
    case 'add_to_cart':
      return vnBackend.addToCart(
        String(args.sessionId ?? ''),
        String(args.productId ?? ''),
        Number(args.quantity ?? 1)
      );
    case 'remove_from_cart':
      return vnBackend.removeFromCart(
        String(args.sessionId ?? ''),
        String(args.productId ?? '')
      );
    case 'place_order':
      return vnBackend.placeOrder(String(args.sessionId ?? ''));
    case 'get_order':
      return vnBackend.getOrder(String(args.orderId ?? ''));
    case 'get_policies':
      return vnBackend.getPolicies(
        typeof args.query === 'string' ? args.query : undefined
      );
    case 'get_disclosures':
      return vnBackend.getDisclosures(String(args.productId ?? ''));
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

export async function POST(request: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY not set' },
      { status: 503 }
    );
  }

  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const messages = body.messages;
  if (!Array.isArray(messages) || messages.length === 0) {
    return NextResponse.json(
      { error: '`messages` must be a non-empty array' },
      { status: 400 }
    );
  }

  // Dynamic import keeps the SDK out of the build graph until needed
  // and avoids module-load failures when the package is misconfigured.
  const Anthropic = (await import('@anthropic-ai/sdk')).default;
  const client = new Anthropic({ apiKey });

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const enc = new TextEncoder();
      const send = (event: SseEvent) => {
        try {
          controller.enqueue(enc.encode(encodeSse(event)));
        } catch {
          /* closed */
        }
      };

      try {
        const finalStream = client.messages.stream({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 1024,
          system: body.system ?? DEFAULT_SYSTEM,
          tools: buildTools(),
          messages: messages as Parameters<typeof client.messages.stream>[0]['messages'],
        });

        for await (const event of finalStream) {
          if (event.type === 'content_block_delta') {
            const delta = event.delta;
            if ('text' in delta && typeof delta.text === 'string') {
              send({ type: 'content_block_delta', delta: delta.text });
            }
          } else if (event.type === 'content_block_start') {
            const block = event.content_block;
            if (block.type === 'tool_use') {
              // Will stream the full input at content_block_stop; here we just announce the name.
              send({ type: 'tool_use', name: block.name, input: null });
            }
          } else if (event.type === 'content_block_stop') {
            // Best-effort: pull the tool input from the assembled message
            const finalMessage = await finalStream.finalMessage();
            for (const b of finalMessage.content) {
              if (b.type === 'tool_use') {
                send({ type: 'tool_use', name: b.name, input: b.input });
                try {
                  const result = await executeTool(b.name, b.input);
                  send({ type: 'tool_use', name: `${b.name}::result`, input: result });
                } catch (err) {
                  const message = err instanceof Error ? err.message : String(err);
                  send({ type: 'error', message });
                }
              }
            }
          } else if (event.type === 'message_stop') {
            send({ type: 'message_stop' });
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        send({ type: 'error', message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
