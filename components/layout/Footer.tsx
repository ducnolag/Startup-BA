'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Github, Mail, MessageCircle, Send } from 'lucide-react';

const footerLinks = {
  'Sản phẩm': [
    { label: 'Săn học bổng', href: '/tools/scholarship' },
    { label: 'So sánh giá', href: '/tools/price-compare' },
    { label: 'Bảng giá', href: '/#pricing' },
    { label: 'Roadmap', href: '/#mission' },
  ],
  'Tài nguyên': [
    { label: 'Blog', href: '#' },
    { label: 'Cộng đồng', href: '#' },
    { label: 'API Docs', href: '#' },
    { label: 'Trạng thái', href: '#' },
  ],
  'Công ty': [
    { label: 'Về chúng tôi', href: '#' },
    { label: 'Tuyển dụng', href: '#' },
    { label: 'Liên hệ', href: '#' },
    { label: 'Báo chí', href: '#' },
  ],
  'Pháp lý': [
    { label: 'Điều khoản', href: '#' },
    { label: 'Bảo mật', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#020409] overflow-hidden">
      {/* Top gradient divider */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-11 h-11 flex-shrink-0 transition-transform duration-500 group-hover:scale-105">
                <Image
                  src="/logo.png"
                  alt="Toolify.vn"
                  width={44}
                  height={44}
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-display font-bold text-xl tracking-tight text-white">
                Toolify<span className="text-cyan-400">.vn</span>
              </span>
            </Link>

            <p className="mt-6 text-[#94a3b8] leading-relaxed max-w-sm">
              Nền tảng công cụ thông minh cho người Việt. Xây bởi một founder sinh viên,
              cùng cộng đồng đóng góp.
            </p>

            {/* Newsletter — glass card */}
            <div className="mt-8 rounded-2xl glass-border-glow p-4 spotlight">
              <div className="text-sm font-medium text-white/80 mb-3 px-1">
                Cập nhật công cụ mới + tip hữu ích
              </div>
              <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-full text-sm text-white placeholder:text-[#64748b] focus:outline-none focus:border-cyan-500/50 transition-colors"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-cyan-500 text-[#020409] rounded-full hover:bg-[#5ee8ff] transition-colors flex-shrink-0"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Links — glass cards */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-3">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div
                key={category}
                className="rounded-2xl glass-soft p-5 hover:border-cyan-500/30 transition-colors group"
              >
                <div className="font-display font-semibold text-white text-sm mb-4 group-hover:text-cyan-400 transition-colors">
                  {category}
                </div>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-[#94a3b8] hover:text-cyan-400 transition-colors"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="text-sm text-[#64748b]">
            © 2026 Toolify.vn · Được xây với ❤️ tại TP. Hồ Chí Minh
          </div>

          <div className="flex items-center gap-2">
            {[
              { icon: Github, label: 'GitHub' },
              { icon: Send, label: 'Telegram' },
              { icon: Mail, label: 'Email' },
              { icon: MessageCircle, label: 'Messenger' },
            ].map(({ icon: Icon, label }) => (
              <a
                key={label}
                href="#"
                className="w-10 h-10 rounded-full glass-soft hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/30 flex items-center justify-center text-[#94a3b8] transition-all"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
