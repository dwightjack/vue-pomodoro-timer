<script lang="ts" setup>
import { oneOf } from 'vue-types';
defineProps({
  type: oneOf(['button', 'reset', 'submit', undefined] as const).def('button'),
  variant: oneOf(['primary', 'secondary'] as const).def('primary'),
  size: oneOf(['base', 'sm'] as const).def('base'),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type
    class="flex items-center gap-x-2.5 rounded-md transition-colors duration-100"
    :class="{
      'bg-gray-100 text-gray-700 hover:bg-white': variant === 'primary',
      'bg-blue-100 text-blue-700 hover:bg-blue-50': variant === 'secondary',
      'px-2 py-1 text-sm': size === 'sm',
      'px-3 py-2 text-base': size === 'base',
    }"
  >
    <slot />
  </button>
</template>
