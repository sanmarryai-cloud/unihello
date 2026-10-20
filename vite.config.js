import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [vue()],
  // Relative base so GitHub Pages project sites (…/unihello/) resolve assets.
  base: './',
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
