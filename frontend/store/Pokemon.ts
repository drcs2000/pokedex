import { defineStore } from 'pinia';
import axios from 'axios';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as any[],
    nextUrl: null as string | null,
    filteredPokemons: [] as any[]
  }),

  actions: {
    async fetchPokemons() {
      try {
        const response = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=100');
        this.pokemons = response.data.results;
        this.nextUrl = response.data.next;
      } catch (error) {
        console.error('Erro ao buscar os Pokémons:', error);
        throw error;
      }
    },

    async loadMorePokemons(nextUrl: string) {
      try {
        const response = await axios.get(nextUrl);
        this.pokemons = [...this.pokemons, ...response.data.results];
        this.nextUrl = response.data.next;
        return { nextUrl: response.data.next };
      } catch (error) {
        console.error('Erro ao carregar mais Pokémons:', error);
        throw error;
      }
    },

    async fetchPokemonInfo(pokemonId: number) {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
        const details = response.data;
    
        const [weaknesses, evolutionChain] = await Promise.all([
          this.fetchPokemonWeaknesses(details.types.map((typeInfo: any) => typeInfo.type.name)),
          this.fetchPokemonEvolution(details.species.url)
        ]);
    
        return {
          id: this.formatId(details.id),
          name: details.name,
          types: details.types.map((typeInfo: any) => typeInfo.type.name),
          details,
          weaknesses,
          evolutionChain,
        };
      } catch (error) {
        console.error('Erro ao buscar informações do Pokémon:', error);
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

    async fetchPokemonType(filter: { type?: string[] }) {
      try {
        this.filteredPokemons = [];
        let pokemonSet = new Set();

        if (filter.type) {
          for (const type of filter.type) {
            const typeResponse = await axios.get(`https://pokeapi.co/api/v2/type/${type.toLowerCase()}`);
            const pokemonList = typeResponse.data.pokemon;

            for (const pokemonEntry of pokemonList) {
              if (!pokemonSet.has(pokemonEntry.pokemon.name)) {
                pokemonSet.add(pokemonEntry.pokemon.name);
                this.filteredPokemons.push(pokemonEntry.pokemon);
              }
            }
          }
        }
      } catch (error) {
        console.error('Erro ao filtrar Pokémon.', error);
        throw error;
      }
    },

    parseEvolutionChain(chain: any) {
      const evolutions = [];
      let currentChain = chain;

      while (currentChain) {
        const evolutionDetails = currentChain.evolution_details[0];
        evolutions.push({
          name: currentChain.species.name,
          url: currentChain.species.url,
          min_level: evolutionDetails ? evolutionDetails.min_level : 0 
        });
        currentChain = currentChain.evolves_to[0]; 
      }

      return evolutions;
    },

    formatId(id: number): string {
      return id.toString().padStart(4, '0');
    },
  },
});
