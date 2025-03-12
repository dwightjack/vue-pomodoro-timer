<script setup lang="ts">
import { oneOf, integer } from 'vue-types';
import { computed } from 'vue';
import {
  formatTime,
  getIntervalTypeColor,
  getMinutes,
  getSeconds,
  toSpacedString,
} from '@/utils';
import { IntervalType } from '@/types';

const { type, duration } = defineProps({
  type: oneOf(['none', ...Object.values(IntervalType)] as const).def('none'),
  duration: integer().def(0),
});

const time = computed(() => formatTime(duration));
const label = computed(() => {
  let mins = getMinutes(duration);
  const secs = getSeconds(duration);
  if (mins === 0 && secs === 0) {
    return `${toSpacedString(type)}: time out`;
  }
  if (mins === 0) {
    return `${toSpacedString(type)}: less than 1 minute left`;
  }
  return `${toSpacedString(type)}: ${mins + 1} minutes left`;
});

const classes = computed(() => getIntervalTypeColor(type as IntervalType));
</script>
<template>
  <div
    role="timer"
    aria-live="polite"
    aria-atomic="true"
    class="rounded-lg border-4 px-8 py-4 text-4xl tabular-nums"
    :class="classes"
  >
    <span aria-hidden="true">{{ time }}</span>
    <span class="sr-only">{{ label }}</span>
  </div>
</template>
