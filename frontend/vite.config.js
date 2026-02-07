// frontend/vite.config.js - OPTIMIZED FOR PERFORMANCE
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8084',
        changeOrigin: true,
      },
    },
  },
  build: {
    // Optimize chunk size
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Manual chunking for better code splitting
        manualChunks: {
          // React core
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI Libraries (Core) - Removed plots from here
          'ui-vendor': ['antd', '@ant-design/icons', 'framer-motion'],
          // Charts and data visualization (Heavy - Load only when needed)
          'charts-vendor': ['recharts', '@ant-design/plots'],
          // Form and editor libraries
          'form-vendor': ['react-quill', '@tinymce/tinymce-react', 'react-select'],
          // Utility libraries
          'utils-vendor': ['axios', 'dayjs', 'styled-components'],
        },
        // Optimize asset file naming
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/\.css$/i.test(assetInfo.name)) {
            return 'assets/[name]-[hash][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        },
      },
    },
    // Minification (using esbuild - faster and no extra dependency)
    minify: 'esbuild',
    esbuildOptions: {
      drop: ['console', 'debugger'],
    },
    // CSS optimization
    cssCodeSplit: true,
    // Source maps (disable in production for smaller builds)
    sourcemap: false,
  },
  // Optimize dependencies pre-bundling
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'antd',
      '@ant-design/icons',
      'axios',
      'dayjs',
    ],
  },
})
