'use client';

import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const milestones = [
  {
    period: 'Tháng 1–3',
    title: 'MVP ra mắt',
    detail: '1.000 user đăng ký. 2 công cụ hoạt động ổn định. 20 user premium đầu tiên.',
    metric: '1–2 triệu',
    metricLabel: 'doanh thu/tháng (affiliate)',
  },
  {
    period: 'Tháng 4–6',
    title: 'Tăng trưởng organic',
    detail: '3.000 user, 100 premium. Cộng đồng 500+ trên Telegram.',
    metric: '5–10 triệu',
    metricLabel: 'doanh thu/tháng',
  },
  {
    period: 'Tháng 7–12',
    title: 'Mở rộng & ra mắt tool 3',
    detail: '10.000 user, 500 premium. Ra mắt công cụ thứ 3. B2B API pilot.',
    metric: '20–50 triệu',
    metricLabel: 'doanh thu/tháng',
  },
  {
    period: 'Năm 2',
    title: 'Mở rộng thị trường',
    detail: '30.000 user. Mở rộng Đông Nam Á. Tuyển cộng sự full-time.',
    metric: '80–150 triệu',
    metricLabel: 'doanh thu/tháng',
  },
];

const impactStats = [
  {
    value: '100',
    unit: 'suất',
    label: 'Học bổng được trao',
    detail: 'Nếu giúp 100 SV nhận học bổng trung bình 20 triệu/suất = 2 tỷ VNĐ giá trị giáo dục.',
    size: 'large',
    accent: '#00b8ef',
  },
  {
    value: '1 tỷ',
    unit: 'VNĐ',
    label: 'Tiết kiệm mỗi năm',
    detail: '5.000 user tiết kiệm TB 200k/tháng khi mua sắm thông minh.',
    size: 'medium',
    accent: '#0066cc',
  },
  {
    value: '2.35M',
    unit: 'SV',
    label: 'Đại học tại VN',
    detail: 'Thị trường mục tiêu — tăng 37% mỗi 5 năm.',
    size: 'medium',
    accent: '#5ee8ff',
  },
];

