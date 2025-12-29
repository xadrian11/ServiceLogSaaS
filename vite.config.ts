
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY),
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
  },
  server: {
    port: 5173,
    host: true
  },
  preview: {
    port: Number(process.env.PORT) || 8080,
    host: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});
