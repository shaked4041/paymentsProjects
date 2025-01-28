import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    },
  
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3002',
        ws: true, 
        changeOrigin: true,
      },
    },
  },
});
