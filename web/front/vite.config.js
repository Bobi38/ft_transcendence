import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ou react si tu utilises React
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:9000', 
        changeOrigin: true,
        secure: false,
      },
    '/ws/chatG': {
      target: 'ws://localhost:9001', 
      ws: true,
      changeOrigin: true,
    },
    '/ws/chatP': {
      target: 'ws://localhost:9002', 
      ws: true,
      changeOrigin: true,
    },
    '/ws/morp': {
      target: 'ws://localhost:9004', 
      ws: true,
      changeOrigin: true,
    },
    '/ws/goat': {
      target: 'ws://localhost:2567',
      ws: true,
      changeOrigin: true,
    },
    },
  },
  resolve: {
    alias: {
      'FRONT': path.resolve(__dirname, './src'),
      'COMP': path.resolve(__dirname, './src/Component'),
      'HOOKS': path.resolve(__dirname, './src/hooks'),
      'STYLE': path.resolve(__dirname, './src/style'),
      'BACK': path.resolve(__dirname, '/app/back/src'),
      'MEDIA': path.resolve(__dirname, '/app/media'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Permet d'importer sans les ./ complexes
        includePaths: [path.resolve(__dirname, 'src/style')],
      },
    },
  },
});