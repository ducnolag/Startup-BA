'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/tools', label: 'Công cụ' },
  { href: '/tools/scholarship', label: 'Học bổng' },
  { href: '/tools/price-compare', label: 'So sánh giá' },
  { href: '/#pricing', label: 'Bảng giá' },
  { href: '/#mission', label: 'Câu chuyện' },
];

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-700',
        scrolled
          ? 'py-3 bg-[#020409]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_0_60px_-20px_rgba(0,184,239,0.2)]'
          : 'py-6 bg-transparent',
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 flex-shrink-0 transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[-4deg]">
            <Image
              src="/logo.png"
              alt="Toolify.vn"
              width={40}
              height={40}
              className="w-full h-full object-contain"
              priority
            />
          </div>
          <span className="font-display font-bold text-lg tracking-tight text-white">
            Toolify<span className="text-cyan-400">.vn</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="px-4 py-2 text-sm text-ink-muted hover:text-cyan-300 transition-colors duration-300 rounded-full hover:bg-white/[0.04]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <a
            href="#login"
            className="text-sm text-ink-muted hover:text-cyan-300 transition-colors px-4 py-2"
          >
            Đăng nhập
          </a>
          <a
            href="#start"
            className="group inline-flex items-center gap-1.5 px-5 py-2.5 bg-cyan-500 text-[#03060f] text-sm font-semibold rounded-full hover:bg-accent-glow transition-all duration-300 hover:shadow-[0_0_32px_rgba(0,184,239,0.45)] hover:-translate-y-0.5"
          >
            Bắt đầu miễn phí
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </a>
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-ink-muted hover:text-cyan-300 transition-colors"
          aria-label="Toggle menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden bg-[#020409]/95 backdrop-blur-xl border-t border-white/[0.06] mt-3"
          >
            <nav className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 text-ink-muted hover:text-cyan-300 hover:bg-white/[0.04] rounded-xl transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="#start"
                onClick={() => setIsOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-cyan-500 text-[#03060f] font-semibold rounded-full"
              >
                Bắt đầu miễn phí
                <ArrowRight className="w-4 h-4" />
              </a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
