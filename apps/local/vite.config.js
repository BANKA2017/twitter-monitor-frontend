import {defineConfig} from 'vite'
const { resolve } = require('path')
import vue from '@vitejs/plugin-vue'
import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { VitePWA } from 'vite-plugin-pwa'
//import { visualizer } from 'rollup-plugin-visualizer';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: true,
    port: 3000,
  },
  root: resolve(__dirname, ''),
  publicDir: resolve(__dirname, 'public'),
  build: {
    assetsDir: 'static',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tmv1: resolve(__dirname, 'tmv1/index.html')
      }
    },
    outDir: resolve(__dirname, 'dist'),
  },
  plugins: [
    vue(),
    VueI18nPlugin({include: resolve(__dirname, '../../lib/i18n/*.json'), runtimeOnly: false,}),
    //visualizer({open: true, gzipSize: true, brotliSize: true, template: 'treemap'}),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
    VitePWA({
      includeAssets: ['favicon.ico'],
      registerType: "prompt",
      filename: 'service-worker.js',
      manifest: {
        name: "Twitter Monitor",
        short_name: "tmv2",
        start_url: '/',
        display: 'standalone',
        theme_color: "#ffffff",
        icons: [{
          src: "static/img/icon.png",
          sizes: "144x144",
          type: "image/png",
        }]
      },
      workbox: {
        runtimeCaching: [
          {
            urlPattern: /(.*?)\.(json)/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'not-cache-json',
            },
          },
          {
            urlPattern: /(.*?)\.(js|css|ts)/, // js /css /ts静态资源缓存
            handler: 'CacheFirst',
            options: {
              cacheName: 'js-css-cache',
            },
          },
          {
            urlPattern: /(.*?)\.(png|jpe?g|svg|gif|bmp|psd|tiff|tga|eps)/, // 图片缓存
            handler: 'CacheFirst',
            options: {
              cacheName: 'image-cache',
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "../../libs"),
      "public": resolve(__dirname, "../../public"),
    },
  },
})
