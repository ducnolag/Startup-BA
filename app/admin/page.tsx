'use client';

import { useEffect, useState } from 'react';
import {
  Users,
  Package,
  Wrench,
  Vote,
  TrendingUp,
  Activity,
  BarChart2,
  CheckCircle,
  Shield,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
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
  const products = readStorage<Product[]>(
    STORAGE_KEYS.products,
    () => SEED_PRODUCTS,
    SEED_PRODUCTS
  );
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

  const statCards = [
    {
      number: '01',
      label: 'Người dùng',
      value: stats.totalUsers,
      icon: <Users className="w-4 h-4" />,
      accent: 'from-brand to-depth',
    },
    {
      number: '02',
      label: 'Sản phẩm',
      value: stats.totalProducts,
      icon: <Package className="w-4 h-4" />,
      accent: 'from-depth to-brand',
    },
    {
      number: '03',
      label: 'Công cụ',
      value: stats.totalTools,
      icon: <Wrench className="w-4 h-4" />,
      accent: 'from-brand to-depth',
    },
    {
      number: '04',
      label: 'Lượt bình chọn',
      value: stats.totalVotes,
      icon: <Vote className="w-4 h-4" />,
      accent: 'from-depth to-brand',
    },
  ];

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div>
        <div className="flex items-center gap-2 text-xs text-ink-subtle mb-3">
          <Shield className="w-3 h-3" />
          <span>Admin</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-ink-muted">Tổng quan</span>
        </div>
        <div className="flex items-end justify-between flex-wrap gap-3">
          <div>
            <h1
              className="font-display font-bold text-3xl text-ink tracking-tight"
              style={{ letterSpacing: '-0.03em' }}
            >
              Tổng{' '}
              <span className="bg-gradient-to-r from-brand to-depth bg-clip-text text-transparent">
                quan.
              </span>
            </h1>
            <p className="text-sm text-ink-muted mt-2 max-w-2xl">
              Số liệu thật từ localStorage. Biểu đồ là dữ liệu minh họa cho đến khi pipeline phân tích được kết nối.
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 text-[11px] font-mono uppercase tracking-wider text-brand bg-brand/10 px-2.5 py-1 rounded-full">
            <Sparkles className="w-3 h-3" />
            Realtime
          </span>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <div key={s.number} className="relative card p-5 overflow-hidden">
            <div
              className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${s.accent}`}
              aria-hidden
            />
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-mono font-semibold text-ink-subtle tracking-wider">
                {s.number}
              </span>
              <div
                className={
                  s.number === '01' || s.number === '03'
                    ? 'w-8 h-8 rounded-lg bg-brand/10 text-brand flex items-center justify-center'
                    : 'w-8 h-8 rounded-lg bg-depth/10 text-depth flex items-center justify-center'
                }
              >
                {s.icon}
              </div>
            </div>
            <div className="text-[11px] text-ink-muted mb-1">{s.label}</div>
            <div className="font-display font-bold text-2xl text-ink tabular-nums tracking-tight">
              {s.value.toLocaleString('vi-VN')}
            </div>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid lg:grid-cols-[2fr_1fr] gap-5">
        <div className="relative card p-6 min-h-[400px] overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-depth"
            aria-hidden
          />
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-mono font-semibold text-ink-subtle tracking-wider">
              01
            </span>
            <TrendingUp className="w-4 h-4 text-brand" />
            <h2 className="font-display font-bold text-lg text-ink">
              Lượt xem &amp; Bình chọn (7 ngày qua)
            </h2>
            <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-ink-subtle bg-surface-muted px-2 py-0.5 rounded">
              Dữ liệu minh họa
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockActivityData}
                margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis
                  dataKey="name"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="Lượt xem"
                  stroke="#2563eb"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="votes"
                  name="Bình chọn"
                  stroke="#8b5cf6"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relative card p-6 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-depth to-brand"
            aria-hidden
          />
          <div className="flex items-center gap-2 mb-6">
            <span className="text-[10px] font-mono font-semibold text-ink-subtle tracking-wider">
              02
            </span>
            <BarChart2 className="w-4 h-4 text-depth" />
            <h2 className="font-display font-bold text-lg text-ink">
              Phân bổ danh mục
            </h2>
            <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-ink-subtle bg-surface-muted px-2 py-0.5 rounded">
              Dữ liệu minh họa
            </span>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockCategoryData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e5e7eb"
                  horizontal={false}
                />
                <XAxis
                  type="number"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  stroke="#4b5563"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  width={80}
                />
                <Tooltip
                  cursor={{ fill: '#f3f4f6' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }}
                />
                <Bar
                  dataKey="count"
                  name="Số lượng"
                  fill="#10b981"
                  radius={[0, 4, 4, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Activity + status row ── */}
      <div className="grid lg:grid-cols-2 gap-5">
        <div className="relative card p-6 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-depth"
            aria-hidden
          />
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-mono font-semibold text-ink-subtle tracking-wider">
              03
            </span>
            <Activity className="w-4 h-4 text-brand" />
            <h2 className="font-display font-bold text-lg text-ink">
              Hoạt động hệ thống
            </h2>
            <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-ink-subtle bg-surface-muted px-2 py-0.5 rounded">
              Dữ liệu minh họa
            </span>
          </div>
          <ul className="space-y-4">
            <ActivityItem time="Vừa xong" text="Quản trị viên đăng nhập thành công" />
            <ActivityItem
              time="15 phút trước"
              text="Dữ liệu học bổng mới được đồng bộ từ Supabase"
            />
            <ActivityItem
              time="2 giờ trước"
              text="Phát hiện 12 thay đổi giá bất thường"
            />
            <ActivityItem
              time="Hôm nay"
              text="Hệ thống ghi nhận 847 lượt bình chọn tính năng"
            />
          </ul>
        </div>

        <div className="relative card p-6 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-depth to-brand"
            aria-hidden
          />
          <div className="flex items-center gap-2 mb-5">
            <span className="text-[10px] font-mono font-semibold text-ink-subtle tracking-wider">
              04
            </span>
            <CheckCircle className="w-4 h-4 text-depth" />
            <h2 className="font-display font-bold text-lg text-ink">
              Trạng thái kỹ thuật
            </h2>
            <span className="ml-auto text-[10px] uppercase tracking-wider font-semibold text-ink-subtle bg-surface-muted px-2 py-0.5 rounded">
              Dữ liệu minh họa
            </span>
          </div>
          <div className="space-y-3">
            <StatusRow
              label="Supabase Auth"
              status="online"
              detail="Phản hồi 42ms"
            />
            <StatusRow
              label="Database (PostgreSQL)"
              status="online"
              detail="Phản hồi 18ms"
            />
            <StatusRow
              label="Scraping Engine"
              status="warning"
              detail="Đang bảo trì"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ time, text }: { time: string; text: string }) {
  return (
    <li className="flex items-start gap-3 pb-3 border-b border-line-subtle last:border-0 last:pb-0">
      <span className="text-[10px] font-mono text-ink-subtle shrink-0 w-24 pt-0.5 tracking-wider">
        {time.toUpperCase()}
      </span>
      <span className="text-sm text-ink leading-relaxed">{text}</span>
    </li>
  );
}

function StatusRow({
  label,
  status,
  detail,
}: {
  label: string;
  status: 'online' | 'warning' | 'offline';
  detail: string;
}) {
  const palette = {
    online: 'bg-success/5 border-success/20 text-success bg-success/10',
    warning: 'bg-warning/5 border-warning/20 text-warning bg-warning/10',
    offline: 'bg-danger/5 border-danger/20 text-danger bg-danger/10',
  } as const;
  const labelMap = {
    online: 'Online',
    warning: 'Bảo trì',
    offline: 'Offline',
  } as const;

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${
        status === 'online'
          ? 'bg-success/5 border-success/20'
          : status === 'warning'
          ? 'bg-warning/5 border-warning/20'
          : 'bg-danger/5 border-danger/20'
      }`}
    >
      <div>
        <div className="text-sm font-medium text-ink">{label}</div>
        <div className="text-[11px] text-ink-muted mt-0.5">{detail}</div>
      </div>
      <span
        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded ${
          status === 'online'
            ? 'text-success bg-success/10'
            : status === 'warning'
            ? 'text-warning bg-warning/10'
            : 'text-danger bg-danger/10'
        }`}
      >
        {labelMap[status]}
      </span>
    </div>
  );
}
