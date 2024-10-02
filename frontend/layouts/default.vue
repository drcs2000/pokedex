<template>
  <v-app>
    <NavBar />
    <v-main>
      <NuxtPage />
    </v-main>
  </v-app>
</template>

<script>
export default {
  components: {
    NavBar: () => import('~/components/NavBar.vue')
  }
}
</script>
