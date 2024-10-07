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
            <v-row class="mt-6">
              <v-btn
                :class="{ 'active-sort': isAscending }"
                variant="text"
                class="ascending-btn"
                @click="toggleSortOrder"
              >
                <strong>{{
                  isAscending ? $t("ascending") : $t("descending")
                }}</strong>
                <v-icon class="ml-1" right>
                  {{ isAscending ? "mdi-chevron-up" : "mdi-chevron-down" }}
                </v-icon>
              </v-btn>
            </v-row>
          </v-col>
        </v-row>

        <v-row>
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
        </v-row>
      </v-col>

      <v-col cols="4">
        <transition name="fade-transition">
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
import { defineComponent } from "vue";
import { useInfiniteScroll } from "@vueuse/core";
import loadingGif from "../assets/extra/loading.gif";

export default defineComponent({
  name: "Pokedex",
  components: {
    PokemonInfo: () => import("~/components/PokemonInfo.vue"),
    PokemonCard: () => import("~/components/PokemonCard.vue"),
  },
  data() {
    return {
      pokemonList: [] as { name: string; types: string[]; sprite: string }[],
      allPokemonList: [] as { name: string; types: string[]; sprite: string }[],
      selectedPokemon: null,
      isAscending: true,
      loading: false,
      resetTrigger: false,
      loadingGif,
    };
  },
  created() {
    if (typeof window !== "undefined") {
      this.allPokemonList = JSON.parse(
        localStorage.getItem("pokemonFavorites") || "[]"
      );
      this.pokemonList = this.allPokemonList;
      this.pokemonList.length > 0
        ? this.selectPokemon(this.pokemonList[0])
        : "";
    }
  },
  methods: {
    async selectPokemon(pokemon: any) {
      await this.$store
        .fetchPokemonInfo(pokemon?.url.split("/")[6])
        .then((data) => {
          this.selectedPokemon = data;
        });
    },
    handleFilterSearched(filterSearched: { search: string }) {
      this.searchQuery = filterSearched.search;
      this.applySearchFilter();
    },
    applySearchFilter() {
      const query = this.searchQuery.trim().toLowerCase();

      if (query) {
        this.pokemonList = this.allPokemonList.filter((pokemon) => {
          const pokemonId = this.getPokemonIdFromName(pokemon.name);
          return (
            pokemon.name.toLowerCase().includes(query) ||
            pokemonId.includes(query)
          );
        });
      } else {
        this.pokemonList = this.allPokemonList;
      }
    },
    getPokemonIdFromName(name: string) {
      const pokemon = JSON.parse(localStorage.getItem("pokemonFavorites")).find(
        (evo) => evo.name === name
      );
      return pokemon ? pokemon.url.split("/")[6] : "";
    },
    toggleSortOrder() {
      this.isAscending = !this.isAscending;
      this.sortPokemonList();
    },
    sortPokemonList() {
      this.pokemonList = this.pokemonList.sort((a, b) => {
        const idA = parseInt(this.getPokemonIdFromName(a.name), 10);
        const idB = parseInt(this.getPokemonIdFromName(b.name), 10);
        return this.isAscending ? idA - idB : idB - idA;
      });
    },
  },
});
</script>

<style scoped>
.styled-link {
  display: inline-block;
  background-color: #ff5350;
  color: white;
  padding: 10px 15px;
  text-decoration: none;
  border-radius: 8px;
  font-weight: bold;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.styled-link:hover {
  background-color: #ff3330;
}

.styled-link:active {
  background-color: #e62926;
}
</style>
