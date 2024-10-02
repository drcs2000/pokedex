<template>
  <v-card
    class="navbar"
  >
    <v-container class="navbar-container">
      <v-row justify="space-around" align="center">
        <v-col
          v-for="(item, index) in navItems"
          :key="index"
          class="d-flex justify-center"
          cols="auto"
        >
          <v-btn
            variant="text"
            :class="{'active-nav': index === activeIndex}"
          >
            <v-icon left>{{ item.icon }}</v-icon>
            <span :class="{'active-text': index === activeIndex}">{{ item.text }}</span>
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Navbar',
  data() {
    return {
      navItems: [
        { text: 'Home', icon: 'mdi-home' },
        { text: 'Pokedex', icon: 'mdi-pokedex' },
        { text: 'Videogames', icon: 'mdi-gamepad' },
        { text: 'GCC Pokemon', icon: 'mdi-cards-outline' },
        { text: 'TV Pokemon', icon: 'mdi-television' },
        { text: 'Play! Pokemon', icon: 'mdi-trophy' },
        { text: 'News', icon: 'mdi-newspaper' }
      ],
      activeIndex: 1
    };
  }
});
</script>

<style>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  max-width: 1200px;
  display: flex;
  justify-content: center;
  margin: 20px auto;
}

.navbar-container {
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.v-btn {
  color: #9e9e9e;
}

.v-btn.active-nav {
  color: red;
}

span {
  display: block;
  font-weight: 500;
  font-size: 14px;
  color: #9e9e9e;
}

span.active-text {
  color: red;
}
</style>
