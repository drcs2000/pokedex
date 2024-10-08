<template>
  <v-container>
    <v-row v-if="pokemonList.length === 0">
      <v-col cols="12" class="text-center" align="center" justify="center">
        <v-img style="height: 25vh; width: auto" :src="loadingGif" />
        <h2>
          {{ $t("noFavoritesMessage.title") }}<br />
          {{ $t("noFavoritesMessage.subtitle") }}
        </h2>
        <router-link to="/pokedex" class="styled-link mt-2">{{
          $t("navbar.pokedex")
        }}</router-link>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <FilterSearch
              :reset-trigger="resetTrigger"
              @filter-searched="handleFilterSearched"
            />
          </v-col>
        </v-row>

        <v-row class="mb-2">
          <v-col cols="12">
            <v-row>
              <v-btn
                :class="{ 'active-sort': isAscending }"
                variant="text"
                class="ascending-btn"
                @click="toggleSortOrder"
              >
                <strong>{{
                  isAscending ? $t("ascending") : $t("descending")
                }}</strong>
                <v-icon class="ml-1" right>{{
                  isAscending ? "mdi-chevron-up" : "mdi-chevron-down"
                }}</v-icon>
              </v-btn>
            </v-row>
            <v-row class="scrollable-cards mb-6" ref="scrollableCards">
              <v-col
                cols="12"
                md="4"
                class="mt-5"
                v-for="pokemon in pokemonList"
                :key="pokemon.name"
                @click="selectPokemon(pokemon)"
              >
                <PokemonCard :pokemon="pokemon" />
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-col>

      <v-col cols="4">
        <transition name="fade-transition" mode="out-in">
          <PokemonInfo
            v-if="selectedPokemon"
            :key="selectedPokemon.id"
            :pokemon="selectedPokemon"
          />
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from "vue";
import loadingGif from "../assets/extra/loading.gif";
import PokemonInfo from "~/components/PokemonInfo.vue";
import PokemonCard from "~/components/PokemonCard.vue";
import { usePokemonStore } from "~/store/Pokemon";

export default defineComponent({
  name: "Favorites",
  components: {
    PokemonInfo,
    PokemonCard,
  },
  setup() {
    const store = usePokemonStore();
    const pokemonList = ref([]);
    const allPokemonList = ref([]);
    const selectedPokemon = ref(null);
    const isAscending = ref(true);
    const loading = ref(false);
    const resetTrigger = ref(false);
    const searchQuery = ref("");
    const scrollableCards = ref(null);
    const loadingGifSrc = ref(loadingGif);

    const fetchFavorites = () => {
      const favorites = JSON.parse(
        localStorage.getItem("pokemonFavorites") || "[]"
      );
      allPokemonList.value = favorites;
      pokemonList.value = favorites;
      if (pokemonList.value.length > 0) {
        selectPokemon(pokemonList.value[0]);
      }
    };

    const selectPokemon = async (pokemon) => {
      try {
        const data = await store.fetchPokemonInfo(pokemon.url.split("/")[6]);
        selectedPokemon.value = data;
      } catch (error) {
        console.error("Erro ao selecionar Pokémon:", error);
      }
    };

    const handleFilterSearched = (filterSearched) => {
      searchQuery.value = filterSearched.search;
      applySearchFilter();
    };

    const applySearchFilter = () => {
      const query = searchQuery.value.trim().toLowerCase();
      pokemonList.value = query
        ? allPokemonList.value.filter((pokemon) => {
            const pokemonId = getPokemonIdFromName(pokemon.name);
            return (
              pokemon.name.toLowerCase().includes(query) ||
              pokemonId.includes(query)
            );
          })
        : allPokemonList.value;
    };

    const getPokemonIdFromName = (name) => {
      const pokemon = allPokemonList.value.find((evo) => evo.name === name);
      return pokemon ? pokemon.url.split("/")[6] : "";
    };

    const toggleSortOrder = () => {
      isAscending.value = !isAscending.value;
      sortPokemonList();
    };

    const sortPokemonList = () => {
      pokemonList.value.sort((a, b) => {
        const idA = parseInt(getPokemonIdFromName(a.name), 10);
        const idB = parseInt(getPokemonIdFromName(b.name), 10);
        return isAscending.value ? idA - idB : idB - idA;
      });
    };

    onMounted(() => {
      fetchFavorites();
    });

    return {
      pokemonList,
      allPokemonList,
      selectedPokemon,
      isAscending,
      loading,
      resetTrigger,
      searchQuery,
      scrollableCards,
      loadingGifSrc,
      fetchFavorites,
      selectPokemon,
      handleFilterSearched,
      applySearchFilter,
      getPokemonIdFromName,
      toggleSortOrder,
      sortPokemonList,
    };
  },
});
</script>
