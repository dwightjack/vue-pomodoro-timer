<script setup lang="ts">
import {
  watch,
  ref,
  onMounted,
  onUnmounted,
  computed,
  useTemplateRef,
  nextTick,
} from 'vue';
import { number } from 'vue-types';
import { getIntervalTypeColor } from '@/utils';
import { useCycle } from '@/stores/cycle';

const cycle = useCycle();

const currentMinute = (v: number) => Math.ceil(v / 1000 / 30);

function drawTimer(
  ctx: CanvasRenderingContext2D,
  color: string,
  center: number,
  radius: number,
  start = 0,
  end = 2 * Math.PI,
) {
  ctx.fillStyle = color;
  ctx.globalAlpha = 0.3;
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.fill();

  ctx.globalAlpha = 1;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(center, center);
  ctx.arc(center, center, radius, start, end);
  ctx.fill();

  ctx.fillStyle = 'white';
  ctx.fill(new Path2D(faviconPath));
}

const { size } = defineProps({
  size: number().def(128),
});

const canvasRef = useTemplateRef('canvasRef');
const remaining = computed(
  () => cycle.currentCountdown ?? cycle.currentInterval.duration,
);
const minutes = ref<number>(currentMinute(remaining.value));
const colorType = computed(() =>
  getIntervalTypeColor(cycle.currentInterval.type),
);
const favicon = ref<HTMLLinkElement>();
const faviconPath =
  'M84 62.268C85.3333 63.0378 85.3333 64.9622 84 65.732L54 83.0526C52.6667 83.8224 51 82.8601 51 81.3205L51 46.6795C51 45.1399 52.6667 44.1776 54 44.9474L84 62.268Z';
const originalFavicon = ref<HTMLLinkElement>();

function renderCanvas() {
  const { duration } = cycle.currentInterval;
  const elapsedRatio = (duration - remaining.value) / duration;
  if (!canvasRef.value) {
    return;
  }
  const canvas = canvasRef.value;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }
  const center = size / 2;
  const radius = center;
  const color = window.getComputedStyle(canvas).getPropertyValue('color');

  // -90deg starting from the x axis
  const rotation = Math.PI / -2;

  // start angle + 360deg * elapsed ratio
  const start = rotation + 2 * Math.PI * elapsedRatio;
  // start angle + 360deg
  const end = rotation + 2 * Math.PI;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawTimer(ctx, color, center, radius, start, end);

  canvas.toBlob((blob) => {
    if (blob && favicon.value) {
      favicon.value.href = URL.createObjectURL(blob);
    }
  });
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
onMounted(async () => {
  await nextTick();
  const icon = document.querySelector<HTMLLinkElement>(
    'link[rel="icon"][type="image/svg+xml"]',
  );
  if (icon) {
    originalFavicon.value = icon.cloneNode() as HTMLLinkElement;
    icon.type = 'image/png';
    favicon.value = icon;
  }
  renderCanvas();
});
onUnmounted(() => {
  if (!originalFavicon.value) {
    return;
  }
  favicon.value?.replaceWith(originalFavicon.value);
  favicon.value = undefined;
  originalFavicon.value = undefined;
});
</script>
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
