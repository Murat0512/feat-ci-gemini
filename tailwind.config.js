
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        'shimmer': 'shimmer 12s linear infinite',
        'pulse-soft': 'pulse-soft 5s infinite cubic-bezier(0.4, 0, 0.6, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.8, transform: 'scale(1.02)' },
        }
      },
      backgroundImage: {
        '300%': 'linear-gradient(to right, #6366f1, #ffffff, #6366f1)',
      }
    },
  },
  plugins: [],
}
