<script setup lang="ts">
import { oneOf, integer } from 'vue-types';
import { computed } from 'vue';
import {
  formatTime,
  getIntervalTypeColor,
  getMinutes,
  getSeconds,
} from '@/utils';
import { IntervalType } from '@/types';

const props = defineProps({
  type: oneOf(['none', ...Object.values(IntervalType)] as const).def('none'),
  duration: integer().def(0),
});

const time = computed(() => formatTime(props.duration));
const label = computed(() => {
  const mins = getMinutes(props.duration);
  const secs = getSeconds(props.duration);
  return `${mins} minutes ${secs ? secs + ' seconds ' : ''}left`;
});

const classes = computed(() =>
  getIntervalTypeColor(props.type as IntervalType),
);
</script>
<template>
  <div
    role="timer"
    class="tabular-nums text-4xl py-4 px-8 rounded-lg border-current border-4"
    :class="classes"
    :aria-label="label"
  >
    {{ time }}
  </div>
</template>
