'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  GraduationCap,
  TrendingDown,
  Sparkles,
  Bookmark,
  Bell,
  LogOut,
  Shield,
  User,
  ShoppingBag,
  Settings,
} from 'lucide-react';
import Navigation from '@/components/layout/Navigation';
import Footer from '@/components/layout/Footer';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { readStorage } from '@/lib/storage';
import { SEED_SAVED, STORAGE_KEYS } from '@/lib/constants';
import type { SavedItem } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAdmin, logout } = useAuth();
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [tab, setTab] = useState<'profile' | 'saved' | 'settings'>('profile');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) setSaved(readStorage<SavedItem[]>(STORAGE_KEYS.saved, () => SEED_SAVED, []));
  }, [user]);

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-ink-muted">
        Đang tải...
      </div>
    );
  }

  const initials = user.fullName.charAt(0).toUpperCase();

  return (
    <div className="relative bg-surface-muted min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1 pt-32 md:pt-40 pb-16 px-6 flex flex-col justify-center">
        <div className="container-page max-w-6xl w-full">
          <div className="grid md:grid-cols-[260px_1fr] gap-8 items-start">
            
            {/* Sidebar (Left Column) */}
            <aside className="sticky top-24 space-y-4">
              {/* Profile Summary Card */}
              <div className="card p-5 text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-brand text-white flex items-center justify-center text-3xl font-bold mb-3">
                  {initials}
                </div>
                <h1 className="font-display font-bold text-xl text-ink truncate">
                  {user.fullName}
                </h1>
                <p className="text-ink-muted text-xs truncate mt-1">{user.email}</p>
                {isAdmin && (
                  <div className="mt-3">
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-deep bg-brand/10 px-2 py-1 rounded-full">
                      <Shield className="w-3 h-3" />
                      Quản trị viên
                    </span>
                  </div>
                )}
              </div>

              {/* Navigation Menu */}
              <div className="card p-3">
                <nav className="space-y-1">
                  {(
                    [
                      { id: 'profile', label: 'Thông tin cá nhân', icon: User },
                      { id: 'saved', label: 'Đơn hàng & Đã lưu', icon: ShoppingBag },
                      { id: 'settings', label: 'Cài đặt', icon: Settings },
                    ] as const
                  ).map((t) => {
                    const Icon = t.icon;
                    const isActive = tab === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => setTab(t.id)}
                        className={cn(
                          'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left',
                          isActive
                            ? 'bg-ink text-white'
                            : 'text-ink-muted hover:text-ink hover:bg-surface-muted'
                        )}
                      >
                        <Icon className="w-4 h-4" />
                        {t.label}
                      </button>
                    );
                  })}
                </nav>

                <div className="mt-3 pt-3 border-t border-line space-y-1">
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-ink-muted hover:text-ink hover:bg-surface-muted transition-colors"
                    >
                      <Shield className="w-4 h-4" />
                      Trang quản trị
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      router.push('/');
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-danger hover:bg-danger/10 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            </aside>

            {/* Main Content (Right Column) */}
            <div className="min-w-0 space-y-6">
              {tab === 'profile' && (
                <div className="card p-6 md:p-8">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="w-5 h-5 text-brand" />
                    <h2 className="font-display font-bold text-xl text-ink">Hồ sơ cá nhân</h2>
                  </div>
                  <p className="text-sm text-ink-muted mb-8">
                    Quản lý thông tin chi tiết và theo dõi hoạt động của bạn trên Toolify.
                  </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1.5 block">Họ và tên</label>
                <div className="font-medium text-ink">{user.fullName}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1.5 block">Email</label>
                <div className="font-medium text-ink">{user.email}</div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1.5 block">Vai trò</label>
                <div className="font-medium text-ink flex items-center gap-2">
                  {isAdmin ? (
                    <span className="text-brand-deep font-bold flex items-center gap-1"><Shield className="w-4 h-4"/> Quản trị viên</span>
                  ) : (
                    <span className="text-ink">Người dùng</span>
                  )}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1.5 block">Ngày tham gia</label>
                <div className="font-medium text-ink">{new Date(user.createdAt).toLocaleDateString('vi-VN')}</div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-line">
              <h3 className="font-display font-bold text-md text-ink mb-4">Thống kê hoạt động</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-surface-muted p-4 rounded-xl border border-line">
                  <div className="text-2xl font-bold text-ink mb-1">{saved.length}</div>
                  <div className="text-xs text-ink-muted">Sản phẩm/Học bổng đã lưu</div>
                </div>
                <div className="bg-surface-muted p-4 rounded-xl border border-line">
                  <div className="text-2xl font-bold text-ink mb-1">0</div>
                  <div className="text-xs text-ink-muted">Đơn hàng đã đặt</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === 'saved' && (
          <div className="card divide-y divide-line">
            {saved.length === 0 ? (
              <div className="p-10 text-center">
                <Bookmark className="w-10 h-10 text-ink-subtle mx-auto mb-3" />
                <p className="text-ink-muted text-sm">
                  Bạn chưa lưu mục nào. Lưu học bổng/sản phẩm từ các công cụ để xem lại ở đây.
                </p>
              </div>
            ) : (
              saved.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="flex items-center gap-4 p-4 hover:bg-surface-muted transition-colors"
                >
                  <div
                    className={cn(
                      'w-10 h-10 rounded-lg flex items-center justify-center',
                      item.type === 'scholarship'
                        ? 'bg-blue-50 text-blue-700'
                        : item.type === 'product'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-violet-50 text-violet-700'
                    )}
                  >
                    {item.type === 'scholarship' ? (
                      <GraduationCap className="w-5 h-5" />
                    ) : item.type === 'product' ? (
                      <TrendingDown className="w-5 h-5" />
                    ) : (
                      <Sparkles className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-ink truncate">
                      {item.title}
                    </div>
                    <div className="text-xs text-ink-muted truncate">{item.subtitle}</div>
                  </div>
                  <div className="text-xs text-ink-subtle shrink-0">
                    {new Date(item.savedAt).toLocaleDateString('vi-VN')}
                  </div>
                </Link>
              ))
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="card p-6 md:p-8 max-w-2xl">
            <h2 className="font-display font-bold text-lg text-ink mb-1">Cài đặt tài khoản</h2>
            <p className="text-sm text-ink-muted mb-6">
              Quản lý thông tin cá nhân và tùy chọn thông báo.
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1.5 block">
                  Họ và tên
                </label>
                <input className="input-field" defaultValue={user.fullName} />
              </div>
              <div>
                <label className="text-xs font-semibold text-ink-muted mb-1.5 block">
                  Email
                </label>
                <input className="input-field" defaultValue={user.email} disabled />
                <p className="text-xs text-ink-subtle mt-1">
                  Email là định danh đăng nhập, không thể thay đổi.
                </p>
              </div>

              <div className="pt-4 border-t border-line">
                <h3 className="text-sm font-semibold text-ink mb-3 flex items-center gap-2">
                  <Bell className="w-4 h-4 text-ink-muted" />
                  Thông báo
                </h3>
                <label className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm text-ink">Học bổng mới phù hợp với hồ sơ của tôi</span>
                </label>
                <label className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-sm text-ink">Sản phẩm tôi theo dõi đạt mức giá mục tiêu</span>
                </label>
                <label className="flex items-center gap-3 py-2 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-sm text-ink">Bản tin hàng tuần qua email</span>
                </label>
              </div>

              <div className="pt-4 border-t border-line">
                <button className="btn-primary">Lưu thay đổi</button>
              </div>
            </div>
          </div>
        )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function ToolCard({
  icon,
  title,
  desc,
  href,
  accent,
  isNew,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  href: string;
  accent: string;
  isNew?: boolean;
}) {
  return (
    <Link
      href={href}
      className="card p-5 hover:border-ink-muted transition-colors group block"
    >
      <div className="flex items-start justify-between mb-3">
        <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', accent)}>
          {icon}
        </div>
        {isNew && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-brand-deep bg-brand/10 px-1.5 py-0.5 rounded">
            Mới
          </span>
        )}
      </div>
      <div className="font-semibold text-ink mb-1 group-hover:text-brand transition-colors">
        {title}
      </div>
      <div className="text-xs text-ink-muted">{desc}</div>
    </Link>
  );
}