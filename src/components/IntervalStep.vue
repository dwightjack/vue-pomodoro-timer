<script setup lang="ts">
import { computed, useId } from 'vue';
import { oneOf, integer, number } from 'vue-types';
import { getMinutes, pluralize, toTitleCase } from '@/utils';
import { IntervalType } from '@/types';

const { type, remaining } = defineProps({
  type: oneOf(Object.values(IntervalType)).isRequired,
  duration: integer().def(0),
  position: oneOf(['previous', 'current', 'next'] as const).isRequired,
  remaining: integer().def(0),
  size: number().def(0),
});

const typeFormatted = computed(() => toTitleCase(type));
const id = useId();
const valueText = computed(() => {
  return pluralize(
    Math.round((remaining / 1000 / 60) * 10) / 10,
    'minute',
    'minutes',
  );
});
</script>
<template>
  <label class="sr-only" :for="id + 'meter'">{{ typeFormatted }}</label>
  <div
    :id="id + 'meter'"
    role="meter"
    :aria-current="position === 'current' || undefined"
    class="h-4 border-e-4 border-current bg-linear-to-r from-current to-current bg-right bg-no-repeat transition-[background-size] duration-300 ease-out"
    :style="{
      width: `${size}%`,
      'background-size':
        position === 'current' ? `${(100 * remaining) / duration}% 100%` : '',
    }"
    :class="{
      'text-green-400': type === IntervalType.ShortBreak,
      'text-green-500': type === IntervalType.LongBreak,
      'text-amber-500': type === IntervalType.Work,
      'bg-size-[0_100%]': position === 'previous',
      'bg-size-[100%]': position === 'next',
    }"
    aria-valuemin="0"
    :aria-valuemax="duration / 1000"
    :aria-valuenow="remaining / 1000"
    :aria-valuetext="valueText"
  />
</template>
