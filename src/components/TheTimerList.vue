<template>
  <transition-group name="timer" tag="div" class="grid grid-rows-1 grid-cols-1">
    <BaseTimer
      v-for="(interval, i) in intervals"
      v-show="i === current"
      :key="i"
      :duration="interval.remaining"
      :type="interval.type"
      class="row-start-1 col-start-1 translate-y-0"
    />
  </transition-group>
</template>
<script setup lang="ts">
import { array, integer } from 'vue-types';
import BaseTimer from '@/components/BaseTimer.vue';
import type { Interval } from '@/types';

defineProps({
  intervals: array<Interval>().def([]),
  current: integer().def(0),
})
</script>
<style lang="postcss" scoped>
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
