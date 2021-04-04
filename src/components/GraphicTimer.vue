<template>
  <canvas
    ref="canvasRef"
    class="sr-only"
    :class="colorType"
    :width="size"
    :height="size"
    aria-hidden="true"
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
} from 'vue';
import { getIntervalTypeColor } from '@/utils';
import { number, oneOf } from 'vue-types';
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
  props: {
    size: number().def(50),
    duration: number().isRequired,
    remaining: number(),
    type: oneOf(Object.values(IntervalType)).isRequired,
  },
  setup(props) {
    const canvasRef = ref<HTMLCanvasElement>();
    const remaining = computed(() => props.remaining ?? props.duration);
    const minutes = ref<number>(currentMinute(remaining.value));
    const colorType = computed(() => getIntervalTypeColor(props.type));
    const originalFavicon = new Map();

    function renderCanvas() {
      const percent = (props.duration - remaining.value) / props.duration;
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
      () => currentMinute(remaining.value),
      (v) => {
        if (minutes.value !== v) {
          minutes.value = v;
        }
      },
    );

    watch([minutes, colorType], renderCanvas, {
      flush: 'post',
    });
    onMounted(() => {
      setTimeout(renderCanvas, 0);
    });
    onUnmounted(() => {
      if (originalFavicon.size === 0) {
        return;
      }
      originalFavicon.forEach((href, favicon) => {
        favicon.href = href;
      });
      originalFavicon.clear();
    });

    return { colorType, canvasRef };
  },
});
</script>
