import Link from 'next/link';
import Image from 'next/image';

const footerLinks = {
  'Sản phẩm': [
    { label: 'Săn học bổng', href: '/tools/scholarship' },
    { label: 'So sánh giá', href: '/tools/price-compare' },
    { label: 'Bảng giá', href: '/#pricing' },
    { label: 'Câu chuyện', href: '/#mission' },
  ],
  'Tài nguyên': [
    { label: 'Trung tâm hỗ trợ', href: '#' },
    { label: 'Cộng đồng', href: '#' },
    { label: 'Trạng thái hệ thống', href: '#' },
  ],
  'Công ty': [
    { label: 'Về chúng tôi', href: '/#mission' },
    { label: 'Liên hệ', href: '#' },
  ],
  'Pháp lý': [
    { label: 'Điều khoản', href: '#' },
    { label: 'Bảo mật', href: '#' },
    { label: 'Cookies', href: '#' },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-surface-muted border-t border-line">
      <div className="container-page py-14 md:py-20">
        <div className="grid lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="lg:col-span-4">
            <Link href="/" className="flex items-center gap-2.5">
              <Image
                src="/logo.png"
                alt="Toolify.vn"
                width={40}
                height={40}
                className="w-10 h-10 object-contain"
              />
              <span className="font-display font-bold text-lg tracking-tight text-ink">
                Toolify<span className="text-brand">.vn</span>
              </span>
            </Link>
            <p className="mt-4 text-sm text-ink-muted leading-relaxed max-w-xs">
              Nền tảng công cụ thông minh cho mọi người, hỗ trợ giải quyết mọi vấn đề và nhiều hơn thế nữa.
            </p>
          </div>

          {/* Link columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <div className="text-sm font-semibold text-ink mb-4">{category}</div>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-sm text-ink-muted hover:text-ink transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-6 border-t border-line flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="text-sm text-ink-subtle">
            © 2026 Toolify.vn · Xây tại TP. Hà Nội
          </div>
          <div className="text-sm text-ink-subtle">
            Liên hệ: duchaiphong97@gmail.com
          </div>
        </div>
      </div>
    </footer>
  );
}