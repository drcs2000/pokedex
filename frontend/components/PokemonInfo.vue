<template>
  <div class="sticky-container">
    <v-card class="pokemon-info-card">
      <div class="pokemon-img-details-wrapper">
        <img
          :src="pokemon.details.sprites.other.dream_world.front_default"
          alt="pokemon"
          class="pokemon-img-details"
        />
      </div>

      <div class="pokemon-detail-id">#{{ pokemon.id }}</div>
      <div class="pokemon-detail-name">
        {{ capitalizeFirstLetter(pokemon.name) }}
      </div>

      <div class="pokemon-detail-types">
        <span
          v-for="type in pokemon.types"
          :key="type"
          class="pokemon-type-badge"
          :style="{ backgroundColor: getTypeColor(type) }"
        >
          {{ type.toUpperCase() }}
        </span>
      </div>

      <v-row class="pokemon-stats mt-2">
        <v-col class="stat-block">
          <div class="stat-title">
            <span>Pokedex Entry</span>
          </div>
          <span class="stat-subtitle">{{ pokemon.flavorText }}</span>
        </v-col>
      </v-row>

      <v-row class="pokemon-stats">
        <v-col class="stat-block">
          <div class="stat-title">
            <span>{{ $t("abilities") }}</span>
          </div>
          <div class="info-list mt-1">
            <span
              v-for="item in pokemon.details.abilities"
              :key="item.ability.name"
              class="pokemon-abilities-badge"
            >
              {{ item.ability.name.toUpperCase() }}
            </span>
          </div>
        </v-col>
      </v-row>

      <v-row class="pokemon-stats">
        <v-col cols="4" class="stat-block">
          <div class="stat-title">{{ $t("height") }}</div>
          <div class="stat-badge">{{ pokemon.details.height / 10 }}m</div>
        </v-col>

        <v-col cols="4" class="stat-block">
          <div class="stat-title">{{ $t("weight") }}</div>
          <div class="stat-badge">{{ pokemon.details.weight / 10 }}kg</div>
        </v-col>

        <v-col cols="4" class="stat-block">
          <div class="stat-title">{{ $t("base_exp") }}</div>
          <div class="stat-badge">
            {{ pokemon.details.base_experience }}
          </div>
        </v-col>
      </v-row>

      <v-row class="pokemon-stats">
        <v-col cols="6" class="stat-block">
          <div class="stat-title">{{ $t("weaknesses") }}</div>
          <div class="stat-badge weaknesses-badge">
            <span class="mr-1"><strong>2x</strong></span>
            <v-img
              v-for="item in pokemon.weaknesses"
              style="height: 15px; width: 15px"
              :src="`/type-icons/${item.name}.svg`"
              :title="item.name.toUpperCase()"
            />
          </div>
        </v-col>
      </v-row>

      <v-row class="pokemon-stats">
        <div class="stat-title">
          <span>{{ $t("stats") }}</span>
        </div>
        <v-col cols="12" class="stat-list">
          <div
            v-for="(stat, index) in pokemon.details.stats"
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
            <div class="stat-label">{{ $t("total") }}</div>
            <div class="stat-value">{{ getTotalStats() }}</div>
          </div>
        </v-col>
      </v-row>

      <v-row class="pokemon-evolution">
        <div class="stat-title">{{ $t("evolution") }}</div>
        <v-col cols="12" class="evolution-list">
          <div
            v-for="(evolution, index) in pokemon.evolutionChain"
            :key="index"
            class="evolution-item"
          >
            <img
              :src="getEvolutionSprite(evolution.name)"
              :alt="evolution.name"
              class="evolution-img"
            />
            <div
              v-if="index < pokemon.evolutionChain.length - 1"
              class="evolution-arrow"
            >
              <span class="badge">Lvl {{ evolution.level || "??" }}</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "PokemonInfoCard",
  props: {
    pokemon: {
      type: Object,
      required: true,
      default: () => {},
    },
  },
  data() {
    return {
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
  methods: {
    getTypeColor(type: string) {
      return this.typeColors[type] || "#A8A878";
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
      return this.pokemon.details.stats.reduce(
        (total, stat) => total + stat.base_stat,
        0
      );
    },
    getEvolutionSprite(name: string) {
      const pokemonId = this.getPokemonIdFromName(name);
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${pokemonId}.svg`;
    },
    getPokemonIdFromName(name: string) {
      const pokemon = this.pokemon.evolutionChain.find(
        (evo) => evo.name === name
      );
      return pokemon ? pokemon.url.split("/")[6] : "";
    },
    capitalizeFirstLetter(name: string) {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
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
  position: relative;
  overflow: visible;
  top: 120px;
  max-width: 100%;
}
</style>
