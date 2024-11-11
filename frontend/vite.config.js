import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/logout': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/client-login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/provider-login': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/client-signup': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
      '/provider-signup': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    },
  },
})

