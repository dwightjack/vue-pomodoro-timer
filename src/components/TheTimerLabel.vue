<script setup lang="ts">
import { useCycle } from '@/stores/cycle';
import { IntervalType } from '@/types';
const cycle = useCycle();
</script>
<template>
  <h2
    class="view-transition-[label] fixed inset-s-0 inset-e-7 inset-be-4 flex flex-row-reverse text-5xl leading-[1.1] font-light opacity-80 md:text-7xl lg:inset-e-10 lg:inset-be-6 lg:text-8xl"
  >
    <span class="sr-only">Current Interval </span>

    <span class="ms-auto block">
      <template v-if="cycle.currentInterval.type === IntervalType.LongBreak">
        Long<br />Break
      </template>
      <template v-else-if="cycle.currentInterval.type === IntervalType.Work">
        Work
      </template>
      <template
        v-else-if="cycle.currentInterval.type === IntervalType.ShortBreak"
      >
        Short<br />Break
      </template>
    </span>
  </h2>
</template>
