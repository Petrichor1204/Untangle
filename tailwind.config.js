/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx,mdx}",
    "./components/**/*.{js,jsx,ts,tsx,mdx}",
    "./lib/**/*.{js,jsx,ts,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'display': ['"Cormorant Garamond"', 'Georgia', 'serif'],
        'body':    ['Nunito', 'system-ui', 'sans-serif'],
        'brand':   ['"Dancing Script"', 'cursive'],
      },
      colors: {
        // Caramel · coffee · shea butter
        warm: {
          50:  '#fdfaf5',
          100: '#f8f0e0',
          200: '#f0dfc4',
          300: '#e5c99a',
          400: '#d4a86a',
          500: '#c08840',   // golden caramel
          600: '#a06d2e',   // coffee caramel
          700: '#7a4f20',   // rich coffee
          800: '#523318',   // dark coffee
          900: '#2e1c0a',   // espresso
        },
        // Lavender · coconut · soft purple
        lav: {
          50:  '#f7f5fc',
          100: '#eeeaf8',
          200: '#dcd4f2',
          300: '#c3b8e8',
          400: '#a796d8',   // soft lavender
          500: '#8b74c8',   // lavender
          600: '#7260b2',
          700: '#584890',
          800: '#3c3166',
          900: '#221c3a',
        },
      },
      boxShadow: {
        'warm':    '0 4px 24px rgba(160, 109, 46, 0.10)',
        'warm-md': '0 6px 32px rgba(160, 109, 46, 0.14)',
        'warm-lg': '0 8px 48px rgba(160, 109, 46, 0.18)',
      },
    },
  },
  plugins: [],
}
