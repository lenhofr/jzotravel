/** @type {import('tailwindcss').Config} */
const typography = require('@tailwindcss/typography')

module.exports = {
  // public/admin/index.html is scanned too: the CMS preview pane reuses the
  // site's compiled stylesheet, so any class used only there would otherwise
  // never be generated and the preview would render unstyled.
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}', './public/admin/index.html'],
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
  plugins: [typography],
}
