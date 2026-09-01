'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserSupabase, hasSupabaseEnv } from '@/lib/supabase';

/**
 * OAuth callback handler.
 * - Nếu có Supabase env → đợi exchange session rồi redirect về /dashboard hoặc /admin.
 * - Nếu chưa cấu hình Supabase → hiển thị hướng dẫn.
 */
export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'no-env'>(
    'loading'
  );
  const [message, setMessage] = useState('Đang xác thực...');

  useEffect(() => {
    const code = searchParams.get('code');
    const errorParam = searchParams.get('error_description');

    if (!hasSupabaseEnv()) {
      setStatus('no-env');
      setMessage(
        'Supabase chưa được cấu hình. Hãy tạo file .env.local theo .env.local.example rồi khởi động lại dev server.'
      );
      return;
    }

    if (errorParam) {
      setStatus('error');
      setMessage(errorParam);
      return;
    }

    if (!code) {
      setStatus('error');
      setMessage('Thiếu mã xác thực từ nhà cung cấp.');
      return;
    }

    const supabase = createBrowserSupabase();
    if (!supabase) {
      setStatus('error');
      setMessage('Không thể khởi tạo Supabase client.');
      return;
    }

    supabase.auth.exchangeCodeForSession(code).then(async ({ data, error }) => {
      if (error) {
        setStatus('error');
        setMessage(error.message);
        return;
      }

      // Đợi thêm 1 chút để AuthProvider nhận event từ onAuthStateChange
      // trước khi redirect (tránh race condition: redirect trước khi user state cập nhật)
      await new Promise((r) => setTimeout(r, 400));

      const next = searchParams.get('next') || '/dashboard';
      setStatus('success');
      setMessage('Đăng nhập thành công. Đang chuyển trang...');

      // Buộc reload trang thay vì client-side nav để đảm bảo server render
      // đúng auth state (AuthProvider đã sync session từ bước trên)
      window.location.href = next;
    });
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2.5 mb-10">
          <Image
            src="/logo.png"
            alt="Toolify.vn"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
          />
          <span className="font-display font-bold text-lg tracking-tight text-ink">
            Toolify<span className="text-brand">.vn</span>
          </span>
        </Link>

        <div className="card p-8 md:p-10">
          {status === 'loading' && (
            <>
              <div className="w-10 h-10 mx-auto mb-4 border-4 border-line border-t-brand rounded-full animate-spin" />
              <h1 className="font-display font-bold text-xl text-ink mb-2">
                Đang xác thực
              </h1>
              <p className="text-sm text-ink-muted">{message}</p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-success/10 text-success flex items-center justify-center text-xl">
                ✓
              </div>
              <h1 className="font-display font-bold text-xl text-ink mb-2">
                Thành công
              </h1>
              <p className="text-sm text-ink-muted">{message}</p>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-danger/10 text-danger flex items-center justify-center text-xl">
                ✕
              </div>
              <h1 className="font-display font-bold text-xl text-ink mb-2">
                Có lỗi xảy ra
              </h1>
              <p className="text-sm text-ink-muted mb-6">{message}</p>
              <Link href="/login" className="btn-primary justify-center inline-flex">
                Quay lại đăng nhập
              </Link>
            </>
          )}

          {status === 'no-env' && (
            <>
              <div className="w-10 h-10 mx-auto mb-4 rounded-full bg-warning/10 text-warning flex items-center justify-center text-xl">
                ⚠
              </div>
              <h1 className="font-display font-bold text-xl text-ink mb-2">
                Supabase chưa được cấu hình
              </h1>
              <p className="text-sm text-ink-muted mb-6 whitespace-pre-line">
                {message}
              </p>
              <Link href="/login" className="btn-primary justify-center inline-flex">
                Quay lại đăng nhập
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
