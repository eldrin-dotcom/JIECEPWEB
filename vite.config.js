import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        index: resolve(__dirname, 'index.html'),
        admin: resolve(__dirname, 'portaal/admin.html'),
        dashboard: resolve(__dirname, 'portal/dashboard.html'),
        library: resolve(__dirname, 'portal/library.html'),
        explore: resolve(__dirname, 'portal/explore.html'),
      }
    }
  }
})

