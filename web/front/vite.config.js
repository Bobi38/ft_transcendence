import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: '0.0.0.0', allowedHosts: ['fcretin.ddns.net', '.42lyon.fr'],
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
    target: 'ws://morpion:9004',
    changeOrigin: true,
    ws: true,
  },
  '/ws/goat': {
    target: 'http://pong3d:2567',
    changeOrigin: true,
    ws: true,
    rewrite: (path) => path.replace(/^\/ws\/goat/, ''),
  },
}
  },
  resolve: {
    alias: {
      'FRONT': path.resolve(__dirname, './src'),
      'COMP': path.resolve(__dirname, './src/Component'),
      'HOOKS': path.resolve(__dirname, './src/hooks'),
      'STYLE': path.resolve(__dirname, './src/style'),
      'TOOL': path.resolve(__dirname, './tool'),
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