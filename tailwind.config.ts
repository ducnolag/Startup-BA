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
        // Background tones — deeper, more premium
        ink: {
          950: '#020409', // Deepest base
          900: '#060a16', // Section bg
          800: '#0a0f1f', // Card bg
          700: '#0f1525', // Elevated card
          600: '#161e35', // Hover surface
        },
        // Brand palette — matched to Toolify logo
        navy: {
          DEFAULT: '#0a1a3a', // Logo "T" + Toolify text
          950: '#050d22',
          900: '#0a1a3a',
          800: '#0e2148',
          700: '#142b5e',
          600: '#1c3878',
          500: '#1d4296',
        },
        cyan: {
          DEFAULT: '#00b8ef', // Logo "F" wing + accents
          50: '#e6fbff',
          100: '#ccf6ff',
          200: '#99edff',
          300: '#66e3ff',
          400: '#33daff',
          500: '#00b8ef',
          600: '#0099c9',
          700: '#007aa3',
          800: '#005c7d',
          900: '#003d57',
        },
        blue: {
          DEFAULT: '#0066cc', // Logo "F" body
          500: '#0066cc',
          600: '#0055aa',
          700: '#004488',
        },
        accent: {
          glow: '#5ee8ff', // Highlight glow
          electric: '#00d4ff',
          ice: '#d9faff',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'mesh-gradient':
          'radial-gradient(at 27% 37%, hsla(196, 100%, 50%, 0.18) 0px, transparent 50%), radial-gradient(at 97% 21%, hsla(212, 100%, 56%, 0.15) 0px, transparent 50%), radial-gradient(at 52% 99%, hsla(196, 100%, 50%, 0.12) 0px, transparent 50%)',
        'glass-gradient':
          'linear-gradient(135deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 3s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 8s ease infinite',
        marquee: 'marquee 30s linear infinite',
        shimmer: 'shimmer 3s linear infinite',
        'border-flow': 'border-flow 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'border-flow': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