export default function Mission() {
  const sectionRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const impactRef = useRef<HTMLDivElement>(null);
  const roadmapRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        headerRef.current?.children ? Array.from(headerRef.current.children) : [],
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          scrollTrigger: { trigger: headerRef.current, start: 'top 75%' },
        }
      );

      const tiles = gsap.utils.toArray<HTMLElement>('.impact-tile');
      if (!tiles.length) return;
      gsap.fromTo(
        tiles,
        { opacity: 0, y: 40, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: impactRef.current, start: 'top 75%' },
        }
      );

      gsap.fromTo(
        roadmapRef.current?.children ? Array.from(roadmapRef.current.children) : [],
        { opacity: 0, x: -40 },
        {
          opacity: 1,
          x: 0,
          duration: 0.6,
          stagger: 0.1,
          scrollTrigger: { trigger: roadmapRef.current, start: 'top 75%' },
        }
      );
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      id="mission"
      className="relative py-32 md:py-48 bg-[#020409] overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/[0.02] to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div ref={headerRef} className="max-w-3xl mb-16">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-12 bg-cyan-500/50" />
            <span className="text-xs uppercase tracking-widest text-cyan-400 font-semibold">
              Câu chuyện & Tác động
            </span>
          </div>
          <h2
            className="font-display font-bold tracking-tight text-4xl md:text-5xl lg:text-6xl text-white"
            style={{ letterSpacing: '-0.03em' }}
          >
            Không phải phần mềm.
            <br />
            <span className="text-brand-gradient">Là một tác động.</span>
          </h2>
          <p className="mt-6 text-lg text-[#94a3b8] leading-relaxed max-w-2xl">
            Mỗi con số trên Toolify đều có thật. Học bổng giúp sinh viên đổi đời. Một
            quyết định mua sắm đúng — tiết kiệm được cả tháng tiền ăn.
          </p>
        </div>

        {/* Bento impact stats */}
        <div
          ref={impactRef}
          className="grid grid-cols-12 gap-4 mb-24 auto-rows-[220px]"
        >
          {/* First tile — large */}
          <div
            className={`impact-tile col-span-12 lg:col-span-7 row-span-2 rounded-3xl glass-border-glow p-8 md:p-10 relative overflow-hidden spotlight`}
          >
            <div className="absolute -top-32 -right-32 w-96 h-96 bg-cyan-500/15 rounded-full blur-[120px]" />
            <div className="relative h-full flex flex-col justify-between">
              <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">
                Tác động giáo dục
              </div>
              <div>
                <div className="font-display text-7xl md:text-8xl font-bold text-white">
                  100
                  <span className="text-2xl md:text-3xl text-[#94a3b8] ml-3 font-normal">
                    suất
                  </span>
                </div>
                <div className="mt-3 font-display text-2xl md:text-3xl font-semibold text-white">
                  Học bổng được trao
                </div>
                <p className="mt-4 text-[#94a3b8] leading-relaxed max-w-md">
                  {impactStats[0].detail}
                </p>
              </div>
            </div>
          </div>

          {/* Second tile */}
          <div className="impact-tile col-span-6 lg:col-span-5 rounded-3xl glass-navy p-6 md:p-8 relative overflow-hidden spotlight">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-[#0066cc]/20 rounded-full blur-[80px]" />
            <div className="relative h-full flex flex-col justify-between">
              <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">
                Tiết kiệm
              </div>
              <div>
                <div className="font-display text-5xl md:text-6xl font-bold text-white">
                  1 tỷ
                  <span className="text-xl text-[#94a3b8] ml-2 font-normal">VNĐ</span>
                </div>
                <div className="mt-2 font-display text-lg font-semibold text-white">
                  Tiết kiệm mỗi năm
                </div>
              </div>
            </div>
          </div>

          {/* Third tile */}
          <div className="impact-tile col-span-6 lg:col-span-5 rounded-3xl glass p-6 md:p-8 relative overflow-hidden spotlight">
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-cyan-500/20 rounded-full blur-[80px]" />
            <div className="relative h-full flex flex-col justify-between">
              <div className="text-xs text-cyan-400 uppercase tracking-wider font-medium">
                Thị trường
              </div>
              <div>
                <div className="font-display text-5xl md:text-6xl font-bold text-white">
                  2.35M
                  <span className="text-xl text-[#94a3b8] ml-2 font-normal">SV</span>
                </div>
                <div className="mt-2 font-display text-lg font-semibold text-white">
                  Đại học tại VN
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Roadmap */}
        <div className="mb-12">
          <h3
            className="font-display font-bold tracking-tight text-3xl md:text-4xl text-white"
            style={{ letterSpacing: '-0.03em' }}
          >
            Lộ trình 12 tháng
          </h3>
          <p className="mt-3 text-[#94a3b8] max-w-2xl">
            Kế hoạch thực tế, không hứa hẹn. Mỗi mốc đều có KPI rõ ràng để đo lường.
          </p>
        </div>

        <div ref={roadmapRef} className="space-y-3">
          {milestones.map((m) => (
            <div
              key={m.period}
              className="rounded-2xl glass-border-glow p-6 md:p-8 grid md:grid-cols-12 gap-6 hover:bg-white/[0.02] transition-colors group spotlight"
            >
              <div className="md:col-span-2">
                <div className="font-mono text-sm text-cyan-400 font-medium">
                  {m.period}
                </div>
              </div>
              <div className="md:col-span-5">
                <h4 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {m.title}
                </h4>
                <p className="text-[#94a3b8] leading-relaxed text-sm">{m.detail}</p>
              </div>
              <div className="md:col-span-5 md:text-right flex md:justify-end items-center">
                <div>
                  <div className="font-display text-2xl md:text-3xl font-bold text-cyan-400">
                    {m.metric}
                  </div>
                  <div className="text-xs text-[#64748b] mt-1">{m.metricLabel}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
