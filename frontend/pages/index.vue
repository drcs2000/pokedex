<template>
  <v-container>
    <v-row>
      <v-col cols="8">
        <v-row>
          <v-col cols="12">
            <div class="input-wrapper">
              <input type="text" :placeholder="$t('search')" />
              <button class="search-button">
                <img
                  src="../public/icons/pokeball.svg"
                  alt="Pokeball"
                  class="pokeball-icon"
                  style="width: 20px; height: 20px"
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
            @click="selectPokemon(pokemon)"
          >
            <div class="pokemon-card">
              <div class="pokemon-img-wrapper">
                <img
                  :src="pokemon.sprite"
                  :alt="pokemon.name"
                  class="pokemon-img"
                />
              </div>
              <div class="pokemon-info">
                <div class="pokemon-number">N°{{ pokemon.id }}</div>
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

      <v-col cols="4">
        <v-card v-if="selectedPokemon" class="pokemon-info-card">
          <div class="pokemon-img-details-wrapper">
            <img
              :src="
                selectedPokemon.details.sprites.other.dream_world.front_default
              "
              alt="pokemon"
              class="pokemon-img-details"
            />
          </div>

          <div class="pokemon-detail-id">#{{ selectedPokemon.id }}</div>
          <div class="pokemon-detail-name">{{ selectedPokemon.name }}</div>

          <div class="pokemon-detail-types">
            <span
              v-for="type in selectedPokemon.types"
              :key="type"
              class="pokemon-type-badge"
              :style="{ backgroundColor: getTypeColor(type) }"
            >
              {{ type.toUpperCase() }}
            </span>
          </div>

          <v-row class="pokemon-stats">
            <v-col class="stat-block">
              <div class="stat-title">
                <span>{{ $t('abilities') }}</span>
              </div>
              <div class="info-list">
                <span
                  v-for="item in selectedPokemon.details.abilities"
                  :key="item.ability.name"
                  class="pokemon-abilities-badge"
                >
                  {{ item.ability.name.toUpperCase() }}
                </span>
              </div>
            </v-col>
          </v-row>

          <v-row class="pokemon-stats">
            <v-col cols="6" class="stat-block">
              <div class="stat-title">{{ $t('height') }}</div>
              <div class="stat-badge">
                {{ selectedPokemon.details.height / 10 }}m
              </div>
            </v-col>

            <v-col cols="6" class="stat-block">
              <div class="stat-title">{{ $t('weight') }}</div>
              <div class="stat-badge">
                {{ selectedPokemon.details.weight / 10 }}kg
              </div>
            </v-col>
          </v-row>

          <v-row class="pokemon-stats">
            <v-col cols="6" class="stat-block">
              <div class="stat-title">{{ $t('weaknesses') }}</div>
              <div class="stat-badge weaknesses-badge">
                <span class="mr-1"><strong>2x</strong></span>
                <v-img
                  v-for="item in selectedPokemon.weaknesses"
                  style="height: 15px; width: 15px"
                  :src="`/type-icons/${item.name}.svg`"
                />
              </div>
            </v-col>

            <v-col cols="6" class="stat-block">
              <div class="stat-title">{{ $t('base_exp') }}</div>
              <div class="stat-badge">
                {{ selectedPokemon.details.base_experience }}
              </div>
            </v-col>
          </v-row>

          <v-row class="pokemon-stats">
            <div class="stat-title">
              <span>{{ $t('stats') }}</span>
            </div>
            <v-col cols="12" class="stat-list">
              <div
                v-for="(stat, index) in selectedPokemon.details.stats"
                :key="index"
                class="stat-item"
                :style="{ backgroundColor: getStatColor(index) }"
              >
                <div class="stat-label">
                  {{ getStatLabel(index) }}
                </div>
                <div class="stat-value">{{ stat.base_stat }}</div>
              </div>
              <div class="stat-item total-stat">
                <div class="stat-label">{{ $t('total') }}</div>
                <div class="stat-value">{{ getTotalStats() }}</div>
              </div>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "Pokedex",
  data() {
    return {
      pokemonList: [] as { name: string; types: string[]; sprite: string }[],
      selectedPokemon: null,
      typeColors: {
        bug: "#A8B820",
        dark: "#705848",
        dragon: "#7038F8",
        electric: "#F8D030",
        fairy: "#EE99AC",
        fighting: "#C03028",
        fire: "#F08030",
        flying: "#A890F0",
        ghost: "#705898",
        grass: "#78C850",
        ground: "#E0C068",
        ice: "#98D8D8",
        normal: "#A8A878",
        poison: "#A040A0",
        psychic: "#F85888",
        rock: "#B8A038",
        steel: "#B8B8D0",
        water: "#6890F0",
      },
    };
  },
  mounted() {
    this.$store
      .fetchPokemons()
      .then(() => {
        this.pokemonList = this.$store.pokemons;
        this.selectedPokemon = this.pokemonList[0];
      })
      .catch((error: any) => {
        console.error("Erro ao buscar os Pokémons:", error);
      });
  },
  methods: {
    getTypeColor(type: string) {
      return this.typeColors[type] || "#A8A878";
    },
    selectPokemon(pokemon: any) {
      this.selectedPokemon = pokemon;
    },
    getStatLabel(index: number) {
      const labels = ["HP", "ATK", "DEF", "SpA", "SpD", "SPD"];
      return labels[index] || "";
    },
    getStatColor(index: number) {
      const colors = [
        "#ff5e57",
        "#f7b32b",
        "#f9c74f",
        "#4db7f9",
        "#43d1b0",
        "#fb82a8",
      ];
      return colors[index] || "#d3d3d3";
    },
    getTotalStats() {
      return this.selectedPokemon.details.stats.reduce(
        (total, stat) => total + stat.base_stat,
        0
      );
    },
  },
});
</script>

