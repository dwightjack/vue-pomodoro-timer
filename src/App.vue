<template>
  <TheContainer>
    <LayoutStack centered>
      <TheTimer :duration="cycle.remaining" />
      <TheControls
        @start="start"
        @stop="stop"
        @skip="skip"
        @reset="reset"
        :status="status"
      />
    </LayoutStack>
  </TheContainer>
</template>

<script lang="ts">
import TheContainer from '@/components/TheContainer.vue';
import TheTimer from '@/components/TheTimer.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import TheControls from '@/components/TheControls.vue';
import { defineComponent, ref, watch, onMounted } from '@vue/composition-api';
import { Status, IntervalType, Interval } from '@/types';
import { useStatus } from '@/use/status';
import { useCycle } from '@/use/cycle';

export default defineComponent({
  setup() {
    const { status, start, stop } = useStatus();
    const ticker = ref<number>();
    const interval: Interval = {
      type: IntervalType.Work,
      duration: 10 * 1000, // 10 secs
    };
    const interval2: Interval = {
      type: IntervalType.Work,
      duration: 20 * 1000, // 20 secs
    };

    const { cycle, resetCycle, nextInterval } = useCycle([interval, interval2]);

    function startTicker() {
      return setInterval(() => {
        if (cycle.remaining <= 0) {
          nextInterval();
          return;
        }
        const ms = Math.max(0, cycle.remaining - 1000);
        cycle.remaining = ms;
      }, 1000);
    }

    function skip() {
      ticker.value && clearInterval(ticker.value);
      nextInterval();
      if (status.value === Status.Play) {
        ticker.value = startTicker();
      }
    }

    function reset() {
      stop();
      resetCycle();
    }

    watch(status, (value, _, onInvalidate) => {
      if (value === Status.Play) {
        ticker.value = startTicker();
        return;
      }
      if (ticker.value) {
        clearInterval(ticker.value);
      }

      onInvalidate(() => ticker.value && clearInterval(ticker.value));
    });

    onMounted(nextInterval);

    return {
      status,
      start,
      stop,
      cycle,
      skip,
      reset,
    };
  },
  components: { TheContainer, TheTimer, LayoutStack, TheControls },
  name: 'App',
});
</script>
