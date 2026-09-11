import { defineConfig, Plugin } from 'vite';
import { join } from 'path';
import vue from '@vitejs/plugin-vue';
import svgLoader from 'vite-svg-loader';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import Icons from 'unplugin-icons/vite';
import colors from 'tailwindcss/colors';

const htmlPlugin = (): Plugin => {
  return {
    name: 'html-transform',
    transformIndexHtml(html) {
      return html.replaceAll('{{themeColor}}', colors.gray[600]);
    },
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': join(__dirname, 'src'),
    },
  },
  plugins: [
    vue(),
    htmlPlugin(),
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
        start_url: '.',
        theme_color: colors.gray[600],
        display: 'standalone',
        background_color: '#cc6600',
      },
      workbox: {
        skipWaiting: true,
      },
      pwaAssets: {
        disabled: false,
        config: './pwa-assets.config.ts',
        injectThemeColor: true,
      },
    }),
  ],
});
