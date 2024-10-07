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
import { defineComponent } from "vue";

export default defineComponent({
  name: "FilterSearch",
  props: {
    resetTrigger: {
      type: Boolean,
      required: true,
    },
  },
  data() {
    return {
      searchQuery: ''
    }
  },
  watch: {
    resetTrigger() {
      this.searchQuery = '';
    },
  },
  methods: {
    updateFilter() {
      this.$emit("filter-searched", {
        search: this.searchQuery,
      });
    },
  }
})
</script>
