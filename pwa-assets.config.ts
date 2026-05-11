import { defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  manifestIconsEntry: false,
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[48, 'favicon.ico']],
    },
    maskable: {
      sizes: [512],
      padding: 0,
      resizeOptions: {
        background: '#CC6600',
      },
    },
    apple: {
      sizes: [180],
      padding: 0,
      resizeOptions: {
        background: { r: 0, g: 0, b: 0, alpha: 0 },
      },
    },
  },
  images: ['public/icon.svg'],
});
