<template>
  <v-app id="app">
    <v-container>
        <NavBar />
        <v-main>
          <NuxtPage />
        </v-main>
    </v-container>
  </v-app>
</template>

<script>
export default {
  components: {
    NavBar: () => import('~/components/NavBar.vue')
  }
}
</script>

<style>
#app {
  background-image: url('../public/background/pokeball.svg');
  background-repeat: no-repeat;
  background-position: -15% -60%;
  background-size: 500px 500px;
  background-attachment: fixed;
}

.v-container {
  max-width: 1200px;
}
</style>