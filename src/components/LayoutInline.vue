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
<script setup lang="ts">
import { string, bool, oneOfType } from 'vue-types';

defineProps({
  tag: string().def('div'),
  centered: bool().def(false),
  space: oneOfType([String, Number]).def(4),
})
</script>
