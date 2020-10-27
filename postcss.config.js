/*eslint-disable */
const autoprefixer = require('autoprefixer');
const tailwindcss = require('tailwindcss');
const postcssPurgecss = require(`@fullhuman/postcss-purgecss`);
/* eslint-enable */

const purgecss = postcssPurgecss({
  content: ['./public/**/*.html', './src/**/*.vue', './src/**/*.ts'],
  defaultExtractor: (content) => content.match(/[\w-/:]+(?<!:)/g) || [],
  safelistPatterns: [
    /-(leave|enter|appear)(|-(to|from|active))$/,
    /^(?!(|.*?:)cursor-move).+-move$/,
    /^router-link(|-exact)-active$/,
    /^gap-([x-y]-|)\d+$/,
  ],
});

module.exports = {
  plugins: [
    tailwindcss,
    autoprefixer,
    ...(process.env.NODE_ENV === 'production' ? [purgecss] : []),
  ],
};
