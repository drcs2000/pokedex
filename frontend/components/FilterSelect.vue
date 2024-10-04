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
        :class="showDropdown[info] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
      />
    </div>

    <transition name="slide-y-transition">
      <div v-if="showDropdown[info]" class="dropdown-content">
        <label
          v-for="item in selectionArray"
          :key="item"
          class="dropdown-item"
        >
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
import { getWeightRanges } from "@/public/utils/weight.ts";
import { getHeightRanges } from "@/public/utils/height.ts";

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
      selectionArray: [] as string[],
      selectedTypes: [] as string[],
      showDropdown: {
        type: false,
        weakness: false,
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
      if (dropdown === 'type' || dropdown === 'weakness') {
        this.selectionArray = this.availableTypes;
      } else if (dropdown === 'weight') {
        this.selectionArray = getWeightRanges();
      } else if (dropdown === 'height') {
        this.selectionArray = getHeightRanges();
      }
      this.showDropdown[dropdown] = !this.showDropdown[dropdown];
    },
    handleOutsideClick(event: Event) {
      const target = event.target as HTMLElement;
      if (!target.closest(".custom-select")) {
        this.showDropdown.type = false;
        this.showDropdown.weakness = false;
        this.showDropdown.weight = false;
        this.showDropdown.height = false;
      }
    },
  }
})
</script>
