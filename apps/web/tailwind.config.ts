import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Surface — light backgrounds
        surface: {
          DEFAULT: '#ffffff', // page
          muted: '#f8fafc', // section alt
          subtle: '#f1f5f9', // cards / inset
          dark: '#0f172a', // inverse surface
        },
        // Ink — text hierarchy
        // Dùng rgb() + <alpha-value> để Tailwind opacity modifier (bg-ink/90,
        // text-ink/60, ...) hoạt động xuyên suốt design system.
        ink: {
          DEFAULT: 'rgb(15 23 42 / <alpha-value>)', // primary #0f172a
          muted: 'rgb(71 85 105 / <alpha-value>)', // secondary #475569
          subtle: 'rgb(148 163 184 / <alpha-value>)', // tertiary #94a3b8
          inverse: 'rgb(255 255 255 / <alpha-value>)', // on dark
        },
        // Brand — cyan accent (matches logo)
        // Đổi sang rgb()/hex + <alpha-value> để opacity modifier hoạt động.
        brand: {
          DEFAULT: 'rgb(0 168 212 / <alpha-value>)', // #00a8d4
          50: 'rgb(236 254 255 / <alpha-value>)',
          100: 'rgb(207 250 254 / <alpha-value>)',
          200: 'rgb(165 243 252 / <alpha-value>)',
          300: 'rgb(103 232 249 / <alpha-value>)',
          400: 'rgb(34 211 238 / <alpha-value>)',
          500: 'rgb(0 168 212 / <alpha-value>)',
          600: 'rgb(0 143 181 / <alpha-value>)',
          700: 'rgb(0 108 137 / <alpha-value>)',
          800: 'rgb(0 85 108 / <alpha-value>)',
          900: 'rgb(0 62 81 / <alpha-value>)',
        },
        navy: {
          DEFAULT: 'rgb(10 26 58 / <alpha-value>)',
          50: 'rgb(238 242 248 / <alpha-value>)',
          100: 'rgb(214 222 235 / <alpha-value>)',
          500: 'rgb(29 66 150 / <alpha-value>)',
          600: 'rgb(28 56 120 / <alpha-value>)',
          700: 'rgb(20 43 94 / <alpha-value>)',
          800: 'rgb(14 33 72 / <alpha-value>)',
          900: 'rgb(10 26 58 / <alpha-value>)',
        },
        // Borders / dividers
        line: {
          DEFAULT: 'rgb(226 232 240 / <alpha-value>)',
          strong: 'rgb(203 213 225 / <alpha-value>)',
          subtle: 'rgb(241 245 249 / <alpha-value>)',
        },
        // Semantic — cũng thêm alpha-value cho opacity modifier
        success: 'rgb(16 185 129 / <alpha-value>)',
        warning: 'rgb(245 158 11 / <alpha-value>)',
        danger: 'rgb(239 68 68 / <alpha-value>)',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(15,23,42,0.04), 0 1px 3px rgba(15,23,42,0.06)',
        'card-hover':
          '0 4px 12px rgba(15,23,42,0.06), 0 2px 4px rgba(15,23,42,0.04)',
        pop: '0 12px 32px rgba(15,23,42,0.08), 0 4px 8px rgba(15,23,42,0.04)',
        ring: '0 0 0 1px rgba(15,23,42,0.06)',
      },
      backgroundImage: {
        'soft-grid':
          'linear-gradient(rgba(15,23,42,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(15,23,42,0.05) 1px, transparent 1px)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        marquee: 'marquee 30s linear infinite',
        'fade-up': 'fade-up 0.6s ease-out both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;