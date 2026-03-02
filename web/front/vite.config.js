import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ou react si tu utilises React
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:9000', // ton backend Node
        changeOrigin: true,
        secure: false,
      },
      '/ws': { // si tu utilises WebSocket
        target: 'ws://localhost:9000',
        ws: true,
        changeOrigin: true,
      },
      '/game': {
        target: 'ws://localhost:9000',
        ws: true,
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      'FRONT': path.resolve(__dirname, './src'),
      'COMP': path.resolve(__dirname, './src/Component'),
      'BACK': path.resolve(__dirname, '/app/back/src'),
      'STYLE': path.resolve(__dirname, './src/style'),
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