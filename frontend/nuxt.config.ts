import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  css: [
    'vuetify/styles',
    '@mdi/font/css/materialdesignicons.css',
    '@/assets/styles/global.scss',
    'flag-icons/css/flag-icons.min.css',
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
    '@nuxtjs/i18n',
  ],
  i18n: {
    locales: [
      { code: 'en', iso: 'en-US', name: 'English' },
      { code: 'pt', iso: 'pt-BR', name: 'Português' },
    ],
    defaultLocale: 'en',
    strategy: 'no_prefix',
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: 'i18n_redirected',
      alwaysRedirect: true,
      fallbackLocale: 'en',
    },
    vueI18n: './i18n.config.ts',
  },
});
