import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Se estiver no GitHub Actions, usa a subpasta. Se for Vercel ou Local, usa a raiz.
  base: process.env.GITHUB_ACTIONS ? "/MamaeAPP/" : "/",
})
