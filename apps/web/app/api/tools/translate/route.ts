import { NextRequest } from 'next/server';
import { callGemini, GeminiConfigError } from '@/lib/gemini/client';
import { TRANSLATE_SYSTEM_PROMPT } from '@/lib/gemini/prompts/translate';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const SUPPORTED_LANGS = ['vi', 'en', 'zh', 'ja', 'ko', 'fr', 'es', 'de'] as const;
type Lang = (typeof SUPPORTED_LANGS)[number];

const LANG_NAMES: Record<Lang, string> = {
  vi: 'tiếng Việt',
  en: 'English',
  zh: '中文 (Tiếng Trung)',
  ja: '日本語 (Tiếng Nhật)',
  ko: '한국어 (Tiếng Hàn)',
  fr: 'Français (Tiếng Pháp)',
  es: 'Español (Tiếng Tây Ban Nha)',
  de: 'Deutsch (Tiếng Đức)',
};

interface TranslateRequest {
  text?: string;
  source?: string;
  target?: string;
}

export async function POST(req: NextRequest) {
  let body: TranslateRequest;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const text = body.text?.trim() ?? '';
  const source = body.source ?? 'auto';
  const target = body.target ?? 'vi';

  if (!text) {
    return Response.json({ error: 'Vui lòng nhập văn bản cần dịch.' }, { status: 400 });
  }
  if (text.length > 5000) {
    return Response.json(
      { error: 'Văn bản phải từ 1-5000 ký tự. Văn bản hiện tại dài ' + text.length + ' ký tự.' },
      { status: 400 },
    );
  }
  if (!SUPPORTED_LANGS.includes(target as Lang)) {
    return Response.json(
      { error: `Ngôn ngữ đích "${target}" không được hỗ trợ. Hỗ trợ: ${SUPPORTED_LANGS.join(', ')}` },
      { status: 400 },
    );
  }

  const sourceLabel = source === 'auto' ? 'tự động nhận diện ngôn ngữ' : LANG_NAMES[source as Lang] ?? source;
  const targetLabel = LANG_NAMES[target as Lang] ?? target;

  try {
    const translated = await callGemini(
      [{ role: 'user', parts: [{ text }] }],
      {
        systemPrompt: TRANSLATE_SYSTEM_PROMPT(sourceLabel, targetLabel),
        model: 'gemini-2.0-flash',
        temperature: 0.3,
        maxOutputTokens: 4096,
      },
    );

    return Response.json({
      ok: true,
      source: source === 'auto' ? 'auto-detected' : source,
      target,
      source_label: sourceLabel,
      target_label: targetLabel,
      translated,
    });
  } catch (e) {
    if (e instanceof GeminiConfigError) {
      return Response.json({
        ok: true,
        demo_mode: true,
        source: source === 'auto' ? 'auto-detected' : source,
        target,
        translated: '[DEMO MODE] Bản dịch sẽ xuất hiện ở đây khi bạn set GEMINI_API_KEY trong environment. Free tier của Gemini đủ dùng cho mục đích cá nhân.',
      });
    }
    console.error('[translate]', e);
    return Response.json(
      { error: e instanceof Error ? e.message : 'Lỗi không xác định từ Gemini API.' },
      { status: 500 },
    );
  }
}

export async function GET() {
  return Response.json({
    ok: true,
    supported_languages: SUPPORTED_LANGS,
    language_names: LANG_NAMES,
    configured: Boolean(process.env.GEMINI_API_KEY),
  });
}
