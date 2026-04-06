/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf7',
          100: '#d8f3ec',
          200: '#b3e6d8',
          300: '#82d3bf',
          400: '#4db79f',
          500: '#2b9c85',
          600: '#1f7f6d',
          700: '#1c6659',
          800: '#1a5248',
          900: '#17443c',
        },
        ocean: {
          50: '#eff7ff',
          100: '#dbeeff',
          200: '#b8deff',
          300: '#85c7ff',
          400: '#4aa7ff',
          500: '#1e86ff',
          600: '#0c67e6',
          700: '#0d52b8',
          800: '#114791',
          900: '#123c76',
        },
        surface: {
          1: 'rgb(var(--surface-1) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
          3: 'rgb(var(--surface-3) / <alpha-value>)',
        },
        ink: {
          1: 'rgb(var(--ink-1) / <alpha-value>)',
          2: 'rgb(var(--ink-2) / <alpha-value>)',
        },
        ring: 'rgb(var(--ring) / <alpha-value>)',
      },
      boxShadow: {
        soft: '0 12px 30px rgba(2, 44, 34, 0.10)',
        lift: '0 18px 40px rgba(12, 40, 80, 0.12)',
      },
      borderRadius: {
        '2xl': '1.25rem',
        '3xl': '1.75rem',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '100% 0' },
          '100%': { backgroundPosition: '0 0' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.2s ease-in-out infinite',
        floaty: 'floaty 3.5s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