<style scoped>
.pokemon-info-card {
  background-color: #fff;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  text-align: center;
  font-family: "Arial", sans-serif;
  position: relative;
  overflow: visible;
  top: 120px;
  max-width: 100%;
}

.pokemon-img-details-wrapper {
  position: absolute;
  top: -120px;
  left: 50%;
  transform: translateX(-50%);
}

.pokemon-img-details {
  width: 180px;
  height: 180px;
}

.pokemon-detail-id {
  color: #9e9e9e;
  font-size: 16px;
  margin-top: 60px;
  font-weight: bold;
}

.pokemon-detail-name {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin: 5px 0;
}

.pokemon-detail-types {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.pokemon-abilities {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: 6px;
}

.pokemon-abilities span {
  font-size: 16px;
  color: black;
  font-weight: bold;
}

.info-list {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
}

.pokemon-abilities-badge {
  color: black;
  padding: 5px 20px;
  font-size: 12px;
  margin: 0 5px;
  font-weight: bold;
  border: 1px solid black;
  border-radius: 20px;
  background-color: #f5f7fc;
  flex: 1;
  text-align: center;
  box-sizing: border-box;
}

.stat-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 5px;
}

.stat-badge {
  background-color: #f5f7fc;
  border-radius: 20px;
  padding: 5px 20px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
  width: 100%;
}

.weaknesses-badge {
  display: flex;
  justify-content: flex-start;
  flex-wrap: nowrap;
  align-items: center;
}

/* Responsividade */
@media (max-width: 768px) {
  .pokemon-info-card {
    top: 80px;
    padding: 10px;
  }

  .pokemon-img-details {
    width: 150px;
    height: 150px;
  }

  .stat-title {
    font-size: 12px;
  }

  .stat-badge {
    font-size: 12px;
    padding: 5px 15px;
  }

  .pokemon-detail-name {
    font-size: 20px;
  }

  .pokemon-abilities-badge {
    padding: 5px 15px;
    font-size: 10px;
  }

  .stat-block {
    margin-bottom: 10px;
  }
}

@media (max-width: 480px) {
  .pokemon-info-card {
    width: 100%; /* Ajuste o tamanho para preencher a tela */
  }

  .pokemon-img-details {
    width: 120px;
    height: 120px;
  }

  .pokemon-detail-name {
    font-size: 18px;
  }

  .pokemon-abilities-badge {
    padding: 3px 10px;
    font-size: 10px;
  }

  .stat-title {
    font-size: 10px;
  }

  .stat-badge {
    font-size: 10px;
  }

  .stat-block {
    flex-basis: 100%;
    text-align: center;
  }

  .pokemon-stats {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
  }
}

.pokemon-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 10px;
}

.stat-list {
  display: flex;
  justify-content: space-between;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 10px;
  border-radius: 20px;
  background-color: #f5f7fc;
  width: 30px;
  height: 50px;
}

.stat-label {
  font-size: 10px;
  color: white;
  font-weight: bold;
}

.stat-value {
  font-size: 12px;
  font-weight: bold;
  color: black;
}

.total-stat {
  background-color: #b3d4fc;
}
</style>
