/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#5B5BD6',
          accent: '#7C3AED',
          bg: '#0F172A',
          surface: '#1E293B',
          border: '#334155',
          muted: '#94A3B8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 24px 80px rgba(2, 6, 23, 0.32)',
        glow: '0 18px 42px rgba(91, 91, 214, 0.28)',
      },
    },
  },
  plugins: [],
}

