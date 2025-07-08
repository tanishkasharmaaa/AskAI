import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  base: './', // 👈 Important for relative paths on Vercel/static hosting
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: false, // Set to false to prevent auto-opening on every build
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  build: {
    chunkSizeWarningLimit: 800, 
    
  },
});
