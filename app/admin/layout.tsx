'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Wrench,
  Vote,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

const navItems = [
  { href: ROUTES.admin, label: 'Tổng quan', icon: LayoutDashboard },
  { href: ROUTES.adminProducts, label: 'Sản phẩm', icon: Package },
  { href: ROUTES.adminTools, label: 'Công cụ', icon: Wrench },
  { href: ROUTES.adminVotes, label: 'Bình chọn', icon: Vote },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push('/login');
    } else if (!isAdmin) {
      router.push('/dashboard');
    }
  }, [user, isAdmin, loading, router]);

  if (loading || !user || !isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-muted">
        Đang kiểm tra quyền truy cập...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-muted pt-20">
      <div className="container-page">
        <div className="grid lg:grid-cols-[240px_1fr] gap-6 pb-16">
          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="card p-4">
              <div className="flex items-center gap-2 pb-3 mb-2 border-b border-line">
                <Shield className="w-4 h-4 text-brand" />
                <span className="text-xs font-bold uppercase tracking-wider text-ink">
                  Admin Panel
                </span>
              </div>
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.href === ROUTES.admin
                      ? pathname === ROUTES.admin
                      : pathname?.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        'flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors',
                        isActive
                          ? 'bg-ink text-white font-semibold'
                          : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
                      )}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-4 pt-3 border-t border-line">
                <Link
                  href={ROUTES.home}
                  className="flex items-center gap-2 px-3 py-2 text-xs text-ink-muted hover:text-ink rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Về trang chính
                </Link>
              </div>
            </div>
          </aside>

          {/* Main */}
          <div className="min-w-0">{children}</div>
        </div>
      </div>
    </div>
  );
}