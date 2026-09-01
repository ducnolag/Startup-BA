'use client';


const impact = [
  {
    value: '100',
    unit: 'suất',
    label: 'Học bổng được trao',
    detail: 'Nếu giúp 100 SV nhận học bổng trung bình 20 triệu/suất = 2 tỷ VNĐ giá trị giáo dục.',
  },
  {
    value: '1 tỷ',
    unit: 'VNĐ',
    label: 'Tiết kiệm mỗi năm',
    detail: '5.000 user tiết kiệm trung bình 200k/tháng khi mua sắm thông minh.',
  },
  {
    value: '2.35M',
    unit: 'SV',
    label: 'Đại học tại VN',
    detail: 'Thị trường mục tiêu — tăng 37% mỗi 5 năm.',
  },
];

export default function Mission() {
  return (
    <section id="mission" className="py-20 md:py-28 bg-white">
      <div className="container-page">
        <div data-anim className="max-w-2xl mb-12 md:mb-16">
          <div className="eyebrow mb-4">Câu chuyện & Tác động</div>
          <h2
            className="font-display font-bold text-ink tracking-tight text-3xl md:text-5xl leading-[1.1]"
            style={{ letterSpacing: '-0.03em' }}
          >
            Chúng tôi đem lại những tác động lớn.
          </h2>
        </div>

        <div data-anim className="grid md:grid-cols-12 gap-5 mb-16">
          <div className="md:col-span-7 card p-7 md:p-10">
            <div className="eyebrow mb-6">Tác động giáo dục</div>
            <div className="font-display text-6xl md:text-7xl font-bold text-ink leading-none">
              100
              <span className="text-2xl md:text-3xl text-ink-muted font-normal ml-2">
                suất
              </span>
            </div>
            <div className="mt-3 font-display text-xl md:text-2xl font-semibold text-ink">
              Học bổng được trao
            </div>
            <p className="mt-3 text-ink-muted leading-relaxed max-w-md">
              {impact[0].detail}
            </p>
          </div>

          <div className="md:col-span-5 flex flex-col gap-5">
            {impact.slice(1).map((s) => (
              <div key={s.label} data-anim className="card p-6 md:p-7">
                <div className="eyebrow mb-3">{s.label}</div>
                <div className="font-display text-4xl md:text-5xl font-bold text-ink leading-none">
                  {s.value}
                  <span className="text-lg text-ink-muted font-normal ml-2">
                    {s.unit}
                  </span>
                </div>
                <p className="mt-2 text-sm text-ink-muted leading-relaxed">
                  {s.detail}
                </p>
              </div>
            ))}
          </div>
        </div>
        <div className="space-y-3">
        </div>
      </div>
    </section>
  );
}