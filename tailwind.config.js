/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        jzo: {
          navy:       '#0D1B2E',
          'navy-dark':'#08121F',
          gold:       '#C9A84C',
          'gold-dark':'#B5923C',
        },
      },
    },
  },
  plugins: [],
}
