<script setup lang="ts">
import { object, oneOf } from 'vue-types';
import type {
  ButtonHTMLAttributes,
  FunctionalComponent,
  SVGAttributes,
} from 'vue';

type IconType = FunctionalComponent<SVGAttributes>;

defineProps({
  type: oneOf<ButtonHTMLAttributes['type']>([
    'button',
    'reset',
    'submit',
    undefined,
  ]).def('button'),
  icon: object<IconType>(),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type
    class="inline-flex gap-x-1 rounded-sm border-2 border-transparent p-3 align-middle leading-none text-current transition-colors duration-150 hover:enabled:bg-white/25 disabled:text-white/60"
  >
    <component :is="icon" />
    <span class="sr-only"><slot /></span>
  </button>
</template>
