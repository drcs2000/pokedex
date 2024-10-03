export default defineNuxtConfig({
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/styles/global.scss',
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
  modules: [
    '@pinia/nuxt',
  ],
  plugins: ['~/plugins/pinia-accessor.ts'],
});
