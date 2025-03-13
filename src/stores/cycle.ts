import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { Interval, IntervalType } from '@/types';
import { useStorage } from '@vueuse/core';
import { uniqId } from '@/utils';

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

  function toInterval(index: number) {
    let next = index;
    if (!intervals.value) {
      return;
    }
    if (next >= intervals.value.length) {
      next = 0;
    }
    current.value = next;
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
