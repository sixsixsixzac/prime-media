import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@model': path.resolve(__dirname, './src/models'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
})
