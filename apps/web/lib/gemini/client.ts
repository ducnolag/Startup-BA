// =====================================================================
// Toolify — Gemini REST client (thin wrapper around generativelanguage.googleapis.com)
// Dùng fetch thuần, không cần SDK. Tránh thêm npm dep.
// =====================================================================

const GEMINI_API_URL = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  systemInstruction?: { parts: { text: string }[] };
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: 'application/json';
  };
}

export interface GeminiCallOptions {
  systemPrompt?: string;
  model?: string;
  temperature?: number;
  maxOutputTokens?: number;
  jsonMode?: boolean;
}

export class GeminiConfigError extends Error {
  constructor() {
    super('GEMINI_API_KEY not configured');
    this.name = 'GeminiConfigError';
  }
}

/**
 * Gọi Gemini REST API. Trả về text thuần (hoặc JSON string nếu jsonMode).
 * Throw GeminiConfigError nếu thiếu key, throw Error với status + body nếu lỗi HTTP.
 */
export async function callGemini(
  messages: GeminiMessage[],
  opts: GeminiCallOptions = {},
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiConfigError();
  }

  const model = opts.model ?? process.env.GEMINI_MODEL ?? 'gemini-2.0-flash';
  const body: GeminiRequest = {
    contents: messages,
    generationConfig: {
      temperature: opts.temperature ?? 0.7,
      maxOutputTokens: opts.maxOutputTokens ?? 2048,
      ...(opts.jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
    ...(opts.systemPrompt
      ? { systemInstruction: { parts: [{ text: opts.systemPrompt }] } }
      : {}),
  };

  const res = await fetch(`${GEMINI_API_URL(model)}?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini API error: ${res.status} ${err}`);
  }

  const data = await res.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
}

/**
 * Tiện ích: gọi Gemini và parse JSON output. Throw nếu parse fail.
 */
export async function callGeminiJson<T = unknown>(
  messages: GeminiMessage[],
  opts: Omit<GeminiCallOptions, 'jsonMode'> = {},
): Promise<T> {
  const raw = await callGemini(messages, { ...opts, jsonMode: true });
  return JSON.parse(raw) as T;
}
