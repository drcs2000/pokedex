import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/styles/global.scss'
  ],
  build: {
    transpile: ['vuetify'],
  },
  typescript: {
    shim: false,
  },
  vite: {
    define: {
      'process.env.DEBUG': false,
    },
  },
})
