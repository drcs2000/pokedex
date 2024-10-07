<template>
  <v-container>
    <v-row justify="center" align="center" class="align-navbar">
      <v-col>
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
                :class="{ 'active-nav': index === activeIndex }"
                @click="navigateTo(index)"
              >
                <v-icon class="nav-icon" left>{{ item.icon }}</v-icon>
                <span class="nav-text">{{ $t(item.text) }}</span>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>

      <v-col cols="auto" class="config-btn-col">
        <v-btn @click="toggleLanguage" class="language-btn">
          <img :src="getFlag(currentLang)" class="flag-icon mr-1" />
          <span>{{ currentLang }}</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

export default defineComponent({
  name: "Navbar",
  setup() {
    const route = useRoute();
    const router = useRouter();

    const navItems = [
      { text: "navbar.home", icon: "mdi-home", route: "/" },
      { text: "navbar.pokedex", icon: "mdi-pokeball", route: "/pokedex" },
      { text: "navbar.favorites", icon: "mdi-heart", route: "/favorites" },
    ];

    const currentLang = ref("En");
    const activeIndex = ref(0);

    const updateActiveIndex = () => {
      const currentRoute = route.path;
      activeIndex.value = navItems.findIndex(
        (item) => item.route === currentRoute
      );
    };

    const navigateTo = (index: number) => {
      activeIndex.value = index;
      router.push(navItems[index].route).catch((err) => {
        if (err.name !== "NavigationDuplicated") {
          console.error("Navigation error:", err);
        }
      });
    };

    watch(
      () => route.path,
      () => {
        updateActiveIndex();
      },
      { immediate: true }
    );

    onMounted(() => {
      updateActiveIndex();
    });

    return {
      navItems,
      currentLang,
      activeIndex,
      navigateTo,
      updateActiveIndex,
    };
  },
  watch: {
    $route() {
      this.updateActiveIndex();
    },
  },
  created() {
    this.updateActiveIndex();
  },
  methods: {
    toggleLanguage() {
      if (this.currentLang === "En") {
        this.$i18n.locale = "pt";
        this.currentLang = "Pt";
      } else {
        this.$i18n.locale = "en";
        this.currentLang = "En";
      }
    },
    getFlag() {
      return this.currentLang === "Pt"
        ? "https://flagcdn.com/h20/br.png"
        : "https://flagcdn.com/h20/us.png";
    },
  },
});
</script>

<style scoped>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  margin: 20px auto;
  height: 60px;
}

.nav-btn {
  color: #717987;
  font-size: 10px;
  height: 60px;
  border-radius: 0%;
  font-weight: 1000;
  align-items: center;
  display: flex;
}

.v-btn.active-nav {
  color: red;
  border-bottom: 2px solid red;
  border-radius: 0%;
}

.nav-icon {
  font-size: 24px;
  margin-right: 6px;
}

.nav-text {
  display: block;
  font-weight: bold;
  font-size: 14px;
  color: #9e9e9e;
}

.align-navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.config-btn-col {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.language-btn {
  display: flex;
  align-items: center;
  border-radius: 12px;
  cursor: pointer;
  padding: 10px;
  font-size: 16px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.flag-icon {
  font-size: 30px;
  max-width: 30px;
  height: auto;
}

@media (max-width: 700px) {
  .nav-text {
    display: none;
  }
  .nav-icon {
    margin-right: 0;
  }
}
</style>