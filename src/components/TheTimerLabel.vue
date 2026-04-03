<script setup="ts">
import { useCycle } from '@/stores/cycle';
import { IntervalType } from '@/types';
const cycle = useCycle();
</script>
<template>
  <h2
    class="text-5xl leading-[1.1] font-light opacity-80 md:text-7xl lg:text-8xl"
  >
    <span class="sr-only">Current Interval </span>
    <Transition
      appear
      enter-from-class="opacity-0 translate-x-2"
      enter-active-class="transition-all  duration-600 delay-1000 ease-[cubic-bezier(0.66,0,0.34,1)]"
      leave-active-class="transition-all  -translate-x-2 duration-600 ease-[cubic-bezier(0.66,0,0.34,1)]"
      leave-to-class="opacity-0"
    >
      <span
        v-if="cycle.currentInterval.type === IntervalType.LongBreak"
        class="fixed inset-e-7 inset-be-4 lg:inset-e-10 lg:inset-be-6"
      >
        Long<br />Break
      </span>
      <span
        v-else-if="cycle.currentInterval.type === IntervalType.Work"
        class="fixed inset-e-7 inset-be-4 lg:inset-e-10 lg:inset-be-6"
      >
        Work
      </span>
      <span
        v-else-if="cycle.currentInterval.type === IntervalType.ShortBreak"
        class="fixed inset-e-7 inset-be-4 lg:inset-e-10 lg:inset-be-6"
      >
        Short<br />Break
      </span>
    </Transition>
  </h2>
</template>
