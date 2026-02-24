<script setup lang="ts">
import BaseTimer from '@/components/BaseTimer.vue';
import { useCycle } from '@/stores/cycle';
import { computed } from 'vue';

const cycle = useCycle();
const currentCycle = computed(() => cycle.intervals[cycle.current]);
const countdown = computed(() => cycle.countdowns[cycle.current]);
</script>
<template>
  <TransitionGroup
    name="timer"
    appear
    enter-active-class="transition-[translate_opacity] duration-500 ease-in-out"
    leave-active-class="transition-[translate_opacity] duration-500 ease-in-out"
    enter-from-class="translate-y-2 opacity-0"
    leave-to-class="-translate-y-2 opacity-0"
    tag="div"
    class="grid-overlap grid transition-opacity"
  >
    <BaseTimer
      v-if="currentCycle"
      :key="currentCycle.id"
      :duration="countdown"
      :type="currentCycle.type"
      class="will-change-transform"
    />
  </TransitionGroup>
</template>
