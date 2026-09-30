import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { Interval, IntervalType } from '@/types';
import { useStorage } from '@vueuse/core';
import { getMinutes, getSeconds, uniqId } from '@/utils';

export const useCycle = defineStore('cycle', () => {
  const intervals = useStorage<Interval[]>('intervals', [
    {
      type: IntervalType.Work,
      duration: 45 * 60 * 1000,
      id: uniqId([]),
    },
  ]);

  const countdowns = ref<number[]>([]);
  const current = ref(0);

  const currentInterval = computed(() => intervals.value[current.value]);
  const currentCountdown = computed(() => countdowns.value[current.value]);
  const ids = computed(() => intervals.value.map(({ id }) => id));

  const currentCountdownLabel = computed(() => {
    const mins = getMinutes(currentCountdown.value);
    const secs = getSeconds(currentCountdown.value);
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
        getMinutes(currentInterval.value.duration),
      );
      return `${remMins} minutes left`;
    }
    return `${remMins} minutes left`;
  });

  async function toInterval(index: number) {
    let next = index;
    if (!intervals.value) {
      return;
    }
    if (next >= intervals.value.length) {
      next = 0;
    }
    await document.startViewTransition(() => {
      current.value = next;
    }).ready;
  }

  function toCountdowns() {
    countdowns.value = intervals.value.map((i) => i.duration);
  }

  watch(() => intervals.value, toCountdowns, { immediate: true });
  watch(
    () => current.value,
    (next) => {
      countdowns.value[next] = intervals.value[next].duration;
    },
  );

  return {
    countdowns,
    current,
    currentInterval,
    currentCountdown,
    currentCountdownLabel,
    intervals,
    ids,
    createInterval() {
      const id = uniqId(ids.value);
      return {
        type: IntervalType.Work,
        duration: 0,
        id,
      };
    },
    getCurrent() {
      return intervals.value[current.value];
    },
    toInterval,

    nextInterval() {
      toInterval(current.value + 1);
    },

    resetCycle() {
      toCountdowns();
      current.value = 0;
    },
    countDown(ms = 1000) {
      const tick = countdowns.value[current.value];
      if (tick === undefined) {
        return;
      }
      if (tick <= 0) {
        toInterval(current.value + 1);
        return;
      }
      countdowns.value[current.value] = Math.max(0, tick - ms);
    },
    updateCycle(updates: Interval[]) {
      // save intervals and reset everything
      intervals.value = updates;
      this.resetCycle();
    },
  };
});
