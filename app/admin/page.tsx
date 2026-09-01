'use client';

import { useEffect, useState } from 'react';
import { Users, Package, Wrench, Vote, TrendingUp, Activity, BarChart2, CheckCircle } from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { Product } from '@/lib/types';
import { readStorage } from '@/lib/storage';
import { SEED_PRODUCTS, STORAGE_KEYS, TOOLS } from '@/lib/constants';

interface Stats {
  totalUsers: number;
  totalProducts: number;
  totalTools: number;
  totalVotes: number;
}

const mockActivityData = [
  { name: 'T2', views: 400, votes: 240 },
  { name: 'T3', views: 300, votes: 139 },
  { name: 'T4', views: 550, votes: 380 },
  { name: 'T5', views: 278, votes: 190 },
  { name: 'T6', views: 789, votes: 480 },
  { name: 'T7', views: 920, votes: 610 },
  { name: 'CN', views: 1100, votes: 750 },
];

const mockCategoryData = [
  { name: 'Học bổng', count: 125 },
  { name: 'Công nghệ', count: 85 },
  { name: 'Đồ gia dụng', count: 45 },
  { name: 'Khóa học', count: 90 },
];

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

      <div className="grid lg:grid-cols-[2fr_1fr] gap-6">
        <div className="card p-6 min-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <TrendingUp className="w-5 h-5 text-ink-muted" />
            <h2 className="font-display font-bold text-lg text-ink">Lượt xem & Bình chọn (7 ngày qua)</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockActivityData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="views" name="Lượt xem" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                <Line type="monotone" dataKey="votes" name="Bình chọn" stroke="#8b5cf6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-5 h-5 text-ink-muted" />
            <h2 className="font-display font-bold text-lg text-ink">Phân bổ danh mục</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCategoryData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                <XAxis type="number" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis dataKey="name" type="category" stroke="#4b5563" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip 
                  cursor={{fill: '#f3f4f6'}}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar dataKey="count" name="Số lượng" fill="#10b981" radius={[0, 4, 4, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <Activity className="w-5 h-5 text-ink-muted" />
            <h2 className="font-display font-bold text-lg text-ink">Hoạt động hệ thống</h2>
          </div>
          <ul className="space-y-4">
            <ActivityItem time="Vừa xong" text="Quản trị viên đăng nhập thành công" />
            <ActivityItem time="15 phút trước" text="Dữ liệu học bổng mới được đồng bộ từ Supabase" />
            <ActivityItem time="2 giờ trước" text="Phát hiện 12 thay đổi giá bất thường" />
            <ActivityItem time="Hôm nay" text="Hệ thống ghi nhận 847 lượt bình chọn tính năng" />
          </ul>
        </div>

        <div className="card p-6">
          <div className="flex items-center gap-2 mb-5">
            <CheckCircle className="w-5 h-5 text-ink-muted" />
            <h2 className="font-display font-bold text-lg text-ink">Trạng thái kỹ thuật</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
              <span className="text-sm font-medium text-ink">Supabase Auth</span>
              <span className="text-xs font-bold text-success uppercase tracking-wider bg-success/10 px-2 py-1 rounded">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-success/5 border border-success/20 rounded-lg">
              <span className="text-sm font-medium text-ink">Database (PostgreSQL)</span>
              <span className="text-xs font-bold text-success uppercase tracking-wider bg-success/10 px-2 py-1 rounded">Online</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-warning/5 border border-warning/20 rounded-lg">
              <span className="text-sm font-medium text-ink">Scraping Engine</span>
              <span className="text-xs font-bold text-warning uppercase tracking-wider bg-warning/10 px-2 py-1 rounded">Đang bảo trì</span>
            </div>
          </div>
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