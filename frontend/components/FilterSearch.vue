<template>
  <div class="input-wrapper mb-2">
    <input
      type="text"
      v-model="searchQuery"
      :placeholder="$t('search')"
      @input="updateFilter"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue';

export default defineComponent({
  name: 'FilterSearch',
  props: {
    resetTrigger: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const searchQuery = ref('');

    const updateFilter = () => {
      emit('filter-searched', {
        search: searchQuery.value,
      });
    };

    watch(
      () => props.resetTrigger,
      () => {
        searchQuery.value = '';
      }
    );

    return {
      searchQuery,
      updateFilter,
    };
  },
});
</script>
