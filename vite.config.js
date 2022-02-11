import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {vueI18n} from "@intlify/vite-plugin-vue-i18n";
import path from 'path'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
//import { visualizer } from 'rollup-plugin-visualizer';
// https://vitejs.dev/config/
export default defineConfig({
  server: {host: true},
  build: {assetsDir: 'static'},
  plugins: [
    vue(),
    vueI18n({include: path.resolve(__dirname, './src/i18n/*.json')}),
    //visualizer({open: true, gzipSize: true, brotliSize: true, template: 'treemap'}),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "public": path.resolve(__dirname, "./public"),
    },
  },
})
