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
    <v-btn
      icon
      variant="text"
      color="#ff5350"
      style="width: 15px; height: 15px"
      :class="{ favorited: isFavorited }"
      @click.stop="toggleFavorite"
    >
      <v-icon style="width: 15px; height: 15px">{{
        isFavorited ? "mdi-heart" : "mdi-heart-outline"
      }}</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PokemonCard",
  props: {
    pokemon: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  data() {
    return {
      isFavorited: false,
    };
  },
  created() {
    this.checkFavoriteStatus();
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
    checkFavoriteStatus() {
      const favorites = JSON.parse(
        localStorage.getItem("pokemonFavorites") || "[]"
      );
      this.isFavorited = favorites.includes(this.pokemon.name);
    },
    toggleFavorite() {
      const favorites = JSON.parse(
        localStorage.getItem("pokemonFavorites") || "[]"
      );
      if (this.isFavorited) {
        // Remove from favorites
        const index = favorites.indexOf(this.pokemon.name);
        if (index > -1) {
          favorites.splice(index, 1);
        }
      } else {
        // Add to favorites
        favorites.push(this.pokemon.name);
      }
      localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
      this.isFavorited = !this.isFavorited;
    },
  },
});
</script>
