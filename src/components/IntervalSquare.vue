<script setup lang="ts">
import { computed } from 'vue';
import { oneOf, integer, bool } from 'vue-types';
import { formatTime, formatTimeDuration, toTitleCase } from '@/utils';
import { IntervalType } from '@/types';

const { type, duration } = defineProps({
  type: oneOf(Object.values(IntervalType)).isRequired,
  duration: integer().def(0),
  current: bool().def(false),
});

const abbr = computed(() =>
  type.replace(/(\w).+?($|-)/g, (_: string, v: string) => v.toUpperCase()),
);

const classes = computed(() => {
  if (type === IntervalType.Work) {
    return 'text-amber-300';
  }
  if (type === IntervalType.ShortBreak) {
    return 'text-green-300';
  }
  if (type === IntervalType.LongBreak) {
    return 'text-green-300';
  }
  return 'text-blue-100';
});

const durationFormatted = computed(() => formatTime(duration));
const durationAttr = computed(() => formatTimeDuration(duration));
const typeFormatted = computed(() => toTitleCase(type));
</script>
<template>
  <li
    class="grid rounded-md border px-2 py-1 text-center transition-colors duration-150 ease-out *:text-gray-700"
    :class="[
      classes,
      {
        'bg-current *:dark:text-stone-800': current,
        '*:dark:text-inherit': !current,
      },
    ]"
    :aria-current="current ? 'time' : undefined"
  >
    <b class="text-sm" aria-hidden="true">{{ abbr }}</b>
    <span class="sr-only">{{ typeFormatted }}</span>
    <time class="text-xs" :datetime="durationAttr">
      {{ durationFormatted }}
      <span class="sr-only">minutes</span>
    </time>
  </li>
</template>
