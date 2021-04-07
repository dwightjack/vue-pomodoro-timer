<template>
  <button
    :type="type"
    class="bg-blue-700 hover:bg-blue-800 px-2 py-1 transition-colors duration-75 rounded-sm"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { oneOf } from 'vue-types';

export default defineComponent({
  props: {
    type: oneOf(['button', 'reset', 'submit', undefined] as const).def(
      'button',
    ),
  },
});
</script>
