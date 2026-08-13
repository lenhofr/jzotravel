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
          gold:       '#AD772D',
          'gold-dark':'#8F6224',
          // Gold text on navy needs more luminance than gold on white can use;
          // no single value clears 4.5:1 on both, so dark sections use this.
          'gold-light':'#C98C36',
        },
      },
    },
  },
  plugins: [],
}
