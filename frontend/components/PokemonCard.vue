<template>
  <div class="pokemon-card">
    <div class="pokemon-img-wrapper">
      <img
        :src="getPokemonImage()"
        :alt="pokemon.name"
        class="pokemon-img"
      />
    </div>
    <div class="pokemon-info">
      <div class="pokemon-number">
        N°{{ formatId(pokemonId) }}
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
      <v-icon style="width: 15px; height: 15px">
        {{ isFavorited ? "mdi-heart" : "mdi-heart-outline" }}
      </v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed, ref, onMounted } from 'vue';

export default defineComponent({
  name: 'PokemonCard',
  props: {
    pokemon: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  setup(props) {
    const isFavorited = ref(false);
    const pokemonId = computed(() => props.pokemon.url.split('/')[6]);

    const getPokemonImage = () => {
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId.value}.png`;
    };

    const formatName = (name: string) => {
      return name
        .toLowerCase()
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    };

    const formatId = (id: number): string => {
      return id.toString().padStart(4, '0');
    };

    const checkFavoriteStatus = () => {
      const favorites = JSON.parse(localStorage.getItem('pokemonFavorites') || '[]');
      isFavorited.value = favorites.some(
        (favorite: { name: string; url: string }) =>
          favorite.name === props.pokemon.name && favorite.url === props.pokemon.url
      );
    };

    const toggleFavorite = () => {
      const favorites = JSON.parse(localStorage.getItem('pokemonFavorites') || '[]');

      if (isFavorited.value) {
        const index = favorites.findIndex(
          (favorite: { name: string; url: string }) =>
            favorite.name === props.pokemon.name && favorite.url === props.pokemon.url
        );
        if (index > -1) {
          favorites.splice(index, 1);
        }
      } else {
        favorites.push(props.pokemon);
      }

      localStorage.setItem('pokemonFavorites', JSON.stringify(favorites));
      isFavorited.value = !isFavorited.value;
    };

    onMounted(() => {
      checkFavoriteStatus();
    });

    return {
      isFavorited,
      pokemonId,
      getPokemonImage,
      formatName,
      formatId,
      toggleFavorite,
    };
  },
});
</script>