<template>
  <div class="py-4 px-8 rounded-lg text-gray-800" :class="classes">
    <time class="c-the-timer__time text-4xl">{{ time }}</time>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import VueTypes from 'vue-types';
import { IntervalType } from '@/types';

const toString = (v: number) => String(v).padStart(2, '0');
const getMinutes = (v: number) => Math.floor((v / 1000 / 60) % 60);
const getSeconds = (v: number) => Math.floor((v / 1000) % 60);

export default defineComponent({
  setup(props) {
    const time = computed(() => {
      const minutes = toString(getMinutes(props.duration));
      const seconds = toString(getSeconds(props.duration));
      return `${minutes}:${seconds}`;
    });

    const classes = computed(() => {
      if (props.type === IntervalType.Work) {
        return 'bg-orange-300';
      }
      if (props.type === IntervalType.ShortBreak) {
        return 'bg-green-300';
      }
      if (props.type === IntervalType.LongBreak) {
        return 'bg-green-500';
      }
      return 'bg-blue-100';
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
.c-the-timer__time {
  font-variant-numeric: tabular-nums;
}
</style>
