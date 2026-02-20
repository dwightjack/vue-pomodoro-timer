<script setup lang="ts">
import { string, bool, oneOfType } from 'vue-types';

type TagNames = keyof HTMLElementTagNameMap;

defineProps({
  tag: string<TagNames>().def('div'),
  centered: bool().def(false),
  space: oneOfType([String, Number]).def(4),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <component
    :is="tag"
    class="flex flex-col gap-y-[calc(var(--spacing)*var(--s,4))]"
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
