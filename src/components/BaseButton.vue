<script lang="ts" setup>
import { oneOf } from 'vue-types';
defineProps({
  type: oneOf(['button', 'reset', 'submit', undefined] as const).def('button'),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type="type"
    class="rounded-xs bg-blue-700 px-2 py-1 transition-colors duration-75 hover:bg-blue-800"
  >
    <slot />
  </button>
</template>
