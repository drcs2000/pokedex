<template>
  <v-container>
    <v-row>
      <v-col>
        <v-row>
          <v-col cols="12">
            <FilterSearch :reset-trigger="resetTrigger" @filter-searched="handleFilterSearched" />
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
                <strong>{{ isAscending ? $t("ascending") : $t("descending") }}</strong>
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

      <!-- Move the ref to a direct HTML element that contains the PokemonInfo component -->
      <v-col cols="auto">
        <transition name="fade-transition" mode="out-in">
          <div ref="pokemonInfoSection"> <!-- Add ref here -->
            <PokemonInfo v-if="selectedPokemon" :key="selectedPokemon.id" :pokemon="selectedPokemon" />
          </div>
        </transition>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import { useInfiniteScroll } from '@vueuse/core';
import { usePokemonStore } from '~/store/Pokemon';

export default defineComponent({
  name: 'Pokedex',
  components: {
    PokemonInfo: () => import('~/components/PokemonInfo.vue'),
    FilterSelect: () => import('~/components/FilterSelect.vue'),
    FilterSearch: () => import('~/components/FilterSearch.vue'),
    PokemonCard: () => import('~/components/PokemonCard.vue'),
  },
  setup() {
    const store = usePokemonStore();
    const pokemonList = ref([]);
    const allPokemonList = ref([]);
    const selectedPokemon = ref(null);
    const isAscending = ref(true);
    const searchQuery = ref('');
    const loading = ref(false);
    const isFiltered = ref(false);
    const resetTrigger = ref(false);
    const filters = ref({ select: ['type'], values: {} });
    const scrollableCards = ref(null);
    const pokemonInfoSection = ref<HTMLElement | null>(null);

    const fetch = async () => {
      try {
        await store.fetchPokemons();
        allPokemonList.value = store.pokemons;
        pokemonList.value = allPokemonList.value;
        selectPokemon(pokemonList.value[0]);
      } catch (error) {
        console.error('Erro ao buscar os Pokémons:', error);
      }
    };

    const selectPokemon = async (pokemon) => {
      try {
        const data = await store.fetchPokemonInfo(pokemon.url.split('/')[6]);
        selectedPokemon.value = data;
        scrollToPokemonInfo();
      } catch (error) {
        console.error('Erro ao selecionar Pokémon:', error);
      }
    };

    const scrollToPokemonInfo = () => {
      if (pokemonInfoSection.value) {
        pokemonInfoSection.value.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    const resetFilters = () => {
      searchQuery.value = '';
      filters.value.values = {};
      store.filteredPokemons = [];
      isFiltered.value = false;
      resetTrigger.value = !resetTrigger.value;
      fetch();
    };

    const toggleSortOrder = () => {
      isAscending.value = !isAscending.value;
      sortPokemonList();
    };

    const loadMorePokemons = async () => {
      if (!store.nextUrl || loading.value) return;
      loading.value = true;
      try {
        await store.loadMorePokemons(store.nextUrl);
        allPokemonList.value = [...store.pokemons];
        applySearchFilter();
      } finally {
        loading.value = false;
      }
    };

    const applySearchFilter = () => {
      const query = searchQuery.value.trim().toLowerCase();
      pokemonList.value = query
        ? allPokemonList.value.filter((pokemon) => {
            const pokemonId = getPokemonIdFromName(pokemon.name);
            return pokemon.name.toLowerCase().includes(query) || pokemonId.includes(query);
          })
        : allPokemonList.value;
      sortPokemonList();
    };

    const handleFilterUpdate = (filterUpdate) => {
      filters.value.values[filterUpdate.type] = filterUpdate.values;
      if (!filters.value.values[filterUpdate.type].length) {
        isFiltered.value = false;
        fetch();
      } else {
        isFiltered.value = true;
        applySelectFilter();
      }
      sortPokemonList();
    };

    const applySelectFilter = async () => {
      loading.value = true;
      try {
        await store.fetchPokemonType(filters.value.values);
        pokemonList.value = store.filteredPokemons;
      } catch (error) {
        console.error('Erro ao aplicar filtros:', error);
      } finally {
        sortPokemonList();
        loading.value = false;
      }
    };

    const getPokemonIdFromName = (name) => {
      const pokemon = allPokemonList.value.find((evo) => evo.name === name);
      return pokemon ? pokemon.url.split('/')[6] : '';
    };

    const sortPokemonList = () => {
      pokemonList.value.sort((a, b) => {
        const idA = parseInt(getPokemonIdFromName(a.name), 10);
        const idB = parseInt(getPokemonIdFromName(b.name), 10);
        return isAscending.value ? idA - idB : idB - idA;
      });
    };

    onMounted(() => {
      fetch();
      useInfiniteScroll(
        scrollableCards,
        () => {
          if (!isFiltered.value) {
            loadMorePokemons();
          }
        }
      );
    });

    return {
      pokemonList,
      allPokemonList,
      selectedPokemon,
      isAscending,
      searchQuery,
      loading,
      isFiltered,
      resetTrigger,
      filters,
      scrollableCards,
      pokemonInfoSection,
      fetch,
      resetFilters,
      toggleSortOrder,
      selectPokemon,
      scrollToPokemonInfo,
      loadMorePokemons,
      applySearchFilter,
      handleFilterUpdate,
      applySelectFilter,
      getPokemonIdFromName,
      sortPokemonList,
    };
  },
});
</script>
