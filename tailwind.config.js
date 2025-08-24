/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'accent-blue': '#00A3FF',
        'accent-yellow': '#FFDE00',
        'dark-bg': '#050505',
      },
      fontFamily: {
        'space-grotesk': ['Space Grotesk', 'sans-serif'],
        'space-mono': ['Space Mono', 'monospace'],
      },
      animation: {
        'vertical-scroll': 'vertical-scroll 60s linear infinite',
        'pulse': 'pulse 4s infinite',
      },
      keyframes: {
        'vertical-scroll': {
          'from': { transform: 'translateY(0%)' },
          'to': { transform: 'translateY(-50%)' },
        }
      }
    },
  },
  plugins: [],
}
