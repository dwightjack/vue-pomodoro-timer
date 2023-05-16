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
<script setup lang="ts">
import { watch, ref, onMounted, onUnmounted, computed } from 'vue';
import { number } from 'vue-types';
import { getIntervalTypeColor } from '@/utils';
import { useCycle } from '@/stores/cycle';

const cycle = useCycle();

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

const props = defineProps({
  size: number().def(50),
});

const canvasRef = ref<HTMLCanvasElement>();
const remaining = computed(
  () => cycle.currentInterval.remaining ?? cycle.currentInterval.duration,
);
const minutes = ref<number>(currentMinute(remaining.value));
const colorType = computed(() =>
  getIntervalTypeColor(cycle.currentInterval.type),
);
const originalFavicon = new Map();

function renderCanvas() {
  const { duration } = cycle.currentInterval;
  const percent = (duration - remaining.value) / duration;
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
</script>
