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
<script setup lang="ts">
import { string, bool, oneOfType } from 'vue-types';
defineProps({
  tag: string().def('div'),
  centered: bool().def(false),
  space: oneOfType([String, Number]).def(4),
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineSlots<{ default?: (props: any) => any }>();
</script>
