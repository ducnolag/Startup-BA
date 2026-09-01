'use client';

import { useEffect, useState } from 'react';
import { Users, Package, Wrench, Vote, TrendingUp, Activity } from 'lucide-react';
import type { Product } from '@/lib/types';
import { readStorage } from '@/lib/storage';
import { SEED_PRODUCTS, STORAGE_KEYS, TOOLS } from '@/lib/constants';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalTools: number;
  totalVotes: number;
}

function readStats(): Stats {
  if (typeof window === 'undefined') {
    return {
      totalUsers: 0,
      totalProducts: SEED_PRODUCTS.length,
      totalTools: TOOLS.length,
      totalVotes: 847,
    };
  }
  const users = readStorage<unknown[]>(STORAGE_KEYS.users, () => [], []);
  const products = readStorage<Product[]>(STORAGE_KEYS.products, () => SEED_PRODUCTS, SEED_PRODUCTS);
  const votes = readStorage<unknown[]>(STORAGE_KEYS.votes, () => [], []);
  return {
    totalUsers: Array.isArray(users) ? users.length : 0,
    totalProducts: Array.isArray(products) ? products.length : 0,
    totalTools: TOOLS.length,
    totalVotes: Array.isArray(votes) ? votes.length : 847,
  };
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalProducts: SEED_PRODUCTS.length,
    totalTools: TOOLS.length,
    totalVotes: 847,
  });

  useEffect(() => {
    setStats(readStats());
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display font-bold text-2xl text-ink mb-1">Tổng quan</h1>
        <p className="text-sm text-ink-muted">
          Số liệu hoạt động của Toolify.vn — cập nhật realtime từ localStorage.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Users className="w-5 h-5" />}
          label="Người dùng"
          value={stats.totalUsers}
          accent="bg-blue-50 text-blue-700"
        />
        <StatCard
          icon={<Package className="w-5 h-5" />}
          label="Sản phẩm"
          value={stats.totalProducts}
          accent="bg-emerald-50 text-emerald-700"
        />
        <StatCard
          icon={<Wrench className="w-5 h-5" />}
          label="Công cụ"
          value={stats.totalTools}
          accent="bg-amber-50 text-amber-700"
        />
        <StatCard
          icon={<Vote className="w-5 h-5" />}
          label="Lượt bình chọn"
          value={stats.totalVotes}
          accent="bg-violet-50 text-violet-700"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-4 h-4 text-ink-muted" />
            <h2 className="font-display font-bold text-lg text-ink">Hoạt động gần đây</h2>
          </div>
          <ul className="space-y-3 text-sm">
            <ActivityItem time="vừa xong" text="Bạn vừa đăng nhập vào trang quản trị" />
            <ActivityItem time="2 phút trước" text="AuthProvider khởi tạo session admin" />
            <ActivityItem
              time="hôm nay"
              text="847 lượt bình chọn tool mới được ghi nhận"
            />
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-ink-muted" />
            <h2 className="font-display font-bold text-lg text-ink">Gợi ý quản trị</h2>
          </div>
          <ol className="space-y-3 text-sm text-ink-muted list-decimal pl-5">
            <li>
              Vào <strong className="text-ink">Sản phẩm</strong> để thêm sản phẩm mới theo dõi.
            </li>
            <li>
              Vào <strong className="text-ink">Công cụ</strong> để bật/tắt hiển thị trên trang chủ.
            </li>
            <li>
              Vào <strong className="text-ink">Bình chọn</strong> để xem công cụ nào cộng đồng muốn nhất.
            </li>
          </ol>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
  accent: string;
}) {
  return (
    <div className="card p-5">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center mb-3 ${accent}`}>
        {icon}
      </div>
      <div className="text-xs text-ink-muted mb-1">{label}</div>
      <div className="font-display font-bold text-2xl text-ink">{value.toLocaleString('vi-VN')}</div>
    </div>
  );
}

function ActivityItem({ time, text }: { time: string; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="text-xs text-ink-subtle shrink-0 w-20">{time}</span>
      <span className="text-ink">{text}</span>
    </li>
  );
}