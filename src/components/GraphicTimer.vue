<template>
  <canvas
    class="c-graphic-timer sr-only"
    :class="colorType"
    ref="canvasRef"
    :width="size"
    :height="size"
  />
</template>
<script lang="ts">
import {
  defineComponent,
  watch,
  ref,
  onMounted,
  onUnmounted,
  computed,
} from '@vue/composition-api';
import { getIntervalTypeColor } from '@/utils';
import VueTypes from 'vue-types';
import { IntervalType } from '../types';

const currentMinute = (v: number) => Math.ceil(v / 1000 / 30);

function drawCircle(
  ctx: CanvasRenderingContext2D,
  color: string,
  center: number,
  radius: number,
  start = 0,
  end = 2 * Math.PI,
) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(center, center);
  ctx.arc(center, center, radius, start, end);
  ctx.fill();
}

export default defineComponent({
  setup(props) {
    const arc = ref<string>('');
    const canvasRef = ref<HTMLCanvasElement>();
    const minutes = ref<number>(currentMinute(props.remaining));
    const colorType = computed(() =>
      getIntervalTypeColor(props.type as IntervalType),
    );
    const originalFavicon = new Map();

    function renderCanvas() {
      const percent = (props.duration - props.remaining) / props.duration;
      if (!canvasRef.value) {
        return;
      }
      const canvas = canvasRef.value;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return;
      }
      const size = props.size / 2;
      const color = window.getComputedStyle(canvas).getPropertyValue('color');

      const start = Math.PI / -2;
      const end = start + 2 * Math.PI * percent;
      const radius = size;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawCircle(ctx, color, size, radius);
      drawCircle(ctx, '#fff', size, radius - size / 10, start, end);

      const favicons = document.querySelectorAll<HTMLLinkElement>(
        'link[rel="icon"][type="image/png"]',
      );
      if (favicons.length > 0) {
        const dataUrl = canvas.toDataURL('image/png');
        favicons.forEach((favicon) => {
          if (!originalFavicon.has(favicon)) {
            originalFavicon.set(favicon, favicon.href);
          }
          favicon.href = dataUrl;
        });
      }
    }

    watch(
      () => currentMinute(props.remaining),
      (v) => {
        if (minutes.value !== v) {
          minutes.value = v;
        }
      },
    );

    watch([minutes, colorType], renderCanvas);
    onMounted(renderCanvas);
    onUnmounted(() => {
      if (originalFavicon.size === 0) {
        return;
      }
      originalFavicon.forEach((href, favicon) => {
        favicon.href = href;
      });
      originalFavicon.clear();
    });

    return { arc, colorType, canvasRef };
  },
  props: {
    size: VueTypes.number.def(50),
    duration: VueTypes.number.isRequired,
    remaining: VueTypes.number.isRequired,
    type: VueTypes.string.isRequired,
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
