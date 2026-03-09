/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'body':    ['Nunito', 'system-ui', 'sans-serif'],
        'brand':   ['"Dancing Script"', 'cursive'],
        'impact':  ['Impact', 'Haettenschweiler', 'Arial Narrow Bold', 'sans-serif'],
      },
      colors: {
        petal: {
          50:  '#fff8f5',
          100: '#ffe8ee',
          200: '#ffd0dc',
          300: '#f4a7b9',
          400: '#e8789a',
          500: '#d4607f',
          600: '#c04567',
          700: '#a33354',
          800: '#7a2d45',
          900: '#5c1f33',
        },
      },
      boxShadow: {
        'petal':    '0 4px 24px rgba(232, 120, 154, 0.10)',
        'petal-md': '0 6px 32px rgba(232, 120, 154, 0.15)',
        'petal-lg': '0 8px 40px rgba(232, 120, 154, 0.20)',
      },
    },
  },
  plugins: [],
}
