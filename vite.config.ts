import { defineConfig } from 'vite';
import { join } from 'path';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    svgLoader(),
    Icons({
      compiler: 'vue3',
      defaultClass: 'inline-flex aspect-square w-[1em] fill-current',
      iconCustomizer(_collection, _icon, props) {
        props['aria-hidden'] = 'true';
        props.width = '1em';
        props.height = '1em';
      },
    }),
    VitePWA({
      injectRegister: null,
      manifest: {
        name: 'Pomodoro Timer',
        short_name: 'Pomodoro Timer',
        theme_color: '#ffffff',
        start_url: '.',
        display: 'standalone',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        skipWaiting: true,
      },
    }),
  ],
});
