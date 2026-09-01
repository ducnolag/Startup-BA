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
        ink: {
          DEFAULT: '#0f172a', // primary
          muted: '#475569', // secondary
          subtle: '#94a3b8', // tertiary / hint
          inverse: '#ffffff', // on dark
        },
        // Brand — cyan accent (matches logo)
        brand: {
          DEFAULT: '#00a8d4', // primary brand action
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#00a8d4',
          600: '#008fb5',
          700: '#006c89',
          800: '#00556c',
          900: '#003e51',
        },
        navy: {
          DEFAULT: '#0a1a3a',
          50: '#eef2f8',
          100: '#d6deeb',
          500: '#1d4296',
          600: '#1c3878',
          700: '#142b5e',
          800: '#0e2148',
          900: '#0a1a3a',
        },
        // Borders / dividers
        line: {
          DEFAULT: '#e2e8f0',
          strong: '#cbd5e1',
          subtle: '#f1f5f9',
        },
        // Semantic
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444',
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