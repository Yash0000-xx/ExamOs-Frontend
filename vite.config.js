import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173, // Standardize your dev port
  },
  build: {
    outDir: 'dist',
    sourcemap: false, // Set to false to reduce build size and hide source code in production
  }
})