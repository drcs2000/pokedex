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
        N°{{ formatId(pokemon.url.split("/")[6]) }}
      </div>
      <div class="pokemon-name">
        {{ formatName(pokemon.name) }}
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
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${
        this.pokemon.url.split("/")[6]
      }.png`;
    },
    formatName(name: string) {
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

      this.isFavorited = favorites.some(
        (favorite) =>
          favorite.name === this.pokemon.name &&
          favorite.url === this.pokemon.url
      );
    },
    toggleFavorite() {
      const favorites = JSON.parse(
        localStorage.getItem("pokemonFavorites") || "[]"
      );

      if (this.isFavorited) {
        const index = favorites.findIndex(
          (favorite) =>
            favorite.name === this.pokemon.name &&
            favorite.url === this.pokemon.url
        );
        if (index > -1) {
          favorites.splice(index, 1);
        }
      } else {
        favorites.push(this.pokemon);
      }

      localStorage.setItem("pokemonFavorites", JSON.stringify(favorites));
      this.isFavorited = !this.isFavorited;
    },
  },
});
</script>
