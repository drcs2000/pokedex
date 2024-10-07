<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <div class="input-wrapper mb-2">
              <input
                type="text"
                v-model="searchQuery"
                :placeholder="$t('search')"
                @input="applySearchFilter"
              />
            </div>
          </v-col>
        </v-row>

        <v-row class="mb-2">
          <v-col cols="12">
            <v-row>
              <FilterSelect
                v-for="item in filters.select"
                :key="item"
                :info="item"
                :resetTrigger="resetTrigger"
                @filter-updated="handleFilterUpdate"
              />

              <button class="reset-btn" @click="resetFilters">
                <i class="mdi mdi-refresh" />
              </button>
            </v-row>

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

        <v-col cols="12" v-if="loading">
          <v-btn block disabled>Loading...</v-btn>
        </v-col>
      </v-col>

      <v-col cols="4">
        <transition name="fade-transition">
          <PokemonInfo v-if="selectedPokemon" :key="selectedPokemon.id" :pokemon="selectedPokemon" />
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useInfiniteScroll } from "@vueuse/core";

export default defineComponent({
  name: "Pokedex",
  components: {
    PokemonInfo: () => import("~/components/PokemonInfo.vue"),
    FilterSelect: () => import("~/components/FilterSelect.vue"),
    PokemonCard: () => import("~/components/PokemonCard.vue"),
  },
  data() {
    return {
      pokemonList: [] as { name: string; types: string[]; sprite: string }[],
      allPokemonList: [] as { name: string; types: string[]; sprite: string }[],
      selectedPokemon: null,
      isAscending: true,
      searchQuery: "",
      filters: {
        select: ["type"],
        values: {} as Record<string, any[]>,
      },
      loading: false,
      selected: false,
      isFiltered: false,
      resetTrigger: false,
    };
  },
  created() {
    this.fetch();
  },
  mounted() {
    const scrollable = this.$refs.scrollableCards;
    useInfiniteScroll(scrollable, () => {
      if (!this.loading && !this.isFiltered) {
        this.loadMorePokemons();
      }
    });
  },
  methods: {
    fetch() {
      this.$store
        .fetchPokemons()
        .then(() => {
          this.allPokemonList = this.$store.pokemons;
          this.pokemonList = this.allPokemonList;
          this.nextUrl = this.$store.nextUrl;
          this.selectPokemon(this.pokemonList[0]);
        })
        .catch((error: any) => {
          console.error("Erro ao buscar os Pokémons:", error);
        });
    },
    resetFilters() {
      this.searchQuery = "";
      this.filters.values = {};
      this.$store.filteredPokemons = [];
      this.isFiltered = false;
      this.resetTrigger = !this.resetTrigger;
      this.fetch();
    },
    toggleSortOrder() {
      this.isAscending = !this.isAscending;
      this.sortPokemonList();
    },
    async selectPokemon(pokemon: any) {
      await this.$store
        .fetchPokemonInfo(pokemon.url.split("/")[6])
        .then((data) => {
          this.selectedPokemon = data;
        });
    },
    async loadMorePokemons() {
      if (!this.nextUrl || this.loading) return;

      this.loading = true;
      await this.$store.loadMorePokemons(this.nextUrl).then((response) => {
        this.allPokemonList = [...this.$store.pokemons];
        this.applySearchFilter();
        this.nextUrl = response.nextUrl;
      });
      this.loading = false;
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

      this.sortPokemonList();
    },
    handleFilterUpdate(filterUpdate: { type: string; values: any[] }) {
      this.filters.values[filterUpdate.type] = filterUpdate.values;
      if (this.filters.values[filterUpdate.type].length === 0) {
        this.isFiltered = false;
        this.fetch();
      } else {
        this.isFiltered = true;
        this.applyFilters();
      }
    },
    async applyFilters() {
      this.loading = true;
      try {
        if (Object.keys(this.filters.values).length === 0) {
          this.pokemonList = [];
        } else {
          await this.$store.fetchPokemonType(this.filters.values);
          this.pokemonList = this.$store.filteredPokemons;
          this.$store.pokemons = this.$store.filteredPokemons;
        }
      } catch (error) {
        console.error("Erro ao aplicar filtros:", error);
      } finally {
        this.loading = false;
      }
    },
    getPokemonIdFromName(name: string) {
      const pokemon = this.allPokemonList.find((evo) => evo.name === name);
      return pokemon ? pokemon.url.split("/")[6] : "";
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
