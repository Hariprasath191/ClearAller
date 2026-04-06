import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['85a2-106-195-40-178.ngrok-free.app', '.ngrok-free.app'],
  },
})
