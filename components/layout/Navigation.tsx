'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, ChevronDown, User, LogOut, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/providers/AuthProvider';
import { TOOLS, ROUTES } from '@/lib/constants';

const toolsMenu = TOOLS.map((t) => ({
  href: t.href,
  label: t.name,
  description: t.shortDescription,
}));

export default function Navigation() {
  const router = useRouter();
  const { user, isAdmin, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const pathname = usePathname();
  const dropdownTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const accountTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === '/';
  const isToolsSection = pathname?.startsWith('/tools') ?? false;
  const isDashboard = pathname === '/dashboard';
  const isAdminRoute = pathname?.startsWith('/admin') ?? false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setToolsOpen(false);
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Scroll-spy: phát hiện section nào đang hiển thị dựa vào scrollY.
  // Dùng scrollY thay vì IntersectionObserver vì anchor section có thể
  // ngắn hơn dải quan sát → observer không kích hoạt ổn định.
  useEffect(() => {
    if (!isHome) {
      setActiveSection(null);
      return;
    }

    const sectionIds = ['pricing', 'mission'] as const;

    const detect = () => {
      // Điểm kích hoạt: cách top 40% viewport — đủ để section "chạm" mắt
      const trigger = window.scrollY + window.innerHeight * 0.4;
      let next: string | null = null;
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (!el) continue;
        if (el.offsetTop <= trigger) next = id;
      }
      setActiveSection(next);
    };

    // Đọc hash khi mount/load để deep-link (#pricing) active ngay
    const hash = window.location.hash.replace('#', '');
    if (hash === 'pricing' || hash === 'mission') {
      setActiveSection(hash);
    } else {
      detect();
    }

    window.addEventListener('scroll', detect, { passive: true });
    window.addEventListener('hashchange', () => {
      const h = window.location.hash.replace('#', '');
      setActiveSection(h === 'pricing' || h === 'mission' ? h : null);
    });

    return () => {
      window.removeEventListener('scroll', detect);
    };
  }, [isHome]);

  const openTools = () => {
    if (dropdownTimeout.current) clearTimeout(dropdownTimeout.current);
    setToolsOpen(true);
  };
  const closeTools = () => {
    dropdownTimeout.current = setTimeout(() => setToolsOpen(false), 120);
  };
  const openAccount = () => {
    if (accountTimeout.current) clearTimeout(accountTimeout.current);
    setAccountOpen(true);
  };
  const closeAccount = () => {
    accountTimeout.current = setTimeout(() => setAccountOpen(false), 120);
  };

  const handleAnchorClick = (section: 'pricing' | 'mission') => (e: React.MouseEvent) => {
    // Active ngay lập tức khi click, không đợi IntersectionObserver
    setActiveSection(section);
    // Nếu không ở trang chủ, để Next.js điều hướng bình thường
  };

  const baseLink = 'px-3 py-2 text-sm rounded-full transition-colors';
  const inactiveLink = 'text-ink-muted hover:text-ink hover:bg-surface-muted';
  const activeLink = 'text-ink font-semibold bg-surface-subtle';

  const linkClass = (active: boolean) =>
    cn(baseLink, active ? activeLink : inactiveLink);

  const isPricingActive = isHome && activeSection === 'pricing';
  const isMissionActive = isHome && activeSection === 'mission';
  const isHomeActive = isHome && !isPricingActive && !isMissionActive;

  return (
    <header
      ref={navRef}
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        (scrolled || !isHome)
          ? 'bg-white/90 backdrop-blur-lg border-b border-line'
          : 'bg-white/0 border-b border-transparent'
      )}
    >
      <div className="container-page flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            alt="Toolify.vn"
            width={36}
            height={36}
            className="w-9 h-9 object-contain"
            priority
          />
          <span className="font-display font-bold text-lg tracking-tight text-ink">
            Toolify<span className="text-brand">.vn</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          <Link href="/" className={linkClass(isHomeActive)}>
            Trang chủ
          </Link>

          <div className="relative" onMouseEnter={openTools} onMouseLeave={closeTools}>
            <button
              onClick={() => setToolsOpen(!toolsOpen)}
              className={cn(
                baseLink,
                'flex items-center gap-1',
                isToolsSection || toolsOpen
                  ? 'text-ink font-semibold bg-surface-subtle'
                  : inactiveLink
              )}
              aria-expanded={toolsOpen}
              aria-haspopup="true"
            >
              Công cụ
              <ChevronDown
                className={cn(
                  'w-3.5 h-3.5 transition-transform duration-200',
                  toolsOpen && 'rotate-180'
                )}
              />
            </button>

            {toolsOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 w-[380px]">
                <div className="bg-white border border-line rounded-2xl shadow-pop p-2">
                  <Link
                    href="/tools"
                    onClick={() => setToolsOpen(false)}
                    className={cn(
                      'flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors',
                      pathname === '/tools' ? 'bg-surface-subtle' : 'hover:bg-surface-muted'
                    )}
                  >
                    <span
                      className={cn(
                        'text-sm',
                        pathname === '/tools'
                          ? 'font-semibold text-ink'
                          : 'font-medium text-ink'
                      )}
                    >
                      Tất cả công cụ
                    </span>
                    <span className="text-brand text-xs">→</span>
                  </Link>
                  <div className="h-px bg-line my-1" />
                  {toolsMenu.map((tool) => {
                    const isActive = pathname === tool.href;
                    return (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        onClick={() => setToolsOpen(false)}
                        className={cn(
                          'block px-3 py-2.5 rounded-lg transition-colors',
                          isActive ? 'bg-surface-subtle' : 'hover:bg-surface-muted'
                        )}
                      >
                        <div
                          className={cn(
                            'text-sm text-ink',
                            isActive ? 'font-semibold' : 'font-medium'
                          )}
                        >
                          {tool.label}
                        </div>
                        <div className="text-xs text-ink-subtle mt-0.5">
                          {tool.description}
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/#pricing"
            onClick={handleAnchorClick('pricing')}
            className={linkClass(isPricingActive)}
          >
            Bảng giá
          </Link>
          <Link
            href="/#mission"
            onClick={handleAnchorClick('mission')}
            className={linkClass(isMissionActive)}
          >
            Câu chuyện
          </Link>

          {/* Sản phẩm: luôn hiện với user thường/chưa login */}
          {!isAdmin && (
            <Link
              href={user ? ROUTES.dashboard : ROUTES.login}
              className={linkClass(isDashboard)}
            >
              Sản phẩm
            </Link>
          )}

          {/* Admin link chỉ hiện với admin */}
          {isAdmin && (
            <Link href={ROUTES.admin} className={linkClass(isAdminRoute)}>
              Quản trị
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <div className="relative" onMouseEnter={openAccount} onMouseLeave={closeAccount}>
              <button
                onClick={() => setAccountOpen(!accountOpen)}
                className={cn(
                  'flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full transition-colors',
                  accountOpen ? 'bg-surface-subtle' : 'hover:bg-surface-muted'
                )}
                aria-expanded={accountOpen}
              >
                <span className="w-7 h-7 rounded-full bg-brand text-white flex items-center justify-center text-xs font-bold">
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm text-ink font-medium max-w-[120px] truncate">
                  {user.fullName}
                </span>
                <ChevronDown
                  className={cn(
                    'w-3.5 h-3.5 text-ink-muted transition-transform duration-200',
                    accountOpen && 'rotate-180'
                  )}
                />
              </button>

              {accountOpen && (
                <div className="absolute top-full right-0 pt-2 w-[240px]">
                  <div className="bg-white border border-line rounded-2xl shadow-pop p-2">
                    <div className="px-3 py-2 border-b border-line mb-1">
                      <div className="text-sm font-semibold text-ink truncate">
                        {user.fullName}
                      </div>
                      <div className="text-xs text-ink-subtle truncate">{user.email}</div>
                      {isAdmin && (
                        <span className="inline-flex items-center gap-1 mt-1.5 text-[10px] font-bold uppercase tracking-wider text-brand-deep bg-brand/10 px-1.5 py-0.5 rounded">
                          <Shield className="w-2.5 h-2.5" />
                          Admin
                        </span>
                      )}
                    </div>
                    <Link
                      href={ROUTES.dashboard}
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-muted text-ink"
                    >
                      <User className="w-4 h-4 text-ink-muted" />
                      Sản phẩm của tôi
                    </Link>
                    {isAdmin && (
                      <Link
                        href={ROUTES.admin}
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-muted text-ink"
                      >
                        <Shield className="w-4 h-4 text-ink-muted" />
                        Trang quản trị
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        logout();
                        setAccountOpen(false);
                        router.push(ROUTES.home);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-surface-muted text-ink"
                    >
                      <LogOut className="w-4 h-4 text-ink-muted" />
                      Đăng xuất
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href={ROUTES.login}
                className="px-3 py-2 text-sm text-ink-muted hover:text-ink transition-colors"
              >
                Đăng nhập
              </Link>
              <Link href={ROUTES.signup} className="btn-primary">
                Bắt đầu miễn phí
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden p-2 text-ink-muted hover:text-ink"
          aria-label="Mở menu"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-line">
          <nav className="container-page py-4 flex flex-col gap-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className={cn(
                'block px-3 py-2.5 rounded-lg transition-colors',
                isHomeActive
                  ? 'bg-surface-subtle text-ink font-semibold'
                  : 'text-ink hover:bg-surface-muted'
              )}
            >
              Trang chủ
            </Link>

            <div className="text-xs font-semibold text-ink-subtle uppercase tracking-wider px-3 py-2">
              Công cụ
            </div>
            {toolsMenu.map((tool) => {
              const isActive = pathname === tool.href;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    'block px-3 py-2.5 rounded-lg transition-colors',
                    isActive
                      ? 'bg-surface-subtle text-ink font-semibold'
                      : 'text-ink hover:bg-surface-muted'
                  )}
                >
                  {tool.label}
                </Link>
              );
            })}
            <Link
              href={ROUTES.tools}
              onClick={() => setIsOpen(false)}
              className={cn(
                'block px-3 py-2.5 rounded-lg text-sm transition-colors',
                pathname === ROUTES.tools
                  ? 'bg-surface-subtle text-ink font-semibold'
                  : 'text-ink-muted hover:bg-surface-muted'
              )}
            >
              Xem tất cả công cụ
            </Link>
            <div className="h-px bg-line my-2" />
            <Link
              href="/#pricing"
              onClick={(e) => {
                handleAnchorClick('pricing')(e);
                setIsOpen(false);
              }}
              className={cn(
                'block px-3 py-2.5 rounded-lg transition-colors',
                isPricingActive
                  ? 'bg-surface-subtle text-ink font-semibold'
                  : 'text-ink hover:bg-surface-muted'
              )}
            >
              Bảng giá
            </Link>
            <Link
              href="/#mission"
              onClick={(e) => {
                handleAnchorClick('mission')(e);
                setIsOpen(false);
              }}
              className={cn(
                'block px-3 py-2.5 rounded-lg transition-colors',
                isMissionActive
                  ? 'bg-surface-subtle text-ink font-semibold'
                  : 'text-ink hover:bg-surface-muted'
              )}
            >
              Câu chuyện
            </Link>

            {!isAdmin && (
              <Link
                href={user ? ROUTES.dashboard : ROUTES.login}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded-lg transition-colors',
                  isDashboard
                    ? 'bg-surface-subtle text-ink font-semibold'
                    : 'text-ink hover:bg-surface-muted'
                )}
              >
                Sản phẩm
              </Link>
            )}
            {isAdmin && (
              <Link
                href={ROUTES.admin}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'block px-3 py-2.5 rounded-lg transition-colors',
                  isAdminRoute
                    ? 'bg-surface-subtle text-ink font-semibold'
                    : 'text-ink hover:bg-surface-muted'
                )}
              >
                Quản trị
              </Link>
            )}
            <div className="h-px bg-line my-2" />
            {user ? (
              <>
                <div className="px-3 py-2 text-xs text-ink-muted">
                  Đăng nhập với <span className="text-ink font-medium">{user.email}</span>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setIsOpen(false);
                    router.push(ROUTES.home);
                  }}
                  className="block w-full text-left px-3 py-2.5 text-ink hover:bg-surface-muted rounded-lg"
                >
                  Đăng xuất
                </button>
              </>
            ) : (
              <>
                <Link
                  href={ROUTES.login}
                  onClick={() => setIsOpen(false)}
                  className="block px-3 py-2.5 text-ink hover:bg-surface-muted rounded-lg"
                >
                  Đăng nhập
                </Link>
                <Link
                  href={ROUTES.signup}
                  onClick={() => setIsOpen(false)}
                  className="btn-primary mt-2 w-full"
                >
                  Bắt đầu miễn phí
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}