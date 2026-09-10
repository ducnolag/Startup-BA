'use client';

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { X, Plus, Minus, Trash2, ShoppingBag } from 'lucide-react';
import type { Cart } from '@/lib/storefront/vn-backend';
import { formatVND } from '@/lib/agent/format';
import { cn } from '@/lib/utils';

interface CartPanelProps {
  open: boolean;
  cart: Cart;
  onClose: () => void;
  onUpdateQuantity: (product_id: string, quantity: number) => void;
  onRemove: (product_id: string) => void;
  onCheckout?: () => void;
}

export default function CartPanel({
  open,
  cart,
  onClose,
  onUpdateQuantity,
  onRemove,
  onCheckout,
}: CartPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const backdropRef = useRef<HTMLDivElement>(null);
  const [recentlyAdded, setRecentlyAdded] = useState<string | null>(null);
  const prevCartLengthRef = useRef(cart.items.length);

  // Track newly added items for flash animation
  useEffect(() => {
    const prevLength = prevCartLengthRef.current;
    if (cart.items.length > prevLength) {
      // Find the new item
      const prevIds = new Set(cart.items.slice(0, prevLength).map(i => i.product_id));
      const newItem = cart.items.find(i => !prevIds.has(i.product_id));
      if (newItem) {
        setRecentlyAdded(newItem.product_id);
        setTimeout(() => setRecentlyAdded(null), 1000);
      }
    }
    prevCartLengthRef.current = cart.items.length;
  }, [cart.items]);

  // Animate panel open/close
  useEffect(() => {
    if (!panelRef.current || !backdropRef.current) return;

    if (open) {
      gsap.fromTo(
        backdropRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.25, ease: 'power2.out' }
      );
      gsap.fromTo(
        panelRef.current,
        { x: '100%' },
        { x: '0%', duration: 0.35, ease: 'power3.out' }
      );
    } else {
      gsap.to(panelRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power3.in',
      });
      gsap.to(backdropRef.current, {
        opacity: 0,
        duration: 0.25,
        ease: 'power2.in',
      });
    }
  }, [open]);

  // Lock body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        ref={backdropRef}
        onClick={onClose}
        className="fixed inset-0 bg-ink/40 backdrop-blur-sm z-50"
        style={{ opacity: 0, pointerEvents: open ? 'auto' : 'none' }}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
        style={{ transform: 'translateX(100%)' }}
        role="dialog"
        aria-modal="true"
        aria-label="Giỏ hàng"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-line">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-ink" />
            <h2 className="text-lg font-semibold text-ink">Giỏ hàng</h2>
            <span className="px-2 py-0.5 bg-brand/10 text-brand text-xs font-bold rounded-full">
              {cart.item_count}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-surface-muted transition-colors"
            aria-label="Đóng giỏ hàng"
          >
            <X className="w-5 h-5 text-ink-muted" />
          </button>
        </div>

        {/* Cart items */}
        <div className="flex-1 overflow-y-auto">
          {cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-4 text-center">
              <div className="w-16 h-16 rounded-full bg-surface-muted flex items-center justify-center mb-4">
                <ShoppingBag className="w-8 h-8 text-ink-subtle" />
              </div>
              <h3 className="text-ink font-semibold mb-2">Giỏ hàng trống</h3>
              <p className="text-sm text-ink-muted">
                Thêm sản phẩm để bắt đầu mua sắm
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-line">
              {cart.items.map((item) => (
                <li
                  key={item.product_id}
                  className={cn(
                    'p-4 transition-all',
                    recentlyAdded === item.product_id && 'bg-emerald-50'
                  )}
                >
                  <div className="flex gap-3">
                    {/* Image placeholder */}
                    <div className="w-16 h-16 rounded-md bg-surface-muted shrink-0 flex items-center justify-center overflow-hidden">
                      {item.image_url ? (
                        <img
                          src={item.image_url}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">📦</span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-ink line-clamp-2 mb-1">
                        {item.title}
                      </h4>
                      <p className="text-sm font-bold font-mono text-ink">
                        {formatVND(item.price)}
                      </p>

                      {/* Quantity controls */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onUpdateQuantity(item.product_id, Math.max(1, item.quantity - 1))}
                            className="w-7 h-7 rounded-md border border-line hover:bg-surface-muted transition-colors flex items-center justify-center"
                            aria-label="Giảm số lượng"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-8 text-center text-sm font-medium font-mono">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => onUpdateQuantity(item.product_id, item.quantity + 1)}
                            className="w-7 h-7 rounded-md border border-line hover:bg-surface-muted transition-colors flex items-center justify-center"
                            aria-label="Tăng số lượng"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => onRemove(item.product_id)}
                          className="p-1.5 rounded-md text-danger hover:bg-danger/10 transition-colors"
                          aria-label="Xóa sản phẩm"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Subtotal for this item */}
                  <div className="mt-2 text-right">
                    <span className="text-xs text-ink-muted">
                      Thành tiền:{' '}
                    </span>
                    <span className="text-sm font-bold font-mono text-ink">
                      {formatVND(item.price * item.quantity)}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with subtotal and checkout */}
        {cart.items.length > 0 && (
          <div className="border-t border-line p-4 bg-surface-muted">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-ink-muted">Tạm tính</span>
              <span className="text-xl font-bold font-mono text-ink">
                {formatVND(cart.subtotal)}
              </span>
            </div>
            <button
              onClick={onCheckout}
              className="w-full py-3 bg-brand text-white font-semibold rounded-md hover:bg-brand/90 transition-colors"
            >
              Mua ngay
            </button>
            <p className="text-[10px] text-ink-subtle text-center mt-2">
              Thanh toán an toàn qua các cổng: COD, Banking, Ví điện tử
            </p>
          </div>
        )}
      </div>
    </>
  );
}
