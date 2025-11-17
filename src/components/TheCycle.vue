<script setup lang="ts">
import { useCycle } from '@/stores/cycle';
import { computed, useId } from 'vue';
import IntervalStep from './IntervalStep.vue';

const cycle = useCycle();
const id = useId();
const max = computed(() => cycle.intervals.reduce((v, i) => i.duration + v, 0));
</script>
<template>
  <div class="w-full">
    <h2 :id="id + '-cycle'" aria-hidden="true" class="sr-only">Intervals</h2>
    <div
      role="group"
      class="flex w-full items-center justify-center overflow-clip rounded-3xl border-[6px] bg-white"
      :aria-labelledby="id + '-cycle'"
    >
      <IntervalStep
        v-for="(interval, i) in cycle.intervals"
        :key="interval.id"
        :size="(100 * interval.duration) / max"
        :type="interval.type"
        :duration="interval.duration"
        :remaining="cycle.countdowns[i]"
        :current="i === cycle.current"
      />
    </div>
  </div>
</template>
