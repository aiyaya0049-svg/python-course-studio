import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  // Keep a release-specific asset path so an older offline build cached by a
  // browser cannot be reused after the course package is rebuilt.
  build: {
    assetsDir: 'course-assets-v2',
  },
})
