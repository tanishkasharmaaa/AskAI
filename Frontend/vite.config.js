import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html', // opens after build
      open: true, // open the report automatically after build
      gzipSize: true,
      brotliSize: true
    }),
  ],
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react-markdown')) return 'markdown';
            if (id.includes('@chakra-ui')) return 'chakra';
            if (id.includes('react')) return 'react';
            return 'vendor';
          }
        }
      }
    }
  }
});
