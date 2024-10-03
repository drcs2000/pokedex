import { defineStore } from 'pinia';
import axios from 'axios';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as any[],
    pokemonTypes: {} as any,
  }),

  actions: {
    async fetchPokemons() {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=10');
        const basicPokemons = response.data.results;

        const detailedPokemons = await Promise.all(
          basicPokemons.map(async (pokemon: { name: string; url: string }) => {
            const detailsResponse = await axios.get(pokemon.url);
            const details = detailsResponse.data;

            const [weaknesses, evolutionChain] = await Promise.all([
              this.fetchPokemonWeaknesses(details.types.map((typeInfo: any) => typeInfo.type.name)),
              this.fetchPokemonEvolution(details.species.url) 
            ]);

            return {
              id: this.formatId(details.id),
              name: this.capitalizeFirstLetter(details.name),
              types: details.types.map((typeInfo: any) => typeInfo.type.name),
              weaknesses, 
              evolutionChain, 
              sprite: details.sprites.other.showdown.front_default,
              details,
            };
          })
        );

        this.pokemons = detailedPokemons;
      } catch (error) {
        console.error('Erro ao buscar os Pokémons:', error);
        throw error;
      }
    },

    async fetchPokemonWeaknesses(types: string[]) {
      try {
        const weaknessesPromises = types.map(async (type: string) => {
          const response = await axios.get(`https://pokeapi.co/api/v2/type/${type}`);
          return response.data.damage_relations.double_damage_from;
        });

        const weaknesses = await Promise.all(weaknessesPromises);
        return weaknesses.flat();
      } catch (error) {
        console.error('Erro ao buscar fraquezas dos tipos:', error);
        throw error;
      }
    },

    async fetchPokemonEvolution(speciesUrl: string) {
      try {
        const speciesResponse = await axios.get(speciesUrl);
        const evolutionUrl = speciesResponse.data.evolution_chain.url;

        const evolutionResponse = await axios.get(evolutionUrl);
        const evolutionChain = this.parseEvolutionChain(evolutionResponse.data.chain);

        return evolutionChain;
      } catch (error) {
        console.error('Erro ao buscar a cadeia de evolução:', error);
        throw error;
      }
    },

    parseEvolutionChain(chain: any) {
      const evolutions = [];
      let currentChain = chain;

      while (currentChain) {
        evolutions.push({
          name: currentChain.species.name,
          url: currentChain.species.url
        });
        currentChain = currentChain.evolves_to[0]; 
      }

      return evolutions;
    },

    formatId(id: number): string {
      return id.toString().padStart(4, '0');
    },

    capitalizeFirstLetter(name: string): string {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    },
  },
});
