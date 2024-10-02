<template>
  <v-container>
    <v-card class="navbar">
      <v-row justify="space-around" align="center">
        <v-col
          v-for="(item, index) in navItems"
          :key="index"
          class="d-flex justify-center"
          cols="auto"
        >
          <v-btn
            class="nav-btn"
            variant="text"
            :class="{'active-nav': index === activeIndex}"
          >
            <v-icon class="nav-icon" left>{{ item.icon }}</v-icon>
            {{ item.text }}
          </v-btn>
        </v-col>
      </v-row>
    </v-card>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Navbar',
  data() {
    return {
      navItems: [
        { text: 'Home', icon: 'mdi-home' },
        { text: 'Pokedex', icon: 'mdi-pokeball' },
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

<style scoped>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 20px auto;
  height: 60px;
}

:deep .nav-btn {
  color: #717987;
  font-size: 10px;
  height: 60px;
  border-radius: 0%;
  font-weight: 1000;
}

:deep .v-btn.active-nav {
  color: red;
  border-bottom: 2px solid red;
  border-radius: 0%;
}

.nav-icon {
  font-size: 24px;
  margin-right: 6px;
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
