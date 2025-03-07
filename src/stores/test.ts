import { defineStore } from 'pinia';
import { computed, ref, toValue, watch } from 'vue';
import { Interval, IntervalType } from '@/types';
import { useStorage } from '@vueuse/core';
import { uniqId } from '@/utils';

export const useCycle = defineStore('cycle', () => {
  const intervalsStorage = useStorage<Interval[]>('intervals', [
    {
      type: IntervalType.Work,
      duration: 45 * 60 * 1000,
      id: uniqId([]),
    },
  ]);

  const intervals = ref<Interval[]>(toValue(intervalsStorage));
  const current = ref(0);

  const currentInterval = computed(() => intervals.value[current.value]);
  const ids = computed(() => intervals.value.map(({ id }) => id));

  function toInterval(index: number) {
    let next = index;
    if (!intervals.value) {
      return;
    }
    if (next >= intervals.value.length) {
      next = 0;
    }
    const $next = intervals.value[next];
    current.value = next;
    $next.remaining = $next.duration;
  }

  watch(
    () => intervalsStorage.value,
    () => {
      intervals.value = toValue(intervalsStorage);
    },
  );

  return {
    intervals,
    current,
    currentInterval,
    ids,
    createInterval() {
      const id = uniqId(ids.value);
      return {
        type: IntervalType.Work,
        duration: 0,
        remaining: 0,
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
      current.value = 0;
      intervals.value.forEach((int) => {
        int.remaining = int.duration;
      });
    },
    countDown(ms = 1000) {
      const interval = intervals.value[current.value];
      if (interval?.remaining === undefined) {
        return;
      }
      if (interval.remaining <= 0) {
        toInterval(current.value + 1);
        return;
      }
      interval.remaining = Math.max(0, interval.remaining - ms);
    },
    updateCycle(updates: Interval[]) {
      // save intervals and reset everything
      intervals.value = updates;
      this.resetCycle();
    },
  };
});
