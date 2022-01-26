import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import {vueI18n} from "@intlify/vite-plugin-vue-i18n";
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  server: {host: true},
  plugins: [vue(), vueI18n({include: path.resolve(__dirname, './src/i18n/*.json')})],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "public": path.resolve(__dirname, "./public"),
    },
  },
})
