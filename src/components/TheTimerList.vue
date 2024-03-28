<script setup lang="ts">
import BaseTimer from '@/components/BaseTimer.vue';
import { useCycle } from '@/stores/cycle';

const cycle = useCycle();
</script>
<template>
  <TransitionGroup name="timer" tag="div" class="grid grid-rows-1 grid-cols-1">
    <BaseTimer
      v-for="(interval, i) in cycle.intervals"
      v-show="i === cycle.current"
      :key="i"
      :duration="interval.remaining"
      :type="interval.type"
      class="row-start-1 col-start-1 will-change-transform"
    />
  </TransitionGroup>
</template>
<style scoped>
.timer-enter-active,
.timer-leave-active {
  @apply transition-all duration-500 ease-in-out;
}
.timer-enter-from {
  @apply translate-y-2 opacity-0;
}
.timer-leave-to {
  @apply -translate-y-2 opacity-0;
}
</style>
