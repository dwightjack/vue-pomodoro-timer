<template>
  <TheContainer>
    <LayoutStack centered>
      <TheTimer :duration="cycle.remaining" :type="currentType" />
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
import { defineComponent, watch, onMounted } from '@vue/composition-api';
import { Status, IntervalType, Interval } from '@/types';
import { useStatus } from '@/use/status';
import { useCycle } from '@/use/cycle';
import { useTicker } from '@/use/ticker';

const work: Interval = {
  type: IntervalType.Work,
  duration: 10 * 1000, // 10 secs
};
const shortBreak: Interval = {
  type: IntervalType.ShortBreak,
  duration: 20 * 1000, // 20 secs
};
const longBreak: Interval = {
  type: IntervalType.LongBreak,
  duration: 30 * 1000, // 20 secs
};

export default defineComponent({
  setup() {
    const { status, start, stop } = useStatus();

    const {
      cycle,
      resetCycle,
      nextInterval,
      countDown,
      currentType,
    } = useCycle([work, shortBreak, work, longBreak]);

    const { startTicker, stopTicker } = useTicker(countDown);

    function skip() {
      stopTicker();
      nextInterval();
      if (status.value === Status.Play) {
        startTicker();
      }
    }

    function reset() {
      stop();
      resetCycle();
    }

    watch(status, (value, _, onInvalidate) => {
      onInvalidate(stopTicker);
      if (value === Status.Play) {
        startTicker();
        return;
      }
      stopTicker();
    });

    onMounted(nextInterval);

    return {
      status,
      start,
      stop,
      cycle,
      skip,
      reset,
      currentType,
    };
  },
  components: { TheContainer, TheTimer, LayoutStack, TheControls },
  name: 'App',
});
</script>
