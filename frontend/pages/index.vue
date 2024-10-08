<template>
  <v-container class="home-page">
    <v-row justify="center" class="header-section">
      <v-col cols="12" class="text-center">
        <h1 class="welcome-title">{{ $t("home.welcomeTitle") }}</h1>
        <p class="subtitle">{{ $t("home.subtitle") }}</p>
      </v-col>
    </v-row>

    <v-row justify="center" align="center" class="info-cards-section">
      <v-col cols="12" md="5" class="info-card">
        <v-card class="hover-card" outlined>
          <v-card-title class="card-title">{{
            $t("home.whatIsPokedexTitle")
          }}</v-card-title>
          <v-card-text class="card-text">{{
            $t("home.whatIsPokedexDescription")
          }}</v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="5" class="info-card">
        <v-card class="hover-card" outlined>
          <v-card-title class="card-title">{{
            $t("home.howToUsePokedexTitle")
          }}</v-card-title>
          <v-card-text class="card-text">{{
            $t("home.howToUsePokedexDescription")
          }}</v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        cols="12"
        md="3"
        v-for="pokemon in displayedPokemon"
        :key="pokemon.name"
        class="mt-4"
        @click="navigateToPokedex"
      >
        <PokemonCard :pokemon="pokemon" />
      </v-col>

      <v-col cols="12" class="text-center mt-4">
        <router-link to="/pokedex" class="styled-link mt-2">{{
          $t("see_more")
        }}</router-link>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from "vue";
import PokemonCard from "~/components/PokemonCard.vue";
import { usePokemonStore } from "~/store/Pokemon";

export default defineComponent({
  name: "Home",
  components: {
    PokemonCard,
  },
  setup() {
    const store = usePokemonStore();
    const pokemonList = ref<{ name: string; types: string[]; sprite: string }[]>([]);
    const displayedPokemon = ref<{ name: string; types: string[]; sprite: string }[]>([]);

    const fetchInitialPokemon = async () => {
      try {
        await store.fetchPokemons();
        pokemonList.value = store.pokemons;
        displayedPokemon.value = pokemonList.value.slice(0, 8);
      } catch (error) {
        console.error("Error fetching Pokémon:", error);
      }
    };

    const navigateToPokedex = () => {
      store.router.push("/pokedex");
    };

    onMounted(() => {
      fetchInitialPokemon();
    });

    return {
      pokemonList,
      displayedPokemon,
      fetchInitialPokemon,
      navigateToPokedex,
    };
  },
});
</script>

<style scoped>
.header-section {
  margin-bottom: 30px;
}

.welcome-title {
  font-size: 2.8rem;
  font-weight: bold;
  color: #ff5350;
}

.subtitle {
  font-size: 1.2rem;
  color: #555;
}

.info-cards-section {
  margin: 40px 0;
}

.info-card {
  margin: 10px;
}

.hover-card {
  border-radius: 12px;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}

.hover-card:hover {
  transform: translateY(-10px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.card-title {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  white-space: normal;
  word-wrap: break-word;
}

.card-text {
  color: #717987;
  font-size: 1rem;
}
</style>
