'use client';

import Link from 'next/link';

const CATEGORIES = [
  {
    title: 'Làm đẹp',
    desc: 'Son, serum, skincare, mỹ phẩm Hàn — phát hiện giá ảo trước mỗi mùa sale.',
    bg: 'linear-gradient(135deg, #fce4ec 0%, #f8bbd0 100%)',
  },
  {
    title: 'Nhà cửa & Đời sống',
    desc: 'Đồ gia dụng, thiết bị thông minh — so sánh voucher Shopee, Lazada, Tiki cùng lúc.',
    bg: 'linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%)',
  },
  {
    title: 'Thời trang nữ',
    desc: 'Đầm, áo, túi — đánh giá deal theo xu hướng giá thật, không theo quảng cáo.',
    bg: 'linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%)',
  },
];

export default function CategorySection() {
  return (
    <section className="py-16 md:py-20 bg-surface-muted border-y border-line">
      <div className="container-page">
        <div className="max-w-2xl mb-10 md:mb-12">
          <div className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand-deep mb-3">
            Danh mục phổ biến
          </div>
          <h2 className="font-display font-bold text-ink tracking-tight text-2xl md:text-3xl mb-3" style={{ letterSpacing: '-0.025em' }}>
            Tập trung vào 3 nhóm sản phẩm bạn chọn
          </h2>
          <p className="text-ink-muted">
            Chúng tôi không crawl toàn bộ — chỉ giám sát những gì người Việt hay mua nhất.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5 md:gap-6">
          {CATEGORIES.map((cat, i) => (
            <div
              key={cat.title}
              className="relative rounded-2xl overflow-hidden border border-line bg-white p-6 md:p-8 group hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300"
            >
              {/* Decorative gradient background */}
              <div
                className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-30 blur-2xl"
                style={{ background: cat.bg }}
                aria-hidden
              />

              <div className="relative">
                <div className="text-[11px] font-semibold text-ink-subtle uppercase tracking-wider mb-3">
                  0{i + 1}
                </div>
                <h3 className="font-display font-bold text-xl text-ink mb-3 tracking-tight">
                  {cat.title}
                </h3>
                <p className="text-sm text-ink-muted leading-relaxed">
                  {cat.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}