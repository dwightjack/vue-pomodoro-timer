<script setup lang="ts">
import { bool, object, oneOf } from 'vue-types';
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
  pressed: bool(),
});
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <button
    :type
    :aria-pressed="pressed"
    class="inline-flex gap-x-1 rounded-sm border-2 border-transparent p-3 align-middle leading-none text-current transition-colors duration-150 hover:enabled:bg-white/25 disabled:text-gray-500 aria-pressed:bg-blue-200"
  >
    <component :is="icon" />
    <span class="sr-only"><slot /></span>
  </button>
</template>
