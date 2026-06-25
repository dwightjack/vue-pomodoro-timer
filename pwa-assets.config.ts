import { defineConfig } from '@vite-pwa/assets-generator/config';

export default defineConfig({
  manifestIconsEntry: false,
  preset: {
    transparent: {
      sizes: [64, 192, 512],
      favicons: [[32, 'favicon.ico']],
    },
    maskable: {
      sizes: [512],
      resizeOptions: {
        background: '#CC6600',
      },
    },
    apple: {
      sizes: [180],
      resizeOptions: {
        background: '#CC6600',
      },
    },
  },
  images: ['public/icon.svg'],
});
