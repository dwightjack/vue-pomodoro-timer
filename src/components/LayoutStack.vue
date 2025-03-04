<script setup lang="ts">
import { string, bool, oneOfType } from 'vue-types';
defineProps({
  tag: string().def('div'),
  centered: bool().def(false),
  space: oneOfType([String, Number]).def(4),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <component
    :is="tag"
    class="gap flex flex-col"
    :class="{
      'items-center': centered,
      'items-start': !centered,
    }"
    :style="{
      '--s': space !== 4 ? space : undefined,
    }"
  >
    <slot />
  </component>
</template>
<style scoped>
.gap {
  --s: 4;
  row-gap: calc(var(--spacing) * var(--s));
}
</style>
