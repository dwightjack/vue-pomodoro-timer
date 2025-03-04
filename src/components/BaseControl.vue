<script setup lang="ts">
import { oneOf } from 'vue-types';
defineProps({
  type: oneOf(['button', 'reset', 'submit', undefined] as const).def('button'),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type="type"
    class="space-x-1 rounded-sm border-2 border-transparent p-2 leading-none text-blue-500 transition-colors duration-150 hover:bg-blue-100 dark:text-sky-400 dark:hover:bg-sky-700"
  >
    <slot />
  </button>
</template>
