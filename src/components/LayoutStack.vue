<template>
  <component
    :is="tag"
    class="flex flex-col"
    :class="{
      'items-center': centered,
      'items-start': !centered,
      [`gap-y-${space}`]: space,
    }"
  >
    <slot />
  </component>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { string, bool, oneOfType } from 'vue-types';

export default defineComponent({
  props: {
    tag: string().def('div'),
    centered: bool().def(false),
    space: oneOfType([String, Number]).def(4),
  },
});
</script>
