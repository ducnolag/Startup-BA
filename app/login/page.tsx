'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Github, Chrome } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng điền email và mật khẩu');
      return;
    }
    if (!email.includes('@')) {
      setError('Email không hợp lệ');
      return;
    }

    setLoading(true);
    // TODO: replace with real auth (Supabase/NextAuth) when backend is ready
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setError('Backend auth chưa sẵn sàng — xem ghi chú trong README để kích hoạt.');
  };

  return (
    <main className="relative min-h-screen bg-[#020409] flex items-center justify-center px-6 py-12 overflow-hidden">
      <div className="absolute inset-0 bg-mesh opacity-40" />
      <div className="absolute inset-0 opacity-[0.015]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'linear-gradient(rgba(0,184,239,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,184,239,0.6) 1px, transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 mb-10 group">
          <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
            <img src="/logo.png" alt="Toolify.vn" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Toolify<span className="text-cyan-400">.vn</span>
          </span>
        </Link>

        {/* Card */}
        <div className="rounded-3xl glass-border-glow p-8 md:p-10 relative overflow-hidden">
          <div className="absolute -top-32 -right-32 w-80 h-80 bg-cyan-500/10 rounded-full blur-[120px]" />

          <div className="relative">
            <h1
              className="font-display font-bold text-3xl text-white tracking-tight mb-2"
              style={{ letterSpacing: '-0.03em' }}
            >
              Chào mừng trở lại
            </h1>
            <p className="text-[#94a3b8] mb-8">Đăng nhập để tiếp tục hành trình săn học bổng & ưu đãi.</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-cyan-400 uppercase tracking-wider font-medium mb-2 block">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#64748b] focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs text-cyan-400 uppercase tracking-wider font-medium">
                    Mật khẩu
                  </label>
                  <Link href="#" className="text-xs text-cyan-400 hover:text-cyan-300">
                    Quên mật khẩu?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#64748b] focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-cyan-500 text-[#020409] font-semibold hover:bg-[#5ee8ff] transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_32px_rgba(0,184,239,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#020409] border-t-transparent rounded-full animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>
                    Đăng nhập
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3 text-xs text-[#64748b]">
              <div className="flex-1 h-px bg-white/10" />
              <span>HOẶC</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button className="py-3 rounded-2xl glass-soft hover:bg-white/10 text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors">
                <Chrome className="w-4 h-4" />
                Google
              </button>
              <button className="py-3 rounded-2xl glass-soft hover:bg-white/10 text-sm font-medium text-white flex items-center justify-center gap-2 transition-colors">
                <Github className="w-4 h-4" />
                GitHub
              </button>
            </div>

            <p className="mt-8 text-center text-sm text-[#94a3b8]">
              Chưa có tài khoản?{' '}
              <Link href="/signup" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Đăng ký miễn phí
              </Link>
            </p>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-[#64748b]">
          Bằng việc đăng nhập, bạn đồng ý với{' '}
          <Link href="#" className="hover:text-cyan-400">Điều khoản</Link> và{' '}
          <Link href="#" className="hover:text-cyan-400">Bảo mật</Link>.
        </p>
      </div>
    </main>
  );
}