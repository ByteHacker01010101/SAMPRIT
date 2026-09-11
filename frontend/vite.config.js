import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Deployment base path:
//   - Vercel / Netlify (deployed at root domain):  '/'  ← default
//   - GitHub Pages project site:                   '/SAMPRIT/'  (set via BASE_PATH env in CI)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: process.env.BASE_PATH || '/',
})
