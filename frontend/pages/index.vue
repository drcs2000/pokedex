<template>
  <v-container>
    <v-row>
      <v-col cols="8">
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
  </v-container>
</template>

<script>
export default {
  name: 'PokemonSearchInput',
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
</style>
