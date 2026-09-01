'use client';

const features = [
  {
    title: 'Nhanh',
    description: 'Tra cứu trong tích tắc. Tối ưu cho cả mobile và desktop.',
  },
  {
    title: 'An toàn',
    description: 'Không bán dữ liệu. Không tracking bên thứ ba.',
  },
  {
    title: 'Cảnh báo thông minh',
    description: 'Telegram, email hoặc web push — chọn kênh bạn thích.',
  },
  {
    title: 'Dữ liệu xác thực',
    description: 'Lịch sử giá từ API chính thức. Mỗi con số đều có nguồn.',
  },
  {
    title: 'Cộng đồng đóng góp',
    description: 'Review sản phẩm, chia sẻ mẹo săn sale và đánh giá sản phẩm.',
  },
  {
    title: 'Mở rộng liên tục',
    description: 'Chúng tôi sẽ cố gắng ra mắt các tool mới. Điều đó sẽ được lấy ý kiến từ mọi người.',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-20 md:py-28 bg-white">
      <div className="container-page">
        <div data-anim className="max-w-2xl mb-12 md:mb-16">
          <div className="eyebrow mb-4">Vì sao chọn Toolify</div>
          <h2
            className="font-display font-bold text-ink tracking-tight text-3xl md:text-5xl leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Các sản phẩm cần thiết và thiết thực
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              data-anim
              data-anim-delay={String(i * 0.06)}
              className="card card-hover p-7 md:p-8"
            >
              <div className="text-xs font-semibold tracking-wider text-ink-subtle mb-3">
                0{i + 1}
              </div>
              <h3 className="font-display font-semibold text-xl text-ink mb-2">
                {f.title}
              </h3>
              <p className="text-sm text-ink-muted leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>


      </div>
    </section>
  );
}