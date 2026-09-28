<script setup lang="ts">
import BaseTimer from '@/components/BaseTimer.vue';
import { useCycle } from '@/stores/cycle';
import { getMinutes, getSeconds } from '@/utils';
import { computed } from 'vue';

const cycle = useCycle();
const currentCycle = computed(() => cycle.intervals[cycle.current]);
const countdown = computed(() => cycle.countdowns[cycle.current]);

const label = computed(() => {
  const mins = getMinutes(countdown.value);
  const secs = getSeconds(countdown.value);
  let remMins = mins + (secs === 0 ? 0 : 1);
  if (mins === 0 && secs === 0) {
    return `time out`;
  }
  if (mins === 0) {
    return `less than 1 minute left`;
  }
  if (mins > 10) {
    // for intervals greater than 10 minutes,
    // announce the remaining time every 5 minutes
    // the announced time is rounded up to the nearest multiple of 5 or the total interval length if shorter.
    remMins = Math.min(
      Math.ceil(remMins / 5) * 5,
      getMinutes(currentCycle.value.duration),
    );
    return `${remMins} minutes left`;
  }
  return `${remMins} minutes left`;
});
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
      :remaining="countdown"
      class="will-change-transform"
    />
  </TransitionGroup>
  <div role="status" class="sr-only">
    {{ label }}
  </div>
</template>
