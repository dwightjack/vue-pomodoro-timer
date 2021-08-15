<template>
  <component
    :is="tag"
    class="flex items-start min-w-0"
    :class="{
      'justify-center': centered,
      [`gap-${space}`]: space,
    }"
  >
    <slot />
  </component>
</template>
<script lang="ts">
import { string, bool, oneOfType } from 'vue-types';
</script>
<script setup lang="ts">
defineProps({
  tag: string().def('div'),
  centered: bool().def(false),
  space: oneOfType([String, Number]).def(4),
});
</script>
