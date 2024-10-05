import { defineStore } from 'pinia';
import axios from 'axios';

export const usePokemonStore = defineStore('pokemon', {
  state: () => ({
    pokemons: [] as any[],
    nextUrl: null as string | null,
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
      console.log(nextUrl)
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

        const flavorText = await this.fetchPokemonFlavorText(pokemonId);
    
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
          flavorText, 
        };
      } catch (error) {
        console.error('Erro ao buscar informações do Pokémon:', error);
        throw error;
      }
    },

    async fetchPokemonFlavorText(pokemonId: number): Promise<string> {
      try {
        const speciesResponse = await axios.get(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const speciesData = speciesResponse.data;
        const flavorTextEntry = speciesData.flavor_text_entries.find((entry: any) => entry.language.name === 'en');
        const cleanFlavorText = flavorTextEntry ? flavorTextEntry.flavor_text.replace(/\u000C|\u000B|\u000A|[\u25B2]/g, ' ') : 'No flavor text available';
        
        return cleanFlavorText;
      } catch (error) {
        console.error('Erro ao buscar o flavor text:', error);
        return 'No flavor text available';
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

      console.log(currentChain)

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
