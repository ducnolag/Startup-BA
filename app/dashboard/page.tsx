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
} from 'lucide-react';
import { useAuth } from '@/components/providers/AuthProvider';
import { cn } from '@/lib/utils';
import { readStorage } from '@/lib/storage';
import { SEED_SAVED, STORAGE_KEYS } from '@/lib/constants';
import type { SavedItem } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAdmin, logout } = useAuth();
  const [saved, setSaved] = useState<SavedItem[]>([]);
  const [tab, setTab] = useState<'overview' | 'saved' | 'settings'>('overview');

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
    <main className="min-h-screen bg-surface-muted pt-24 pb-16 px-6">
      <div className="container-page">
        {/* Header */}
        <div className="card p-6 md:p-8 mb-6">
          <div className="flex items-start gap-4 flex-wrap">
            <div className="w-14 h-14 rounded-full bg-brand text-white flex items-center justify-center text-xl font-bold shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-[200px]">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display font-bold text-2xl text-ink">
                  {user.fullName}
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-deep bg-brand/10 px-1.5 py-0.5 rounded">
                    <Shield className="w-2.5 h-2.5" />
                    Admin
                  </span>
                )}
              </div>
              <p className="text-ink-muted text-sm mt-1">{user.email}</p>
              <p className="text-ink-subtle text-xs mt-2">
                Tham gia từ {new Date(user.createdAt).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <Link href="/admin" className="btn-ghost">
                  <Shield className="w-4 h-4" />
                  Trang quản trị
                </Link>
              )}
              <button
                onClick={() => {
                  logout();
                  router.push('/');
                }}
                className="btn-ghost"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-line overflow-x-auto">
          {(
            [
              { id: 'overview', label: 'Tổng quan' },
              { id: 'saved', label: 'Đã lưu' },
              { id: 'settings', label: 'Cài đặt' },
            ] as const
          ).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap',
                tab === t.id
                  ? 'border-ink text-ink'
                  : 'border-transparent text-ink-muted hover:text-ink'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <ToolCard
              icon={<GraduationCap className="w-5 h-5" />}
              title="Săn học bổng"
              desc="Tìm kiếm trong 500+ cơ hội quốc tế"
              href="/tools/scholarship"
              accent="bg-blue-50 text-blue-700"
            />
            <ToolCard
              icon={<TrendingDown className="w-5 h-5" />}
              title="So sánh giá"
              desc="Lịch sử giá 90 ngày trên 4 sàn"
              href="/tools/price-compare"
              accent="bg-emerald-50 text-emerald-700"
            />
            <ToolCard
              icon={<Sparkles className="w-5 h-5" />}
              title="Gợi ý giá AI"
              desc="Chatbot phân tích & khuyến nghị"
              href="/tools/price-recommend"
              accent="bg-violet-50 text-violet-700"
              isNew
            />
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
    </main>
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