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
        <label v-for="item in selectionArray" :key="item" class="dropdown-item">
          <input
            type="checkbox"
            :value="item"
            v-model="selectedTypes"
            class="styled-checkbox"
            @change="updateFilter"
          />
          <span class="checkbox-label">{{ item }}</span>
        </label>
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { availableTypes } from '@/public/utils/types.ts';

export default defineComponent({
  name: 'FilterSelect',
  props: {
    info: {
      type: String,
      required: true,
      default: () => '',
    },
    resetTrigger: {
      type: Boolean,
      required: true,
    },
  },
  setup(props, { emit }) {
    const selectionArray = ref<string[]>([]);
    const selectedTypes = ref<string[]>([]);
    const showDropdown = ref<{ [key: string]: boolean }>({ type: false });

    const toggleDropdown = (dropdown: string) => {
      if (dropdown === 'type') {
        selectionArray.value = availableTypes;
      }
      showDropdown.value[dropdown] = !showDropdown.value[dropdown];
    };

    const handleOutsideClick = (event: Event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.custom-select')) {
        showDropdown.value.type = false;
      }
    };

    const updateFilter = () => {
      emit('filter-updated', {
        type: props.info,
        values: selectedTypes.value,
      });
    };

    watch(
      () => props.resetTrigger,
      () => {
        selectedTypes.value = [];
      }
    );

    onMounted(() => {
      document.addEventListener('click', handleOutsideClick);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleOutsideClick);
    });

    return {
      selectionArray,
      selectedTypes,
      showDropdown,
      toggleDropdown,
      updateFilter,
    };
  },
});
</script>
