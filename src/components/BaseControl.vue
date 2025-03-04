<script setup lang="ts">
import { bool, oneOf } from 'vue-types';
defineProps({
  pressed: bool().def(false),
  type: oneOf(['button', 'reset', 'submit', undefined] as const).def('button'),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type="type"
    class="space-x-1 rounded-sm border-2 border-transparent p-2 leading-none text-blue-500 transition-colors duration-150 dark:text-sky-400"
    :class="{
      'bg-blue-200 hover:border-blue-500': pressed,
      'hover:bg-blue-100 dark:hover:bg-sky-700': !pressed,
    }"
    :aria-pressed="pressed"
  >
    <slot />
  </button>
</template>
