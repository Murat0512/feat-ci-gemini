import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // This safely allows the app to reference process.env if needed
    'process.env': {}
  },
  server: {
    port: 5173,
    host: true
  }
});