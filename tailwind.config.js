// eslint-disable-next-line @typescript-eslint/no-var-requires
const { colors } = require('tailwindcss/defaultTheme');
const { green, gray, blue, orange, white, transparent, current } = colors;

module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue', './src/**/*.ts'],
    options: {
      defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
      whitelistPatterns: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/,
        /^gap-([x-y]-|)\d+$/,
      ],
    },
  },
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
