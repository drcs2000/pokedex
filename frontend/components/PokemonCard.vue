<template>
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
</template>

<script lang="ts">import { defineComponent } from "vue";

export default defineComponent({
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    getPokemonImage(name: string) {
      const pokemonId = this.getPokemonIdFromName(name);
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    },
    getPokemonIdFromName(name: string) {
      const pokemon = this.$store.pokemons.find((evo) => evo.name === name);
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
  }
})
</script>
