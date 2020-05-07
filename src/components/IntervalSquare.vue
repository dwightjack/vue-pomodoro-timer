<template>
  <li
    class="grid text-center px-2 py-1 rounded-md border border-current"
    :class="[classes, { 'bg-current': current }]"
    :aria-current="current && 'time'"
  >
    <b class="text-sm text-gray-700" aria-hidden="true">{{ abbr }}</b>
    <span class="sr-only">{{ type }}</span>
    <time class="text-xs text-gray-700" :datetime="durationAttr">{{
      durationFormatted
    }}</time>
  </li>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import VueTypes from 'vue-types';
import { IntervalType } from '@/types';
import { formatTime, formatTimeDuration } from '@/utils';

export default defineComponent({
  setup(props) {
    const abbr = computed(() =>
      props.type.replace(/(\w).+?($|-)/g, (_: string, v: string) =>
        v.toUpperCase(),
      ),
    );

    const classes = computed(() => {
      if (props.type === IntervalType.Work) {
        return 'text-orange-200';
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
    return { abbr, classes, durationFormatted, durationAttr };
  },
  props: {
    type: VueTypes.oneOf(Object.values(IntervalType)).isRequired,
    duration: VueTypes.integer.def(0),
    current: VueTypes.bool.def(false),
  },
});
</script>
