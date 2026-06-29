<script setup lang="ts">
import { useCycle } from '@/stores/cycle';
import { IntervalType } from '@/types';
const cycle = useCycle();
</script>
<template>
  <h2
    class="view-transition-[label] fixed inset-e-7 inset-be-4 size-fit text-5xl leading-none font-light opacity-80 md:text-7xl lg:inset-e-10 lg:inset-be-6 lg:text-8xl"
  >
    <span class="sr-only">Current Interval </span>

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
  </h2>
</template>
