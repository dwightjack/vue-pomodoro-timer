<script setup lang="ts">
import IntervalSquare from '@/components/IntervalSquare.vue';
import { useCycle } from '@/stores/cycle';
import { useId } from 'vue';

const cycle = useCycle();
const id = useId();
</script>
<template>
  <div>
    <h2 :id="id + '-cycle'" aria-hidden="true">Intervals</h2>
    <ul
      class="flex flex-wrap items-center justify-center gap-1"
      :aria-labelledby="id + '-cycle'"
    >
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
