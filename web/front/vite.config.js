import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ou react si tu utilises React
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
  '/api': {
    target: 'http://gateway:9000',
    changeOrigin: true,
  },
  '/ws/chatG': {
    target: 'ws://chatg_service:9001',
    changeOrigin: true,
    ws: true,
  },
  '/ws/chatP': {
    target: 'ws://chatp_service:9002',
    changeOrigin: true,
    ws: true,
  },
  '/ws/friend': {
    target: 'ws://user_service:9003',
    changeOrigin: true,
    ws: true,
  },
  '/ws/morp': {
    target: 'ws://morp:9004',
    changeOrigin: true,
    ws: true,
  },
  '/ws/goat': {
    target: 'http://game:2567',
    changeOrigin: true,
    ws: true,
  },
}
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