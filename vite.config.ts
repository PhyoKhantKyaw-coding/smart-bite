import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
   optimizeDeps: {
    esbuildOptions: {
      // Add this for Vercel deployment
      platform: 'node',
    },
  },
  build: {
    // Ensure proper chunking for Vercel
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
