function range(length = 1, from = 0, prefix) {
  return Array.from({ length }, (_, i) =>
    prefix ? `${prefix}${from + i}` : from + i,
  );
}

module.exports = {
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue', './src/**/*.ts'],
    safelist: [
      ...range(10, 0, 'gap-'),
      ...range(10, 0, 'gap-x-'),
      ...range(10, 0, 'gap-y-'),
    ],
  },
  extends: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
    },
  },
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
  },
};
