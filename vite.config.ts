import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      'stream': 'stream-browserify',
      'url': 'url-browserify'
    },
  },
  define: {
    'process.env': {},
    'global': 'globalThis',
  },
  optimizeDeps: {
    exclude: ['follow-redirects'],
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
    },
  },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
})
