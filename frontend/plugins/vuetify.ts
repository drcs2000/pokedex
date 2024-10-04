// plugins/vuetify.ts

import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import { aliases, mdi } from 'vuetify/iconsets/mdi'
import { defineNuxtPlugin } from '#app'

export default defineNuxtPlugin((nuxtApp) => {
  const vuetify = createVuetify({
    ssr: true,
    components,
    directives,
    icons: {
      defaultSet: 'mdi',
      aliases,
      sets: {
        mdi,
      },
    },
    theme: {
      defaultTheme: 'myCustomTheme',
      themes: {
        myCustomTheme: {
          dark: false,
          colors: {
            background: '#F6F8FC'
          },
        },
      },
    },
  })

  nuxtApp.vueApp.use(vuetify)
})
