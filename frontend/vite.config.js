import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Repo name so GitHub Pages project site (…/SAMPRIT/) resolves asset paths correctly.
  // Change to '/' only if you deploy to a custom domain or a user/org site.
  base: '/SAMPRIT/',
})
