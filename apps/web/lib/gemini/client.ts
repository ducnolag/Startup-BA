// =====================================================================
// Toolify — Gemini REST client (thin wrapper around generativelanguage.googleapis.com)
// Dùng fetch thuần, không cần SDK. Tránh thêm npm dep.
// =====================================================================

const GEMINI_API_URL = (model: string) =>
  `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

const GEMINI_FILES_UPLOAD_URL = 'https://generativelanguage.googleapis.com/upload/v1beta/files';

/**
 * Default model. `gemini-2.0-flash` đã bị Google shutdown ngày 01/06/2026
 * (https://ai.google.dev/gemini-api/docs/deprecations) → chuyển sang
 * `gemini-2.5-flash`: stable, multimodal (PDF qua Files API), free tier OK.
 * Override bằng env GEMINI_MODEL.
 */
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

export interface GeminiMessage {
  role: 'user' | 'model';
  parts: Array<{ text: string } | { file_data: { mime_type: string; file_uri: string } } | { inline_data: { mime_type: string; data: string } }>;
}

export interface GeminiRequest {
  contents: GeminiMessage[];
  systemInstruction?: { parts: { text: string }[] };
  generationConfig?: {
    temperature?: number;
    maxOutputTokens?: number;
    responseMimeType?: 'application/json' | 'text/plain';
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

export class GeminiApiError extends Error {
  status: number;
  body: string;
  constructor(status: number, body: string) {
    super(`Gemini API error: ${status} ${body.slice(0, 500)}`);
    this.name = 'GeminiApiError';
    this.status = status;
    this.body = body;
  }
}

/**
 * Gọi Gemini REST API. Trả về text thuần (hoặc JSON string nếu jsonMode).
 * Throw GeminiConfigError nếu thiếu key, throw GeminiApiError nếu lỗi HTTP.
 */
export async function callGemini(
  messages: GeminiMessage[],
  opts: GeminiCallOptions = {},
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiConfigError();
  }

  const model = opts.model ?? process.env.GEMINI_MODEL ?? DEFAULT_GEMINI_MODEL;
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
    throw new GeminiApiError(res.status, err);
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

/**
 * Upload một buffer/file lên Gemini Files API.
 * Trả về file URI (vd: "files/abc123") để truyền vào file_data khi gọi generateContent.
 *
 * Dùng resumable upload để hỗ trợ file lớn (PDF đến 20MB):
 * 1. POST /upload/v1beta/files với header X-Goog-Upload-Protocol: resumable để lấy session URI
 * 2. Upload bytes qua session URI
 *
 * Docs: https://ai.google.dev/api/files
 */
export async function uploadGeminiFile(
  file: { buffer: Buffer; mimeType: string; displayName: string },
  opts: { model?: string } = {},
): Promise<{ fileUri: string; mimeType: string; name: string; sizeBytes: number }> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new GeminiConfigError();
  }
  // Resumable upload theo spec mới: một POST đơn với metadata trong query string
  // và body là bytes (X-Goog-Upload-Command: upload, finalize).
  const numBytes = file.buffer.byteLength;

  const startRes = await fetch(
    `${GEMINI_FILES_UPLOAD_URL}?key=${apiKey}`,
    {
      method: 'POST',
      headers: {
        'X-Goog-Upload-Protocol': 'resumable',
        'X-Goog-Upload-Command': 'start',
        'X-Goog-Upload-Header-Content-Length': String(numBytes),
        'X-Goog-Upload-Header-Content-Type': file.mimeType,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ file: { display_name: file.displayName } }),
    },
  );
  if (!startRes.ok) {
    const err = await startRes.text();
    throw new GeminiApiError(startRes.status, `files.upload.start: ${err}`);
  }
  const sessionUri = startRes.headers.get('x-goog-upload-url') ?? startRes.headers.get('location');
  if (!sessionUri) {
    throw new GeminiApiError(500, 'files.upload.start: no session URI returned');
  }

  // Build a standalone Uint8Array (not a view) so the runtime side gets a
  // proper ArrayBuffer-backed body. Casting via `unknown` because the DOM
  // BufferSource type in TypeScript 5.6 has a parameterised ArrayBufferLike
  // that Node's Buffer/Uint8Array don't always satisfy.
  const bodyBytes = new Uint8Array(numBytes);
  bodyBytes.set(file.buffer);

  const uploadRes = await fetch(sessionUri, {
    method: 'POST',
    headers: {
      'Content-Length': String(numBytes),
      'X-Goog-Upload-Offset': '0',
      'X-Goog-Upload-Command': 'upload, finalize',
    },
    body: bodyBytes as unknown as BodyInit,
  });
  if (!uploadRes.ok) {
    const err = await uploadRes.text();
    throw new GeminiApiError(uploadRes.status, `files.upload.finalize: ${err}`);
  }
  const fileMeta = await uploadRes.json();
  return {
    fileUri: fileMeta.file?.uri ?? '',
    mimeType: fileMeta.file?.mimeType ?? file.mimeType,
    name: fileMeta.file?.name ?? '',
    sizeBytes: numBytes,
  };
}

/**
 * Gọi Gemini với file đính kèm (PDF/image via Files API).
 * Tự upload file rồi reference qua file_data.
 */
export async function callGeminiWithFile(
  file: { buffer: Buffer; mimeType: string; displayName: string },
  prompt: string,
  opts: GeminiCallOptions & { jsonMode?: boolean } = {},
): Promise<string> {
  const uploaded = await uploadGeminiFile(file);
  if (!uploaded.fileUri) {
    throw new GeminiApiError(500, 'Upload succeeded but no file URI returned');
  }
  return callGemini(
    [
      {
        role: 'user',
        parts: [
          { file_data: { mime_type: uploaded.mimeType, file_uri: uploaded.fileUri } },
          { text: prompt },
        ],
      },
    ],
    opts,
  );
}
