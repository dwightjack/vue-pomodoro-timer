import { Interval, Cycle } from '@/types';
import { reactive, computed } from '@vue/composition-api';

export function useCycle(intervals: Interval[] = []) {
  const cycle: Cycle = reactive({
    intervals,
    current: -1,
  });

  function getCurrent() {
    return cycle.intervals[cycle.current];
  }

  function toInterval(index: number) {
    let next = index;
    if (next >= cycle.intervals.length) {
      next = 0;
    }
    cycle.current = next;
    cycle.intervals[next].remaining = cycle.intervals[next].duration;
  }

  function nextInterval() {
    toInterval(cycle.current + 1);
  }

  function resetCycle() {
    toInterval(0);
  }

  function countDown(ms = 1000) {
    const current = getCurrent();
    if (!current) {
      return;
    }
    if (current.remaining <= 0) {
      nextInterval();
      return;
    }
    current.remaining = Math.max(0, current.remaining - ms);
  }

  return {
    cycle,
    nextInterval,
    toInterval,
    resetCycle,
    countDown,
  };
}
