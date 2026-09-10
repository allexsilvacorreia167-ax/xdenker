import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        // Exclui o GeoJSON e os PNGs de estados do pré-cache automático (carregam sob demanda)
        globIgnores: ['**/*.geojson', '**/*-estado.png'],
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
      manifest: {
        name: 'XDENKER - Sua Opinião Importa | Eleições 2026',
        short_name: 'XDENKER',
        description: 'Plataforma de Pesquisa Eleitoral - XDENKER',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#1e293b',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/icon-512-maskable.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});