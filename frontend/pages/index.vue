<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <div class="input-wrapper">
              <input type="text" :placeholder="$t('search')" />
              <button class="search-button">
                <img
                  src="../public/icons/pokeball.svg"
                  alt="Pokeball"
                  class="pokeball-icon"
                  style="width: 20px; height: 20px"
                />
              </button>
            </div>
          </v-col>
        </v-row>

        <v-row class="filters mb-2">
          <v-col cols="12">
            <v-row justify="space-between" align="center" class="filters-row">
              <v-btn
                variant="text"
                class="ascending-btn"
                @click="toggleSortOrder"
              >
                <strong>{{
                  isAscending ? $t("ascending") : $t("descending")
                }}</strong>
                <v-icon class="ml-1" right>
                  {{ isAscending ? "mdi-arrow-up" : "mdi-arrow-down" }}
                </v-icon>
              </v-btn>

              <div class="range-filter">
                <span class="range-label">{{ $t("from") }}</span>
                <div class="input-filter-wrapper">
                  <input
                    type="number"
                    v-model="filters.from"
                    class="range-input"
                  />
                </div>

                <span class="range-label ml-2">{{ $t("to") }}</span>
                <div class="input-filter-wrapper">
                  <input
                    type="number"
                    v-model="filters.to"
                    class="range-input"
                  />
                </div>
              </div>
            </v-row>
          </v-col>

          <div class="custom-select">
            <div class="select-btn">
              <i class="mdi mdi-radio-tower mr-1" />
              <span>Type</span>
              <i class="mdi mdi-menu-down" />
            </div>
          </div>

          <div class="custom-select">
            <div class="select-btn">
              <i class="mdi mdi-shield-half-full mr-1" />
              <span>Weakness</span>
              <i class="mdi mdi-menu-down" />
            </div>
          </div>

          <div class="custom-select">
            <div class="select-btn">
              <i class="mdi mdi-dna mr-1" />
              <span>Ability</span>
              <i class="mdi mdi-menu-down" />
            </div>
          </div>

          <div class="custom-select">
            <div class="select-btn">
              <i class="mdi mdi-human-male-height mr-1" />
              <span>Height</span>
              <i class="mdi mdi-menu-down" />
            </div>
          </div>

          <div class="custom-select">
            <div class="select-btn">
              <i class="mdi mdi-weight mr-1" />
              <span>Weight</span>
              <i class="mdi mdi-menu-down" />
            </div>
          </div>

          <button class="reset-btn">
            <i class="mdi mdi-refresh" />
          </button>
        </v-row>

        <v-row class="scrollable-cards mb-6">
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
                  :src="getPokemonGif(pokemon.name)"
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
      </v-col>

      <v-col cols="4">
        <PokemonInfo v-if="selectedPokemon" :pokemon="selectedPokemon" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Pokedex",
  components: {
    PokemonInfo: () => import("~/components/PokemonInfo.vue"),
  },
  data() {
    return {
      pokemonList: [] as { name: string; types: string[]; sprite: string }[],
      selectedPokemon: null,
      isAscending: true,
      filters: {
        from: null,
        to: null,
      },
      showDropdown: {
        type: false,
        weakness: false,
        ability: false,
        height: false,
        weight: false,
      },
    };
  },
  created() {
    this.$store
      .fetchPokemons()
      .then(() => {
        this.pokemonList = this.$store.pokemons;
        this.selectPokemon(this.pokemonList[0]);
      })
      .catch((error: any) => {
        console.error("Erro ao buscar os Pokémons:", error);
      });
  },
  methods: {
    toggleDropdown(dropdown: string) {
      this.showDropdown[dropdown] = !this.showDropdown[dropdown];
    },
    resetFilters() {
      this.filters.from = null;
      this.filters.to = null;
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
    getPokemonGif(name: string) {
      const pokemonId = this.getPokemonIdFromName(name);
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/showdown/${pokemonId}.gif`;
    },
    getPokemonIdFromName(name: string) {
      const pokemon = this.pokemonList.find((evo) => evo.name === name);
      return pokemon ? pokemon.url.split("/")[6] : "";
    },
    capitalizeFirstLetter(name: string) {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    },
    formatId(id: number): string {
      return id.toString().padStart(4, "0");
    },
  },
});
</script>

<style scoped>
.filters-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: nowrap;
  width: 100%;
}

.custom-select {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 10px;
  max-width: 100%;
}

.select-btn {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding: 5px;
  background: white;
  border: 1px solid #e2e2e2;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: #333;
  transition: all 0.3s ease;
}

.select-btn i {
  font-size: 20px;
}

.select-btn:hover {
  background-color: #f5f5f5;
}

.range-input {
  width: 60px;
  border: 1px solid #e2e2e2;
  padding: 8px;
  border-radius: 12px;
  text-align: center;
  color: #333;
}

.reset-btn {
  background-color: #778B99;
  border-radius: 12px;
  padding: 5px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  font-size: 16px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.reset-btn:hover {
  background-color: #6d828f;
}

.range-input:focus {
  outline: none;
  border-color: #c2c2c2;
}

.filters-row .reset-btn {
  flex-shrink: 0;
}
</style>
