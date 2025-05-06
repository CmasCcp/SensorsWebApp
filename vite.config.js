import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  //base: "/SensorsWebApp",
  base: "/",
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000 // sube el límite a 1000 kB, por ejemplo
  }
})

