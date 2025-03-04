<script setup lang="ts">
import { computed } from 'vue';
import { oneOf, integer, bool } from 'vue-types';
import { formatTime, formatTimeDuration, toTitleCase } from '@/utils';
import { IntervalType } from '@/types';

const props = defineProps({
  type: oneOf(Object.values(IntervalType)).isRequired,
  duration: integer().def(0),
  current: bool().def(false),
});

const abbr = computed(() =>
  props.type.replace(/(\w).+?($|-)/g, (_: string, v: string) =>
    v.toUpperCase(),
  ),
);

const classes = computed(() => {
  if (props.type === IntervalType.Work) {
    return 'text-amber-300';
  }
  if (props.type === IntervalType.ShortBreak) {
    return 'text-green-300';
  }
  if (props.type === IntervalType.LongBreak) {
    return 'text-green-300';
  }
  return 'text-blue-100';
});

const durationFormatted = computed(() => formatTime(props.duration));
const durationAttr = computed(() => formatTimeDuration(props.duration));
const typeFormatted = computed(() => toTitleCase(props.type));
</script>
<template>
  <li
    class="grid rounded-md border border-current px-2 py-1 text-center transition duration-150 ease-out"
    :class="[classes, { 'bg-current': current }]"
    :aria-current="current ? 'time' : undefined"
  >
    <b
      class="text-sm text-gray-700"
      :class="{
        'dark:text-stone-800': current,
        'dark:text-inherit': !current,
      }"
      aria-hidden="true"
      >{{ abbr }}</b
    >
    <span class="sr-only">{{ typeFormatted }}</span>
    <time
      class="text-xs text-gray-700"
      :datetime="durationAttr"
      :class="{
        'dark:text-stone-800': current,
        'dark:text-inherit': !current,
      }"
    >
      {{ durationFormatted }}
      <span class="sr-only">minutes</span>
    </time>
  </li>
</template>
