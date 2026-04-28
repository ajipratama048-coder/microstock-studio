import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'icon-180.png'],
      manifest: {
        name: 'Microstock Studio Calendar',
        short_name: 'MS Studio',
        description: 'Content calendar & checklist produksi microstock 2026',
        theme_color: '#141810',
        background_color: '#141810',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: 'icon-96.png',  sizes: '96x96',   type: 'image/png' },
          { src: 'icon-128.png', sizes: '128x128',  type: 'image/png' },
          { src: 'icon-144.png', sizes: '144x144',  type: 'image/png' },
          { src: 'icon-152.png', sizes: '152x152',  type: 'image/png' },
          { src: 'icon-192.png', sizes: '192x192',  type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512',  type: 'image/png', purpose: 'any maskable' },
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ]
})
