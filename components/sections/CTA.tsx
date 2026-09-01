'use client';

import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import { ROUTES } from '@/lib/constants';

export default function CTA() {
  const { user } = useAuth();

  return (
    <section id="contact" className="py-20 md:py-28 bg-white">
      <div className="container-page">
        <div data-anim className="card p-10 md:p-16 lg:p-20 text-center max-w-4xl mx-auto">
          {user ? (
            <>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brand-deep bg-brand/10 px-3 py-1 rounded-full">
                Xin chào, {user.fullName.split(' ')[0]}
              </span>
              <h2
                className="mt-5 font-display font-bold text-ink tracking-tight leading-[1.1] text-balance"
                style={{
                  letterSpacing: '-0.035em',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                }}
              >
                Sẵn sàng khám phá các công cụ hôm nay?
              </h2>
              <p className="mt-6 text-ink-muted max-w-xl mx-auto leading-relaxed">
                So sánh giá, tìm học bổng và nhận đề xuất giá tốt nhất — tất cả trong
                một bảng điều khiển.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href={ROUTES.dashboard} className="btn-primary">
                  Mở Sản phẩm của tôi
                </Link>
                <Link href={ROUTES.tools} className="btn-ghost">
                  Xem tất cả công cụ
                </Link>
              </div>
            </>
          ) : (
            <>
              <h2
                className="font-display font-bold text-ink tracking-tight leading-[1.1] text-balance"
                style={{
                  letterSpacing: '-0.035em',
                  fontSize: 'clamp(2rem, 5vw, 3.5rem)',
                }}
              >
                Sẵn sàng tiết kiệm thời gian và tiền bạc?
              </h2>
              <p className="mt-6 text-ink-muted max-w-xl mx-auto leading-relaxed">
                Tham gia cùng ngay bây giờ. Để nhận các Tool liền tay.
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                <Link href={ROUTES.signup} className="btn-primary">
                  Tạo tài khoản miễn phí
                </Link>
                <Link href="#contact" className="btn-ghost">
                  Liên hệ hợp tác
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}