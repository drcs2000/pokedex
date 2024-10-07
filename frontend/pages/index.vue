<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <div class="input-wrapper mb-2">
              <input type="text" :placeholder="$t('search')" />
              <button class="search-button">
                <img
                  src="/icons/pokeball.svg"
                  alt="Pokeball"
                  style="width: 20px; height: 20px"
                />
              </button>
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
            <div class="pokemon-card">
              <div class="pokemon-img-wrapper">
                <img
                  :src="getPokemonImage(pokemon.name)"
                  :alt="pokemon.name"
                  class="pokemon-img"
                />
              </div>
              <div class="pokemon-info">
                <div class="pokemon-number">
                  N°{{ formatId(getPokemonIdFromName(pokemon.name)) }}
                </div>
                <div class="pokemon-name">
                  {{ capitalizeFirstLetter(pokemon.name) }}
                </div>
              </div>
            </div>
          </v-col>
        </v-row>

        <v-col cols="12" v-if="loading">
          <v-btn block disabled>Loading...</v-btn>
        </v-col>
      </v-col>

      <v-col cols="4">
        <PokemonInfo v-if="selectedPokemon" :pokemon="selectedPokemon" />
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
  },
  data() {
    return {
      pokemonList: [] as { name: string; types: string[]; sprite: string }[],
      selectedPokemon: null,
      isAscending: true,
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
      if (
        !this.loading &&
        !this.isFiltered
      ) {
        this.loadMorePokemons();
      }
    });
  },
  methods: {
    fetch() {
      this.$store
        .fetchPokemons()
        .then(() => {
          this.pokemonList = this.$store.pokemons;
          this.nextUrl = this.$store.nextUrl;
          this.selectPokemon(this.pokemonList[0]);
        })
        .catch((error: any) => {
          console.error("Erro ao buscar os Pokémons:", error);
        });
    },
    resetFilters() {
      this.filters.values = {};
      this.$store.filteredPokemons = [];
      this.isFiltered = false;
      this.resetTrigger = !this.resetTrigger;
      this.fetch();
    },
    toggleSortOrder() {
      this.isAscending = !this.isAscending;
    },
    async selectPokemon(pokemon: any) {
      await this.$store
        .fetchPokemonInfo(pokemon.url.split("/")[6])
        .then((data) => {
          this.selectedPokemon = data;
        });
    },
    async loadMorePokemons() {
      if (!this.nextUrl || this.loading || this.isFiltered) return;

      this.loading = true;
      await this.$store.loadMorePokemons(this.nextUrl).then((response) => {
        this.pokemonList = this.$store.pokemons;
        this.nextUrl = response.nextUrl;
      });
      this.loading = false;
    },
    getPokemonImage(name: string) {
      const pokemonId = this.getPokemonIdFromName(name);
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonId}.gif`;
    },
    getPokemonIdFromName(name: string) {
      const pokemon = this.pokemonList.find((evo) => evo.name === name);
      return pokemon ? pokemon.url.split("/")[6] : "";
    },
    capitalizeFirstLetter(name: string) {
      return name
        .toLowerCase()
        .split("-")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    },
    formatId(id: number): string {
      return id.toString().padStart(4, "0");
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
          this.sortPokemonList();
        }
      } catch (error) {
        console.error("Erro ao aplicar filtros:", error);
      } finally {
        this.loading = false;
      }
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
