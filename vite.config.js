import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true, // Membuka akses jaringan Wi-Fi (0.0.0.0)
    port: 5173,
    proxy: {
      '/storage': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/storage-file': {
        target: 'http://localhost:8000/api',
        changeOrigin: true,
      },
    },
  },
})
