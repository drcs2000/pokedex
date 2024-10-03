// stores/pokemon.ts
import { defineStore } from 'pinia';
import axios from 'axios';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as any[], // Lista de pokémons com detalhes
  }),

  actions: {
    async fetchPokemons() {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        const basicPokemons = response.data.results;

        const detailedPokemons = await Promise.all(
          basicPokemons.map(async (pokemon: { name: string; url: string }) => {
            const detailsResponse = await axios.get(pokemon.url);
            const details = detailsResponse.data;

            return {
              id: details.id,
              name: details.name,
              types: details.types.map((typeInfo: any) => typeInfo.type.name),
              sprite: details.sprites.other.showdown.front_default,
              details
            };
          })
        );

        this.pokemons = detailedPokemons;
      } catch (error) {
        console.error('Erro ao buscar os Pokémons:', error);
        throw error;
      }
    },
  },
});
