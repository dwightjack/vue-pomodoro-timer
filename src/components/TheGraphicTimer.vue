<script setup lang="ts">
import { watch, onUnmounted, computed, useTemplateRef } from 'vue';
import { getIntervalTypeColor } from '@/utils';
import { useCycle } from '@/stores/cycle';
import { useMain } from '@/stores/main';
import { FAVICON_SIZE, useCanvasTimer } from '@/use/useCanvasTimer';

const cycle = useCycle();
const app = useMain();

const remaining = computed(
  () => cycle.currentCountdown ?? cycle.currentInterval.duration,
);
const timeSlices = computed(() => Math.ceil(remaining.value / 1000 / 30));
const elapsedRatio = computed(() => {
  const { duration } = cycle.currentInterval;
  return (duration - remaining.value) / duration;
});

const { renderCanvas, restore, mountCanvas } = useCanvasTimer();
const canvasRef = useTemplateRef('canvasRef');

const colorType = computed(() =>
  getIntervalTypeColor(cycle.currentInterval.type),
);

watch([timeSlices, colorType], () => renderCanvas(elapsedRatio.value), {
  flush: 'post',
});

watch(
  () => app.isPlaying,
  (isPlaying) => {
    if (isPlaying) {
      mountCanvas(canvasRef);
      renderCanvas(elapsedRatio.value);
    } else {
      restore();
    }
  },
);
onUnmounted(restore);
</script>
<template>
  <canvas
    ref="canvasRef"
    class="sr-only"
    :class="colorType"
    :width="FAVICON_SIZE"
    :height="FAVICON_SIZE"
    aria-hidden="true"
  />
</template>
