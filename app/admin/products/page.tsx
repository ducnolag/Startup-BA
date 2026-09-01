'use client';

import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
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
    setProducts(readStorage<Product[]>(STORAGE_KEYS.products, () => SEED_PRODUCTS, SEED_PRODUCTS));
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
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display font-bold text-2xl text-ink mb-1">Sản phẩm</h1>
          <p className="text-sm text-ink-muted">
            Quản lý danh sách sản phẩm theo dõi trên công cụ So sánh giá & Gợi ý giá.
          </p>
        </div>
        <button onClick={startCreate} className="btn-primary">
          <Plus className="w-4 h-4" />
          Thêm sản phẩm
        </button>
      </div>

      {isEditing && (
        <div className="card p-5 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-display font-bold text-lg text-ink">
              {editing ? 'Sửa sản phẩm' : 'Thêm sản phẩm mới'}
            </h2>
            <button
              onClick={cancel}
              className="p-1 text-ink-muted hover:text-ink"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-ink-muted mb-1.5 block">
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
              <label className="text-xs font-semibold text-ink-muted mb-1.5 block">
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
              <label className="text-xs font-semibold text-ink-muted mb-1.5 block">
                Giá (VNĐ)
              </label>
              <input
                type="number"
                className="input-field"
                value={form.price || ''}
                onChange={(e) => setForm({ ...form, price: Number(e.target.value) || 0 })}
                placeholder="24990000"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-ink-muted mb-1.5 block">
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
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm text-ink">Hiển thị cho người dùng</span>
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

      <div className="card overflow-hidden">
        {products.length === 0 ? (
          <div className="p-10 text-center text-ink-muted text-sm">
            Chưa có sản phẩm nào. Nhấn "Thêm sản phẩm" để tạo mới.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-surface-muted text-xs uppercase tracking-wider text-ink-subtle">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold">Tên</th>
                  <th className="text-left px-4 py-3 font-semibold">Danh mục</th>
                  <th className="text-right px-4 py-3 font-semibold">Giá</th>
                  <th className="text-center px-4 py-3 font-semibold">Trạng thái</th>
                  <th className="text-right px-4 py-3 font-semibold">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-surface-muted">
                    <td className="px-4 py-3">
                      <div className="font-medium text-ink">{p.name}</div>
                      {p.url && (
                        <a
                          href={p.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-brand hover:text-brand-deep truncate inline-block max-w-[280px]"
                        >
                          {p.url}
                        </a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-ink-muted">{p.category}</td>
                    <td className="px-4 py-3 text-right font-semibold text-ink">
                      {fmtPrice(p.price)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => toggleActive(p.id)}
                        className={cn(
                          'inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full transition-colors',
                          p.active
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
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
                          className="p-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted rounded"
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