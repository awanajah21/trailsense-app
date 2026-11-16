import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // 1. "Botol Minum" (Polyfill): Menjaga library lawas agar tidak panik
  define: {
    'process.env': {}
  },

  // 2. "Headlamp" (Optimizer): Mengecualikan MapLibre agar Web Worker 3D berjalan mulus
  optimizeDeps: {
    exclude: ['maplibre-gl']
  }
})