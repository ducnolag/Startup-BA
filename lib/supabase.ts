/**
 * Supabase client singletons (browser + server).
 *
 * - Browser client dùng `createBrowserClient` từ @supabase/ssr, singleton trên
 *   `globalThis` để share cookie state cho OAuth/PKCE flow (signInWithOAuth
 *   ở /login tạo code verifier → /auth/callback dùng cùng client để exchange).
 * - Server client dùng `createServerClient` (cookies-based, hỗ trợ RSC).
 * - Luôn an toàn khi Supabase chưa được cấu hình (trả về null).
 */

import { createBrowserClient } from '@supabase/ssr';
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { SupabaseClient } from '@supabase/supabase-js';

declare global {
  // eslint-disable-next-line no-var
  var __supabaseBrowserClient: SupabaseClient | null;
}
// Khởi tạo sẵn null để check !== null thay vì !== undefined
if (globalThis.__supabaseBrowserClient === undefined) {
  globalThis.__supabaseBrowserClient = null;
}

export function hasSupabaseEnv(): boolean {
  if (typeof process === 'undefined') return false;
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Browser client — singleton trên globalThis.
 * Dùng `!== null` thay vì `!== undefined` để tránh trường hợp
 * init lần đầu null rồi sau ready → vẫn dùng đúng client mới.
 */
export function createBrowserSupabase(): SupabaseClient | null {
  if (globalThis.__supabaseBrowserClient !== null) {
    return globalThis.__supabaseBrowserClient;
  }
  if (!hasSupabaseEnv()) return null;
  globalThis.__supabaseBrowserClient = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  return globalThis.__supabaseBrowserClient;
}

/**
 * Server-side client (dùng trong Route Handlers / Server Components).
 * Cookie store được truyền từ caller để tương thích cả Next 14 + 15.
 */
export function createServerSupabase(
  cookieStore: Awaited<ReturnType<typeof cookies>>
): SupabaseClient | null {
  if (!hasSupabaseEnv()) return null;
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options as CookieOptions);
            });
          } catch {
            // Server Component — không thể set cookies, bỏ qua.
          }
        },
      },
    }
  );
}

/**
 * Service-role client (chỉ dùng trong API routes, không bao giờ từ client).
 * Cần `SUPABASE_SERVICE_ROLE_KEY` — bỏ qua RLS, dùng cho admin operations.
 */
export function createServiceSupabase(): SupabaseClient | null {
  if (
    typeof process === 'undefined' ||
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY
  ) {
    return null;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
