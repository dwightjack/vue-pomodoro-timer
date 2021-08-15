import { defineStore } from 'pinia';
import { Interval, Cycle } from '@/types';

export const useCycle = defineStore('cycle', {
  state: (): Cycle => ({
    intervals: [],
    current: -1,
  }),

  getters: {
    currentInterval(): Interval {
      return this.intervals[this.current];
    },
  },

  actions: {
    getCurrent() {
      return this.intervals[this.current];
    },
    toInterval(index: number) {
      let next = index;
      if (!this.intervals.length) {
        return;
      }
      if (next >= this.intervals.length) {
        next = 0;
      }
      this.$patch((state) => {
        const $next = state.intervals[next];
        state.current = next;
        $next.remaining = $next.duration;
      });
    },

    nextInterval() {
      this.toInterval(this.current + 1);
    },

    resetCycle() {
      this.toInterval(0);
      this.$patch((state) => {
        state.intervals.forEach((int) => {
          int.remaining = int.duration;
        });
      });
    },
    countDown(ms = 1000) {
      const current = this.getCurrent();
      if (current?.remaining === undefined) {
        return;
      }
      if (current.remaining <= 0) {
        this.nextInterval();
        return;
      }
      current.remaining = Math.max(0, current.remaining - ms);
    },
    updateCycle(intervals: Interval[]) {
      // save intervals and reset everything
      this.intervals = intervals;
      this.resetCycle();
    },
  },
});
