'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight, Github, Chrome, CheckCircle2 } from 'lucide-react';

export default function SignupPage() {
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
              Tạo tài khoản
            </h1>
            <p className="text-[#94a3b8] mb-6">
              Miễn phí vĩnh viễn cho plan cơ bản. Không cần thẻ tín dụng.
            </p>

            {/* Benefits */}
            <div className="mb-6 space-y-1.5 text-xs text-[#94a3b8]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Tra cứu 2 công cụ không giới hạn
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Cảnh báo qua email 5 lần/tuần
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
                Lưu wishlist + theo dõi sản phẩm
              </div>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-cyan-400 uppercase tracking-wider font-medium mb-2 block">
                  Họ và tên
                </label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nguyễn Văn A"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#64748b] focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
              </div>

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
                <label className="text-xs text-cyan-400 uppercase tracking-wider font-medium mb-2 block">
                  Mật khẩu
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748b]" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="≥8 ký tự"
                    className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-white placeholder:text-[#64748b] focus:outline-none focus:border-cyan-500/50 transition-colors"
                  />
                </div>
                {password && (
                  <div className="mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`h-1 flex-1 rounded-full transition-colors ${
                            i <= passwordStrength.score
                              ? passwordStrength.score <= 1
                                ? 'bg-red-400'
                                : passwordStrength.score === 2
                                ? 'bg-amber-400'
                                : 'bg-emerald-400'
                              : 'bg-white/10'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="text-[10px] text-[#64748b]">
                      Độ mạnh: <span className="text-white">{passwordStrength.label}</span>
                    </div>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 text-xs text-[#94a3b8] cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={agree}
                  onChange={(e) => setAgree(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-cyan-500/20"
                />
                <span>
                  Tôi đồng ý với{' '}
                  <Link href="#" className="text-cyan-400 hover:text-cyan-300">Điều khoản</Link> và{' '}
                  <Link href="#" className="text-cyan-400 hover:text-cyan-300">Bảo mật</Link> của Toolify.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-full bg-cyan-500 text-[#020409] font-semibold hover:bg-[#5ee8ff] transition-all flex items-center justify-center gap-2 hover:shadow-[0_0_32px_rgba(0,184,239,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#020409] border-t-transparent rounded-full animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>
                    Tạo tài khoản miễn phí
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
              Đã có tài khoản?{' '}
              <Link href="/login" className="text-cyan-400 hover:text-cyan-300 font-semibold">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

