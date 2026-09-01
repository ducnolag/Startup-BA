'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthProvider';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const passwordStrength = useMemo(() => {
    if (!password) return { score: 0, label: '' };
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return {
      score,
      label: ['', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'][score],
    };
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }
    if (!email.includes('@')) {
      setError('Email không hợp lệ');
      return;
    }
    if (password.length < 8) {
      setError('Mật khẩu phải có ít nhất 8 ký tự');
      return;
    }
    if (!agree) {
      setError('Bạn cần đồng ý điều khoản sử dụng');
      return;
    }

    setLoading(true);
    const result = await signup(email, password, name);
    setLoading(false);

    if (!result.ok) {
      setError(result.error || 'Đăng ký thất bại.');
      return;
    }

    router.push('/dashboard');
  };

  return (
    <main className="min-h-screen bg-white flex items-center justify-center px-6 py-12">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2.5 mb-10">
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
          <h1
            className="font-display font-bold text-2xl md:text-3xl text-ink tracking-tight mb-2"
            style={{ letterSpacing: '-0.025em' }}
          >
            Tạo tài khoản
          </h1>
          <p className="text-ink-muted mb-8 text-sm">
            Miễn phí vĩnh viễn cho plan cơ bản. Không cần thẻ tín dụng.
          </p>

          {error && (
            <div className="mb-5 p-3 rounded-lg bg-danger/10 border border-danger/20 text-danger text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-ink mb-2 block">
                Họ và tên
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nguyễn Văn A"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink mb-2 block">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-ink mb-2 block">
                Mật khẩu
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="≥8 ký tự"
                className="input-field"
              />
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1.5">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-1 flex-1 rounded-full transition-colors ${
                          i <= passwordStrength.score
                            ? passwordStrength.score <= 1
                              ? 'bg-danger'
                              : passwordStrength.score === 2
                              ? 'bg-warning'
                              : 'bg-success'
                            : 'bg-line'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] text-ink-subtle">
                    Độ mạnh:{' '}
                    <span className="text-ink font-medium">
                      {passwordStrength.label}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <label className="flex items-start gap-3 text-xs text-ink-muted cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="mt-0.5 w-4 h-4 rounded border-line text-ink focus:ring-2 focus:ring-brand/20"
              />
              <span>
                Tôi đồng ý với{' '}
                <Link href="#" className="text-brand hover:text-brand-deep">
                  Điều khoản
                </Link>{' '}
                và{' '}
                <Link href="#" className="text-brand hover:text-brand-deep">
                  Bảo mật
                </Link>{' '}
                của Toolify.
              </span>
            </label>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary justify-center disabled:opacity-50"
            >
              {loading ? 'Đang tạo tài khoản...' : 'Tạo tài khoản miễn phí'}
            </button>
          </form>

          <div className="my-6 flex items-center gap-3 text-xs text-ink-subtle">
            <div className="flex-1 h-px bg-line" />
            <span>HOẶC</span>
            <div className="flex-1 h-px bg-line" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <OAuthButton provider="google" label="Google" />
            <OAuthButton provider="github" label="GitHub" />
          </div>

          <p className="mt-8 text-center text-sm text-ink-muted">
            Đã có tài khoản?{' '}
            <Link href="/login" className="text-brand hover:text-brand-deep font-semibold">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function OAuthButton({
  provider,
  label,
}: {
  provider: 'google' | 'github';
  label: string;
}) {
  const { loginWithProvider, mode } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleOAuth = async () => {
    setError('');
    setLoading(true);
    const result = await loginWithProvider(provider);
    setLoading(false);
    if (!result.ok) {
      setError(result.error || 'Đăng nhập thất bại.');
    }
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleOAuth}
        disabled={loading}
        className="btn-ghost w-full justify-center gap-2 disabled:opacity-50"
      >
        {provider === 'google' ? <GoogleIcon /> : <GitHubIcon />}
        {label}
      </button>
      {error && (
        <p className="mt-1 text-[10px] text-danger text-center">{error}</p>
      )}
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );
}