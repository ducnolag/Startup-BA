# Toolify.vn — Landing Page

Nền tảng công cụ thông minh cho người Việt. Được xây dựng dựa trên `business-analysis.md` với **3D Scroll Animation** làm trải nghiệm cốt lõi.

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Tailwind CSS** (custom design tokens theo logo Toolify)
- **Framer Motion** — scroll animations, parallax, reveals
- **Lenis** — smooth scroll provider
- **React Three Fiber + Three.js + Drei** — 3D scenes (Hero)
- **Lucide Icons**

## Design Language

- **Color strategy:** Committed — navy + cyan gradient theo brand Toolify
- **Theme:** Dark base (`#030712`) — phù hợp 3D & premium feel
- **Typography:** Space Grotesk (display) + Inter (body), Vietnamese subset
- **Motion:** ease-out-quart/expo curves, không bounce, không elastic
- **Accessibility:** `prefers-reduced-motion` được tôn trọng

## Cấu trúc dự án

```
Startup-BA/
├── app/
│   ├── globals.css       # Design tokens, utilities
│   ├── layout.tsx        # Root layout + SmoothScrollProvider
│   └── page.tsx          # Home page composition
├── components/
│   ├── hero/
│   │   ├── Hero.tsx       # Hero content
│   │   └── Hero3D.tsx     # R3F scene (orbs, particles)
│   ├── layout/
│   │   ├── Navigation.tsx # Fixed nav với scroll behavior
│   │   └── Footer.tsx     # Footer với newsletter
│   ├── providers/
│   │   └── SmoothScrollProvider.tsx # Lenis init
│   └── sections/
│       ├── Tools.tsx      # 2 tool showcases với parallax
│       ├── Features.tsx   # 6-feature grid với parallax title
│       ├── Pricing.tsx    # Freemium + Premium + B2B
│       ├── Mission.tsx    # Impact stats + roadmap
│       └── CTA.tsx        # Final CTA section
├── lib/
│   └── utils.ts           # cn() helper
├── public/
├── tailwind.config.ts     # Brand colors, animations
└── package.json
```

## Cài đặt & chạy

```bash
# Cài đặt dependencies
npm install

# Dev server (hot reload)
npm run dev

# Production build
npm run build

# Serve production
npm start
```

Mở [http://localhost:3000](http://localhost:3000).

## Các section đã build

1. **Navigation** — fixed, scroll-aware background
2. **Hero** — 3D scene với 3 floating orbs (MeshDistortMaterial), particle field, animated content
3. **Tools** — 2 công cụ (Học bổng + So sánh giá), parallax scroll, mini-visuals
4. **Features** — 6 tính năng, grid background, parallax title
5. **Pricing** — 3 tiers (Free / Premium / B2B), monthly/yearly toggle
6. **Mission** — impact stats + 12-month roadmap
7. **CTA** — final call-to-action với glow
8. **Footer** — links + newsletter form

## Performance

- ✅ Static generation (SSG)
- ✅ Dynamic import cho 3D scene (tránh SSR)
- ✅ Reduced-motion fallback
- ✅ Vietnamese font subset
- ✅ Suspense boundary cho 3D

## Next Steps

- [ ] Tích hợp CMS cho pricing/features
- [ ] Auth flow thực (Supabase Auth)
- [ ] Dashboard cho 2 tool riêng
- [ ] Blog với MDX
- [ ] i18n (English version)
