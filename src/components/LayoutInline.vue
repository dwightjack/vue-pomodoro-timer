<script setup lang="ts">
import { string, bool, oneOfType, oneOf } from 'vue-types';
type TagNames = keyof HTMLElementTagNameMap;
defineProps({
  tag: string<TagNames>().def('div' as const),
  centered: bool().def(false),
  verticalAlign: oneOf(['start', 'stretch', 'end', 'center'] as const).def(
    'start',
  ),
  space: oneOfType([String, Number]).def(4),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <component
    :is="tag"
    class="flex min-w-0 gap-x-[calc(var(--spacing)*var(--s,4))]"
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
