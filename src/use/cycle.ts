import { Interval, Cycle } from '@/types';
import { reactive, computed } from '@vue/composition-api';

export function useCycle(intervals: Interval[] = []) {
  const cycle: Cycle = reactive({
    intervals,
    current: -1,
    remaining: 0,
  });

  const currentType = computed(
    () => cycle.intervals[cycle.current]?.type ?? 'none',
  );

  function toInterval(index: number) {
    let next = index;
    if (next >= cycle.intervals.length) {
      next = 0;
    }
    cycle.current = next;
    cycle.remaining = cycle.intervals[next].duration;
  }

  function nextInterval() {
    toInterval(cycle.current + 1);
  }

  function resetCycle() {
    toInterval(0);
  }

  function countDown(ms = 1000) {
    if (cycle.remaining <= 0) {
      nextInterval();
      return;
    }
    cycle.remaining = Math.max(0, cycle.remaining - ms);
  }

  return {
    cycle,
    nextInterval,
    toInterval,
    resetCycle,
    countDown,
    currentType,
  };
}
