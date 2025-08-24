import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  outDir: 'dist',
  sourcemap: true,
  server: {
    port: 3000,
    open: true
  },
  build: {
    rollupOptions: {
      input: {
        main: 'index.html'
      }
    }
  },
  publicDir: 'public'
})
