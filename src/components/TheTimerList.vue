<script setup lang="ts">
import BaseTimer from '@/components/BaseTimer.vue';
import { useCycle } from '@/stores/cycle';

const cycle = useCycle();
</script>
<template>
  <TransitionGroup
    name="timer"
    appear
    enter-active-class="transition-all duration-500 ease-in-out"
    leave-active-class="transition-all duration-500 ease-in-out"
    enter-from-class="translate-y-2 opacity-0"
    leave-to-class="-translate-y-2 opacity-0"
    tag="div"
    class="grid-overlap grid"
  >
    <BaseTimer
      v-for="(interval, i) in cycle.intervals"
      v-show="i === cycle.current"
      :key="i"
      :duration="interval.remaining"
      :type="interval.type"
      class="will-change-transform"
    />
  </TransitionGroup>
</template>
