import { defineNuxtPlugin } from '#app';
import { usePokemonStore } from '~/store/Pokemon';
import type { Pinia } from 'pinia';

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia;

  const pokemonStore = usePokemonStore(pinia);
  nuxtApp.provide('store', pokemonStore);
});