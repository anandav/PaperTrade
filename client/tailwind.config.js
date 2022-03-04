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

      // bluegray: colors.blueGray,
      coolgray: colors.gray,
      truegray: colors.neutral,
      warmgray: colors.stone,

      red: colors.red,
      
      yellow: colors.yellow,
      green: colors.green,
      white: colors.white,
      orange: colors.orange,
      cyan : colors.cyan,
      blue: colors.blue,
      //pink: colors.pink,

    },
    fontSize: {
      'xxs': '.6rem',
      'xs': '.75rem',
      'sm': '.875rem',
      'tiny': '.875rem',
      'base': '1rem',
      'lg': '1.125rem',
      'xl': '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
      '7xl': '5rem',
    },

    // borderWidth: {
    //   DEFAULT: '1px',
    //   '0': '0',
    //   '2': '2px',
    //   '3': '3px',
    //   '4': '4px',
    //   '6': '6px',
    //   '8': '8px',
    // }
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
