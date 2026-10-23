import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // relative paths so the build works at https://<user>.github.io/<repo>/
  base: './',
  server: {
    host: '127.0.0.1',
    port: 5173,
  },
})
