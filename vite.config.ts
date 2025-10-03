import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router': ['react-router-dom'],
          'maps': ['leaflet', 'react-leaflet'],
          'icons': ['lucide-react']
        }
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 3000,
    open: true
  },
  preview: {
    port: 3000,
    open: true
  }
})
