<template>
  <button
    :type="type"
    class="
      rounded
      p-2
      text
      border-2 border-transparent
      text-blue-500
      transition-colors
      duration-150
      space-x-1
    "
    :class="{
      'bg-blue-200 hover:border-blue-500': pressed,
      'hover:bg-blue-100': !pressed,
    }"
    :aria-pressed="pressed"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { bool, oneOf } from 'vue-types';
</script>
<script setup lang="ts">
defineProps({
  pressed: bool().def(false),
  type: oneOf(['button', 'reset', 'submit', undefined] as const).def('button'),
});
</script>
