import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'prompt',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /\/api\/lovi\/featured/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-featured',
              networkTimeoutSeconds: 5,
              cacheableResponse: { statuses: [0, 200] }
            }
          },
          {
            urlPattern: /\/api\/auth\/my-bookings/,
            handler: 'NetworkOnly'
          }
        ],
        navigateFallback: '/offline.html'
      },
      manifest: {
        name: 'Lovi — горящие окошки',
        short_name: 'Lovi',
        description: 'Премиум SPA и массаж со скидкой прямо сейчас',
        theme_color: '#121A12',
        background_color: '#FDFCF9',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
