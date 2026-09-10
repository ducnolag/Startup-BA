'use client';

import { useEffect, useState } from 'react';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Package,
  Shield,
  ChevronRight,
  Inbox,
  ExternalLink,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { readStorage, writeStorage } from '@/lib/storage';
import { SEED_PRODUCTS, STORAGE_KEYS } from '@/lib/constants';
import type { Product } from '@/lib/types';

type ProductDraft = Omit<Product, 'id' | 'createdAt'>;

const empty: ProductDraft = {
  name: '',
  category: '',
  price: 0,
  url: '',
  active: true,
};

function fmtPrice(n: number) {
  return `${n.toLocaleString('vi-VN')}đ`;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editing, setEditing] = useState<Product | null>(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState<ProductDraft>(empty);

  useEffect(() => {
    setProducts(
      readStorage<Product[]>(
        STORAGE_KEYS.products,
        () => SEED_PRODUCTS,
        SEED_PRODUCTS
      )
    );
  }, []);

  const persist = (next: Product[]) => {
    setProducts(next);
    writeStorage(STORAGE_KEYS.products, next);
  };

  const startCreate = () => {
    setEditing(null);
    setForm(empty);
    setCreating(true);
  };

  const startEdit = (p: Product) => {
    setCreating(false);
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      price: p.price,
      url: p.url,
      active: p.active,
    });
  };

  const cancel = () => {
    setEditing(null);
    setCreating(false);
    setForm(empty);
  };

  const save = () => {
    if (!form.name.trim() || !form.category.trim()) return;
    if (editing) {
      const next = products.map((p) => (p.id === editing.id ? { ...p, ...form } : p));
      persist(next);
    } else {
      const newProduct: Product = {
        id: `p_${Date.now().toString(36)}`,
        ...form,
        createdAt: new Date().toISOString(),
      };
      persist([newProduct, ...products]);
    }
    cancel();
  };

  const remove = (id: string) => {
    if (!confirm('Xóa sản phẩm này?')) return;
    persist(products.filter((p) => p.id !== id));
  };

  const toggleActive = (id: string) => {
    persist(products.map((p) => (p.id === id ? { ...p, active: !p.active } : p)));
  };

  const isEditing = editing || creating;

  return (
    <div className="space-y-6">
      {/* ── Page header ── */}
      <div className="flex items-end justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-ink-subtle mb-3">
            <Shield className="w-3 h-3" />
            <span>Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-ink-muted">Sản phẩm</span>
          </div>
          <h1
            className="font-display font-bold text-3xl text-ink tracking-tight"
            style={{ letterSpacing: '-0.03em' }}
          >
            Sản{' '}
            <span className="bg-gradient-to-r from-brand to-depth bg-clip-text text-transparent">
              phẩm.
            </span>
          </h1>
          <p className="text-sm text-ink-muted mt-2 max-w-2xl">
            Quản lý danh sách sản phẩm theo dõi trên công cụ So sánh giá &amp; Gợi ý giá.
          </p>
        </div>
        <button onClick={startCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </button>
      </div>

      {isEditing && (
        <div className="relative card p-5 md:p-6 overflow-hidden">
          <div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand to-depth"
            aria-hidden
          />
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono font-semibold text-ink-subtle tracking-wider">
              {editing ? '02' : '01'}
            </span>
            <h2 className="font-display font-bold text-lg text-ink">
              {editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <button
              onClick={cancel}
              className="ml-auto p-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted rounded"
              aria-label="Đóng"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink mb-2 block">
                Tên sản phẩm
              </label>
              <input
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="iPhone 15 Pro 256GB"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink mb-2 block">
                Danh mục
              </label>
              <input
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                placeholder="Điện thoại / Laptop / ..."
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink mb-2 block">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                className="input-field"
                value={form.price || ''}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) || 0 })
                }
                placeholder="24990000"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink mb-2 block">
                URL sản phẩm
              </label>
              <input
                className="input-field"
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder="https://shopee.vn/..."
              />
            </div>
            <div className="md:col-span-2">
              <label className="flex items-center gap-2.5 cursor-pointer p-3 rounded-lg bg-surface-muted border border-line">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 rounded border-line text-brand focus:ring-2 focus:ring-brand/20"
                />
                <span className="text-sm text-ink font-medium">
                  Hiển thị cho người dùng
                </span>
                <span className="text-xs text-ink-subtle ml-auto">
                  Tắt để ẩn khỏi công cụ
                </span>
              </label>
            </div>
          </div>

          <div className="mt-5 flex items-center gap-2">
            <button onClick={save} className="btn-primary">
              <Save className="w-4 h-4" />
              Lưu
            </button>
            <button onClick={cancel} className="btn-ghost">
              Hủy
            </button>
          </div>
        </div>
      )}

      <div className="relative card overflow-hidden">
        <div
          className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-depth to-brand"
          aria-hidden
        />
        <div className="px-5 py-4 border-b border-line flex items-center gap-2">
          <span className="text-[10px] font-mono font-semibold text-ink-subtle tracking-wider">
            01
          </span>
          <Package className="w-4 h-4 text-depth" />
          <h2 className="font-display font-bold text-base text-ink">
            Danh sách sản phẩm
          </h2>
          <span className="ml-auto text-xs text-ink-muted tabular-nums">
            {products.length} mục
          </span>
        </div>

        {products.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-surface-muted border border-line flex items-center justify-center mx-auto mb-4">
              <Inbox className="w-6 h-6 text-ink-subtle" />
            </div>
            <h3 className="font-display font-bold text-base text-ink mb-1">
              Chưa có sản phẩm nào
            </h3>
            <p className="text-ink-muted text-sm max-w-sm mx-auto mb-5">
              Nhấn{' '}
              <span className="text-ink font-medium">Thêm sản phẩm</span> để
              tạo mục đầu tiên cho công cụ so sánh giá.
            </p>
            <button onClick={startCreate} className="btn-primary">
              <Plus className="w-4 h-4" />
              Thêm sản phẩm
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wider text-ink-subtle">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Tên</th>
                  <th className="text-left px-4 py-3 font-semibold">Danh mục</th>
                  <th className="text-right px-4 py-3 font-semibold">Giá</th>
                  <th className="text-center px-4 py-3 font-semibold">
                    Trạng thái
                  </th>
                  <th className="text-right px-4 py-3 font-semibold">
                    Hành động
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-surface-muted transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{p.name}</div>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-brand hover:text-brand-700 inline-flex items-center gap-1 max-w-[280px] truncate"
                        >
                          {p.url}
                          <ExternalLink className="w-3 h-3 shrink-0" />
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">
                      <span className="chip text-[10px]">{p.category}</span>
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-ink tabular-nums">
                      {fmtPrice(p.price)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(p.id)}
                        className={cn(
                          'inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors',
                          p.active
                            ? 'bg-success/10 text-success hover:bg-success/20'
                            : 'bg-line text-ink-muted hover:bg-surface-muted'
                        )}
                      >
                        {p.active ? 'Đang hiển thị' : 'Đã ẩn'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => startEdit(p)}
                          className="p-1.5 text-ink-muted hover:text-brand hover:bg-brand/10 rounded"
                          aria-label="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => remove(p.id)}
                          className="p-1.5 text-ink-muted hover:text-danger hover:bg-danger/10 rounded"
                          aria-label="Xóa"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
