<template>
  <div
    role="timer"
    class="c-the-timer text-4xl py-4 px-8 rounded-lg border-current border-4 text-gray-800"
    :class="classes"
  >
    {{ time }}
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import VueTypes from 'vue-types';
import { IntervalType } from '@/types';
import { formatTime } from '@/utils';

export default defineComponent({
  setup(props) {
    const time = computed(() => formatTime(props.duration));

    const classes = computed(() => {
      if (props.type === IntervalType.Work) {
        return 'text-orange-500';
      }
      if (props.type === IntervalType.ShortBreak) {
        return 'text-green-500';
      }
      if (props.type === IntervalType.LongBreak) {
        return 'text-green-700';
      }
      return 'text-blue-300';
    });

    return { time, IntervalType, classes };
  },
  props: {
    type: VueTypes.oneOf(['none', ...Object.values(IntervalType)]).def('none'),
    duration: VueTypes.integer.def(0),
  },
});
</script>
<style scoped>
.c-the-timer {
  font-variant-numeric: tabular-nums;
}
</style>
