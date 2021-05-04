module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    container: {
      center: true,
      padding: '1rem',
    },
    fill: (theme) => ({
      white: theme('colors.white'),
    }),
    extend: {
      flex: {
        5: '0 0 1.25rem',
      },
      borderWidth: {
        1: '1px',
      },
      colors: {
        blue: {
          100: '#0072ff',
          200: '#3b93ff',
          300: '#e7f1ff',
        },
        green: {
          100: '#3ddf22',
          200: '#4adb32',
        },
        orange: {
          100: '#ff8400',
          200: '#ffc53b',
        },
        black: {
          DEFAULT: '#34373c',
        },
        gray: {
          100: '#f4f7ff',
          200: '#aab3ca',
        },
      },
    },
  },
  variants: {
    extend: {
      fill: ['hover', 'focus'],
    },
  },
  plugins: [require('tailwindcss-important')],
}
