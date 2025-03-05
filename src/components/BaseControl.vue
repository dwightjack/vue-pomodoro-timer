<script setup lang="ts">
import { oneOf } from 'vue-types';
import { iconList } from './BaseIcon.vue';
import BaseIcon from './BaseIcon.vue';
defineProps({
  type: oneOf(['button', 'reset', 'submit', undefined] as const).def('button'),
  icon: oneOf(iconList).isRequired,
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type="type"
    class="inline-flex gap-x-1 rounded-sm border-none p-3 align-middle leading-none text-blue-600 transition-colors duration-150 hover:bg-blue-100 dark:text-sky-400 dark:hover:bg-sky-700"
  >
    <BaseIcon :name="icon" />
    <span class="sr-only"><slot /></span>
  </button>
</template>
