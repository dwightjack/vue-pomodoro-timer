<template>
  <div
    role="timer"
    class="c-base-timer text-4xl py-4 px-8 rounded-lg border-current border-4"
    :class="classes"
    :aria-label="label"
  >
    {{ time }}
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from 'vue';
import { oneOf, integer } from 'vue-types';
import { IntervalType } from '@/types';
import {
  formatTime,
  getIntervalTypeColor,
  getMinutes,
  getSeconds,
} from '@/utils';

export default defineComponent({
  props: {
    type: oneOf(['none', ...Object.values(IntervalType)] as const).def('none'),
    duration: integer().def(0),
  },
  setup(props) {
    const time = computed(() => formatTime(props.duration));
    const label = computed(() => {
      const mins = getMinutes(props.duration);
      const secs = getSeconds(props.duration);
      return `${mins} minutes ${secs ? secs + ' seconds ' : ''}left`;
    });

    const classes = computed(() => {
      return getIntervalTypeColor(props.type as IntervalType);
    });

    return { time, IntervalType, classes, label };
  },
});
</script>
<style scoped>
.c-base-timer {
  font-variant-numeric: tabular-nums;
}
</style>
