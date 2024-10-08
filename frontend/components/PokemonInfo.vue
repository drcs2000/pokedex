<template>
  <v-card class="pokemon-info-card">
    <div class="pokemon-img-details-wrapper">
      <img :src="cardImage" alt="pokemon" class="pokemon-img-details" />
    </div>

    <div class="pokemon-detail-id">#{{ pokemon.id }}</div>
    <div class="pokemon-detail-name">
      {{ capitalizeFirstLetter(pokemon.name) }}
    </div>

    <div class="pokemon-info-list mb-4">
      <span
        v-for="type in pokemon.types"
        :key="type"
        class="pokemon-type-badge"
        :style="{ backgroundColor: getTypeColor(type) }"
        :title="type.toUpperCase()"
      >
        <v-img
          style="height: 15px; width: 15px"
          :src="`/type-icons/${type}.svg`"
          class="mr-1"
        />
        {{ type.toUpperCase() }}
      </span>
    </div>

    <v-row class="pokemon-info-list">
      <div>
        <v-col class="pokemon-info-block">
          <div class="pokemon-info-title">{{ $t("height") }}</div>
          <div class="pokemon-info-badge weaknesses-badge">
            {{ pokemon.details.height / 10 }}m
          </div>
        </v-col>
      </div>

      <div>
        <v-col class="pokemon-info-block">
          <div class="pokemon-info-title">{{ $t("weight") }}</div>
          <div class="pokemon-info-badge weaknesses-badge">
            {{ pokemon.details.weight / 10 }}kg
          </div>
        </v-col>
      </div>
    </v-row>

    <v-row class="pokemon-info-list mb-2">
      <v-col class="pokemon-info-block">
        <div class="pokemon-info-title">{{ $t("weaknesses") }}</div>
        <div class="pokemon-info-badge weaknesses-badge">
          <span class="mr-1"><strong>2x</strong></span>
          <v-img
            v-for="item in pokemon.weaknesses"
            :key="item.name"
            style="height: 15px; width: 15px"
            :src="`/type-icons/${item.name}.svg`"
            :title="item.name.toUpperCase()"
          />
        </div>
      </v-col>
    </v-row>

    <v-row class="pokemon-info-list mb-2">
      <div class="pokemon-info-title">
        <span>{{ $t("stats") }}</span>
      </div>
      <v-col cols="12" class="pokemon-info-list">
        <div
          v-for="(stat, index) in pokemon.details.stats"
          :key="index"
          class="pokemon-info-item"
          :style="{ backgroundColor: getStatColor(index) }"
        >
          <div class="pokemon-info-label">
            {{ getStatLabel(index) }}
          </div>
          <div class="pokemon-info-value">{{ stat.base_stat }}</div>
        </div>
        <div class="pokemon-info-item total-stat">
          <div class="pokemon-info-label">{{ $t("total") }}</div>
          <div class="pokemon-info-value">{{ getTotalStats }}</div>
        </div>
      </v-col>
    </v-row>

    <v-row class="pokemon-evolution">
      <div class="pokemon-info-title">{{ $t("evolution") }}</div>
      <v-col cols="12" class="evolution-list">
        <div
          v-for="(evolution, index) in pokemon.evolutionChain"
          :key="index"
          class="evolution-item"
        >
          <img
            :src="getSprite(evolution.name)"
            :alt="evolution.name"
            class="evolution-img"
            :title="evolution.name"
          />

          <div
            v-if="index < pokemon.evolutionChain.length - 1"
            class="evolution-arrow"
          >
            <span class="badge">
              Lvl {{ pokemon.evolutionChain[index + 1].min_level || "Any" }}
            </span>
          </div>
        </div>
      </v-col>
    </v-row>
  </v-card>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";

export default defineComponent({
  name: "PokemonInfoCard",
  props: {
    pokemon: {
      type: Object,
      required: true,
      default: () => ({}),
    },
  },
  setup(props) {
    const typeColors = {
      bug: "#9F9F28",
      dark: "#4F4747",
      dragon: "#576FBC",
      electric: "#DFBC28",
      fairy: "#E18CE1",
      fighting: "#E49021",
      fire: "#E4613E",
      flying: "#74AAD0",
      ghost: "#6F4570",
      grass: "#439837",
      ground: "#A4733C",
      ice: "#47C8C8",
      normal: "#828282",
      poison: "#9354CB",
      psychic: "#E96C8C",
      rock: "#A9A481",
      steel: "#74B0CB",
      water: "#3099E1",
    };

    const getTypeColor = (type: string) => {
      return typeColors[type] || "#A8A878";
    };

    const getStatLabel = (index: number) => {
      const labels = ["HP", "ATK", "DEF", "SpA", "SpD", "SPD"];
      return labels[index] || "";
    };

    const getStatColor = (index: number) => {
      const colors = [
        "#ff5e57",
        "#f7b32b",
        "#f9c74f",
        "#4db7f9",
        "#43d1b0",
        "#fb82a8",
      ];
      return colors[index] || "#d3d3d3";
    };

    const getTotalStats = computed(() => {
      return props.pokemon.details.stats.reduce(
        (total: number, stat: { base_stat: number }) => total + stat.base_stat,
        0
      );
    });

    const getSprite = (name: string) => {
      const pokemonId = getPokemonIdFromName(name);
      return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`;
    };

    const getPokemonIdFromName = (name: string) => {
      const pokemon = props.pokemon.evolutionChain.find(
        (evo: { name: string }) => evo.name === name
      );
      return pokemon ? pokemon.url.split("/")[6] : "";
    };

    const capitalizeFirstLetter = (name: string) => {
      return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
    };

    const cardImage = computed(() => {
      return (
        props.pokemon.details.sprites.other?.["official-artwork"]
          ?.front_default ??
        props.pokemon.details.sprites.other.home.front_default
      );
    });

    return {
      getTypeColor,
      getStatLabel,
      getStatColor,
      getTotalStats,
      getSprite,
      getPokemonIdFromName,
      capitalizeFirstLetter,
      cardImage,
    };
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
