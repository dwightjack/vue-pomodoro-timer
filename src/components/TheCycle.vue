<script setup lang="ts">
import IntervalSquare from '@/components/IntervalSquare.vue';
import { useCycle } from '@/stores/cycle';

const cycle = useCycle();
</script>
<template>
  <div>
    <h2 class="sr-only">Intervals</h2>
    <ul class="flex flex-wrap items-center justify-center gap-1">
      <IntervalSquare
        v-for="(interval, i) in cycle.intervals"
        :key="interval.id"
        :type="interval.type"
        :duration="interval.duration"
        :current="cycle.current === i"
      />
    </ul>
  </div>
</template>
