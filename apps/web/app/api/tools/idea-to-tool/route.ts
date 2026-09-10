import { NextRequest } from 'next/server';
import { callGemini, GeminiConfigError, callGeminiJson } from '@/lib/gemini/client';
import { IDEA_TOOL_SYSTEM_PROMPT } from '@/lib/gemini/prompts/idea-to-tool';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface IdeaToolSuggestion {
  category: string;
  tools: { name: string; description: string; effort: 'low' | 'medium' | 'high'; impact: 'low' | 'medium' | 'high' }[];
  next_steps: string[];
  refinement_question: string;
  summary: string;
}

const DEMO_RESULT: IdeaToolSuggestion = {
  category: 'productivity',
  tools: [
    { name: 'Toolify Agent Chat', description: 'Hỏi Claude AI trực tiếp bằng tiếng Việt về cách giải quyết vấn đề của bạn', effort: 'low', impact: 'medium' },
    { name: 'Notion + Calendar', description: 'Gom task và lịch họp/làm việc vào một không gian, dễ chia sẻ team', effort: 'low', impact: 'high' },
    { name: 'Google Sheets Template', description: 'Template miễn phí theo dõi tiến độ — phù hợp nếu team < 5 người', effort: 'low', impact: 'medium' },
  ],
  next_steps: [
    'Mô tả chi tiết hơn vấn đề của bạn (đối tượng, quy mô, ngân sách)',
    'Chọn 1 công cụ từ gợi ý trên để thử trong tuần này',
    'Đặt câu hỏi follow-up cho Toolify Agent để được tư vấn sâu hơn',
  ],
  refinement_question: 'Bạn có thể cho biết đối tượng sử dụng (sinh viên, founder, freelancer, team SMB) và quy mô (1 người / nhóm < 5 / > 10 người) không?',
  summary: 'Đang chạy ở demo mode — set GEMINI_API_KEY trong .env để nhận gợi ý cá nhân hoá theo vấn đề của bạn.',
};

export async function POST(req: NextRequest) {
  let body: { problem?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const problem = body.problem?.trim() ?? '';
  if (problem.length < 10) {
    return Response.json(
      { error: 'Vui lòng mô tả vấn đề chi tiết hơn (ít nhất 10 ký tự).' },
      { status: 400 },
    );
  }
  if (problem.length > 2000) {
    return Response.json(
      { error: 'Vui lòng rút gọn mô tả xuống dưới 2000 ký tự.' },
      { status: 400 },
    );
  }

  try {
    const parsed = await callGeminiJson<IdeaToolSuggestion>(
      [{ role: 'user', parts: [{ text: problem }] }],
      {
        systemPrompt: IDEA_TOOL_SYSTEM_PROMPT,
        model: 'gemini-2.0-flash',
        temperature: 0.7,
      },
    );
    return Response.json({ ok: true, result: parsed });
  } catch (e) {
    if (e instanceof GeminiConfigError) {
      return Response.json({ ok: true, demo_mode: true, result: DEMO_RESULT });
    }
    console.error('[idea-to-tool]', e);
    return Response.json(
      { error: e instanceof Error ? e.message : 'Lỗi không xác định từ Gemini API.' },
      { status: 500 },
    );
  }
}

// Healthcheck helper — frontend có thể ping để biết API có hoạt động không.
export async function GET() {
  return Response.json({
    ok: true,
    configured: Boolean(process.env.GEMINI_API_KEY),
    model: process.env.GEMINI_MODEL ?? 'gemini-2.0-flash',
  });
}
