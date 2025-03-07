<script setup lang="ts">
import { bool, oneOf } from 'vue-types';
import { iconList } from './BaseIcon.vue';
import BaseIcon from './BaseIcon.vue';
defineProps({
  type: oneOf(['button', 'reset', 'submit', undefined] as const).def('button'),
  icon: oneOf(iconList).isRequired,
  pressed: bool(),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type="type"
    :aria-pressed="pressed"
    class="inline-flex gap-x-1 rounded-sm border-none p-3 align-middle leading-none text-blue-600 transition-colors duration-150 hover:enabled:bg-blue-100 disabled:text-gray-500 aria-pressed:bg-blue-200 dark:text-sky-400 dark:hover:enabled:bg-sky-700"
  >
    <BaseIcon :name="icon" />
    <span class="sr-only"><slot /></span>
  </button>
</template>
