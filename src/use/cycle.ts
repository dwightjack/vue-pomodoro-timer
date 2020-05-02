import { Status, IntervalType, Interval, Cycle } from '@/types';
import { reactive } from '@vue/composition-api';

export function useCycle(intervals: Interval[] = []) {
  const cycle: Cycle = reactive({
    intervals,
    current: -1,
    remaining: 0,
  });

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

  return {
    cycle,
    nextInterval,
    toInterval,
    resetCycle,
  };
}
