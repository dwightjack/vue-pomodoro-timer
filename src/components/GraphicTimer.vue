<template>
  <div class="c-graphic-timer" :class="colorType">
    <svg
      ref="svgRef"
      viewBox="-1.2 -1.2 2.4 2.4"
      style="transform: rotate(-0.25turn)"
    >
      <circle
        cx="0"
        cy="0"
        r="1"
        stroke-width="0.4"
        class="c-graphic-timer__circle"
      />
      <path v-if="arc" :d="arc" class="text-white c-graphic-timer__arc" />
    </svg>
  </div>
</template>
<script lang="ts">
import {
  defineComponent,
  watch,
  ref,
  onMounted,
  watchEffect,
} from '@vue/composition-api';
import { getMinutes, getIntervalTypeColor } from '@/utils';
import VueTypes from 'vue-types';
import svgToMiniDataURI from 'mini-svg-data-uri';
import { IntervalType } from '../types';

// https://medium.com/hackernoon/a-simple-pie-chart-in-svg-dbdd653b6936
function getCoordinatesForPercent(percent: number) {
  const x = Math.cos(2 * Math.PI * percent);
  const y = Math.sin(2 * Math.PI * percent);
  return [x, y];
}

export default defineComponent({
  setup(props) {
    const arc = ref<string>('');
    const colorType = ref<string>('');
    const svgRef = ref<SVGGraphicsElement>();

    watch(
      () => props.type as IntervalType,
      (type: IntervalType) => {
        colorType.value = getIntervalTypeColor(type);
      },
    );

    watch(
      () => getMinutes(props.duration - props.remaining),
      () => {
        const percent = (props.duration - props.remaining) / props.duration;

        const [startX, startY] = getCoordinatesForPercent(0);
        const [endX, endY] = getCoordinatesForPercent(percent);
        const largeArcFlag = percent > 0.5 ? 1 : 0;

        arc.value = [
          `M ${startX} ${startY}`,
          `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`,
          `L 0 0`,
        ].join(' ');
      },
    );

    watchEffect(() => {
      if (!svgRef.value) {
        return;
      }
      const { width, height } = svgRef.value.getBBox();
      console.log(width, height);
    });

    return { arc, colorType, svgRef };
  },
  props: {
    duration: VueTypes.number.isRequired,
    remaining: VueTypes.number.isRequired,
    type: VueTypes.string.def(''),
  },
});
</script>
<style lang="postcss" scoped>
.c-graphic-timer__circle {
  fill: currentColor;
  stroke: currentColor;
}
path {
  fill: currentColor;
}
</style>
