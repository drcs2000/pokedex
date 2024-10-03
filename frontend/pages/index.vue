<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <div class="input-wrapper">
              <input type="text" placeholder="Search your Pokemon!" />
              <button class="search-button">
                <img
                  src="../public/icons/pokeball.svg"
                  alt="Pokeball"
                  class="pokeball-icon"
                  style="width: 20px; height: 20px;"
                />
              </button>
            </div>
          </v-col>
        </v-row>

        <v-row>
          <v-col
            cols="12"
            md="4"
            class="mt-5"
            v-for="pokemon in pokemonList"
            :key="pokemon.name"
          >
            <div class="pokemon-card">
              <div class="pokemon-img-wrapper">
                <img :src="pokemon.sprite" :alt="pokemon.name" class="pokemon-img" />
              </div>
              <div class="pokemon-info">
                <div class="pokemon-number">
                  N°{{ pokemon.id }}
                </div>
                <div class="pokemon-name">
                  {{ pokemon.name }}
                </div>
                <div class="pokemon-type">
                  <span
                    v-for="type in pokemon.types"
                    :key="type"
                    class="pokemon-type-badge"
                    :style="{ backgroundColor: getTypeColor(type) }"
                  >
                    {{ type.toUpperCase() }}
                  </span>
                </div>
              </div>
            </div>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
export default {
  name: 'Pokedex',
  data() {
    return {
      pokemonList: [] as { name: string; types: string[]; sprite: string }[],
      typeColors: {
        bug: '#A8B820',
        dark: '#705848',
        dragon: '#7038F8',
        electric: '#F8D030',
        fairy: '#EE99AC',
        fighting: '#C03028',
        fire: '#F08030',
        flying: '#A890F0',
        ghost: '#705898',
        grass: '#78C850',
        ground: '#E0C068',
        ice: '#98D8D8',
        normal: '#A8A878',
        poison: '#A040A0',
        psychic: '#F85888',
        rock: '#B8A038',
        steel: '#B8B8D0',
        water: '#6890F0',
      }
    };
  },
  mounted() {
    this.$store.fetchPokemons()
      .then(() => {
        this.pokemonList = this.$store.pokemons;
      })
      .catch((error: any) => {
        console.error('Erro ao buscar os Pokémons:', error);
      });
  },
  methods: {
    getTypeColor(type: string) {
      return this.typeColors[type] || '#A8A878'; // Cor padrão para tipos desconhecidos
    }
  }
};
</script>

<style scoped>
.pokemon-search-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.input-wrapper {
  position: relative;
}

.input-wrapper input {
  width: 100%;
  padding: 15px 60px 15px 20px;
  border-radius: 12px;
  background-color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  color: #8b8b8b;
  font-size: 15px;
}

.input-wrapper input::placeholder {
  color: #8b8b8b;
}

.search-button {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  border-radius: 12px;
  padding: 10px;
  cursor: pointer;
  height: 30px;
  width: 30px;
  box-shadow: 4px 4px 10px rgba(255, 0, 0, 0.697);
  background-color: #FF5350;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pokeball-icon {
  width: 24px;
  height: 24px;
}

.search-button img {
  display: block;
  width: 24px;
  height: 24px;
  color: white;
}

.pokemon-card {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: white;
  padding: 40px 20px 20px;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
  margin-bottom: 20px;
  transition: transform 0.3s ease;
}

.pokemon-card:hover {
  transform: translateY(-5px);
  cursor: pointer;
}

.pokemon-img-wrapper {
  position: absolute;
  top: -30px;
  padding: 5px;
}

.pokemon-img {
  width: 60px;
  height: 60px;
}

.pokemon-info {
  font-family: 'Arial', sans-serif;
  margin-top: 30px;
}

.pokemon-number {
  color: #9e9e9e;
  font-size: 14px;
}

.pokemon-name {
  font-size: 18px;
  font-weight: bold;
  margin: 5px 0;
  color: #333;
}

.pokemon-type {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pokemon-type-badge {
  color: white;
  padding: 5px 15px;
  border-radius: 5px;
  font-size: 12px;
  margin: 0 5px;
  font-weight: bold;
}
</style>
