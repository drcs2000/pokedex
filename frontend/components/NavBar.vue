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
        <v-btn variant="text" @click="toggleLanguage">
          <img :src="flagUrl" class="flag-icon mr-1" />
          <span>{{ currentLang }}</span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

export default defineComponent({
  name: "Navbar",
  setup() {
    const { locale, setLocale } = useI18n();
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
      activeIndex.value = navItems.findIndex((item) => item.route === currentRoute);
    };

    const flagUrl = computed(() => {
      return currentLang.value === "Pt"
        ? "https://flagcdn.com/h20/br.png"
        : "https://flagcdn.com/h20/us.png";
    });

    const toggleLanguage = () => {
      if (locale.value === "en") {
        setLocale("pt");
        currentLang.value = "Pt";
        localStorage.setItem("lang", "pt");
      } else {
        setLocale("en");
        currentLang.value = "En";
        localStorage.setItem("lang", "en");
      }
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
      const savedLang = localStorage.getItem("lang");
      if (savedLang) {
        setLocale(savedLang);
        currentLang.value = savedLang === "pt" ? "Pt" : "En";
      }
      updateActiveIndex();
    });

    return {
      navItems,
      currentLang,
      activeIndex,
      flagUrl,
      navigateTo,
      toggleLanguage,
    };
  },
});
</script>

<style scoped>
.navbar {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  height: 60px;
}

.nav-btn {
  color: #717987;
  font-size: 10px;
  height: 60px;
  border-radius: 0;
  font-weight: 1000;
  align-items: center;
  display: flex;
}

.v-btn.active-nav {
  color: red;
  border-bottom: 2px solid red;
  border-radius: 0;
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

@media (max-width: 700px) {
  .nav-icon {
    font-size: 20px;
    margin-right: 2px;
    justify-content: flex-start;
  }

  .nav-text {
    display: none;
  }

  .nav-btn {
    padding: 0 8px;
  }

  .flag-icon {
    font-size: 18px;
    max-width: 18px;
  }

  .config-btn-col span {
    display: none;
  }

  .navbar {
    gap: 0px;
  }

  .align-navbar {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
}
</style>
