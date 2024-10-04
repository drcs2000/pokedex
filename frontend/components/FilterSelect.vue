<template>
  <div class="custom-select">
    <div
      class="select-btn"
      :class="{ 'has-selection': selectedTypes.length > 0 }"
      @click="toggleDropdown(info)"
    >
      <span>{{ $t(info) }}</span>
      <i
        class="mdi"
        :class="showDropdown.type ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      />
    </div>

    <transition name="slide-y-transition">
      <div v-if="showDropdown.type" class="dropdown-content">
        <label v-for="item in selectionArray" :key="type" class="dropdown-item">
          <input
            type="checkbox"
            :value="item"
            v-model="selectedTypes"
            class="styled-checkbox"
          />
          <span class="checkbox-label">{{ item }}</span>
        </label>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { availableTypes } from "@/public/utils/types.ts";

export default defineComponent({
  name: 'FilterSelect',
  props: {
    info: {
      type: String,
      required: true,
      default: () => ('')
    }
  },
  data() {
    return {
      availableTypes,
      selectedTypes: [] as string[],
      showDropdown: {
        type: false,
        weakness: false,
        ability: false,
        height: false,
        weight: false,
      },
    }
  },
  mounted() {
    document.addEventListener("click", this.handleOutsideClick);
  },
  beforeDestroy() {
    document.removeEventListener("click", this.handleOutsideClick);
  },
  methods: {
    toggleDropdown(dropdown: string) {
      console.log(dropdown)
      if (dropdown === 'type') {
        this.selectionArray = this.availableTypes
      }
      else if (dropdown === 'weakness') {
        this.selectionArray = this.availableTypes
      }
      this.showDropdown[dropdown] = !this.showDropdown[dropdown];
    },
    handleOutsideClick(event: Event) {
      const target = event.target as HTMLElement;
      if (!target.closest(".custom-select")) {
        this.showDropdown.type = false;
      }
    },
  }
})
</script>
