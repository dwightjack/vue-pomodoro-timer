import { defineStore } from 'pinia';
import { Interval, Cycle, IntervalType } from '@/types';
import { uniqId } from '@/utils';

export const useCycle = defineStore('cycle', {
  state: (): Cycle => ({
    intervals: [
      {
        type: IntervalType.Work,
        duration: 45 * 60 * 100,
        remaining: 0,
        id: uniqId([]),
      },
    ],
    current: 0,
  }),

  getters: {
    currentInterval: (state) => state.intervals[state.current],
    ids: (state) => state.intervals.map(({ id }) => id),
  },

  actions: {
    createInterval() {
      const id = uniqId(this.ids);
      return {
        type: IntervalType.Work,
        duration: 0,
        remaining: 0,
        id,
      };
    },
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
  persist: true,
});
