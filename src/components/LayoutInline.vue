<script setup lang="ts">
import { string, bool, oneOfType, oneOf } from 'vue-types';
defineProps({
  tag: string().def('div'),
  centered: bool().def(false),
  verticalAlign: oneOf(['start', 'stretch', 'end', 'center']).def('start'),
  space: oneOfType([String, Number]).def(4),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <component
    :is="tag"
    class="gap flex min-w-0"
    :class="{
      'justify-center': centered,
      'items-center': verticalAlign === 'center',
      'items-stretch': verticalAlign === 'stretch',
      'items-end': verticalAlign === 'end',
      'items-start': verticalAlign === 'start',
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
  column-gap: calc(var(--spacing) * var(--s));
}
</style>
