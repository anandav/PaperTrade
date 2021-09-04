const colors = require('tailwindcss/colors');
module.exports = {
  mode: 'jit',
  purge: [
    './index.html',
    'public/index.html',
    './src/**/*.vue',
    './src/**/*.js',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  darkMode: 'class', // or 'media' or 'class'
  theme: {
    colors: {
      // Build your palette here
      transparent: 'transparent',
      current: 'currentColor',
      gray: colors.blueGray,
      red: colors.red,
      blue: colors.sky,
      yellow: colors.amber,
      green : colors.green,
      white : colors.white,
      
    }
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
