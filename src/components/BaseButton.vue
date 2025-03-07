<script lang="ts" setup>
import { oneOf } from 'vue-types';
defineProps({
  type: oneOf(['button', 'reset', 'submit', undefined] as const).def('button'),
  variant: oneOf(['primary', 'secondary', 'ghost'] as const).def('primary'),
  size: oneOf(['base', 'sm'] as const).def('base'),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type="type"
    class="flex items-center gap-x-2.5 rounded-md transition-colors duration-75"
    :class="{
      'bg-blue-700 text-white hover:bg-blue-800': variant === 'primary',
      'bg-blue-100 text-blue-700 hover:bg-blue-50': variant === 'secondary',
      'text-blue-600 hover:bg-blue-100 dark:text-sky-400 dark:hover:bg-sky-700':
        variant === 'ghost',
      'px-2 py-1 text-sm': size === 'sm',
      'px-3 py-2 text-base': size === 'base',
    }"
  >
    <slot />
  </button>
</template>
