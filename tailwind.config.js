// eslint-disable-next-line @typescript-eslint/no-var-requires
const { colors } = require('tailwindcss/defaultTheme');
const { green, gray, blue, orange, white, transparent, current } = colors;

module.exports = {
  purge: false,
  theme: {
    colors: {
      green,
      gray,
      blue,
      orange,
      white,
      transparent,
      current,
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
  },
  variants: {},
  plugins: [],
};
