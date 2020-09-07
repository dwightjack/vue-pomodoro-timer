<template>
  <button
    :type="type"
    class="rounded p-2 text border-2 border-transparent text-blue-500 transition-colors duration-150"
    :class="{
      'bg-blue-200 hover:border-blue-500': pressed,
      'hover:bg-blue-100': !pressed,
    }"
    :aria-pressed="pressed"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { string, bool } from 'vue-types';

export default defineComponent({
  props: {
    pressed: bool().def(false),
    type: string().def('button'),
  },
});
</script>
