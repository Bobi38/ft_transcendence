import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'; // ou react si tu utilises React

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
      },
    },
  },
});
