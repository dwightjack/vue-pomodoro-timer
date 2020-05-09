<template>
  <TheContainer>
    <LayoutStack centered>
      <TheTimerList v-bind="cycle" />

      <TheCycle :cycle="cycle" />
      <TheControls
        @play="play"
        @pause="pause"
        @skip="skip"
        @reset="reset"
        :status="status"
      />
      <TheCycleEdit
        :intervals="cycle.intervals"
        @save="saveChanges"
        @toggle="onEditToggle"
        :open="editOpen"
      />
    </LayoutStack>
  </TheContainer>
</template>

<script lang="ts">
import TheContainer from '@/components/TheContainer.vue';
import TheTimerList from '@/components/TheTimerList.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import TheControls from '@/components/TheControls.vue';
import TheCycle from '@/components/TheCycle.vue';
import TheCycleEdit from '@/components/TheCycleEdit.vue';
import { defineComponent, watch, onMounted, ref } from '@vue/composition-api';
import { Status, IntervalType, Interval } from '@/types';
import { useStatus } from '@/use/status';
import { useCycle } from '@/use/cycle';
import { useTicker } from '@/use/ticker';
import { createInterval } from '@/utils';

export default defineComponent({
  setup() {
    const work = createInterval(IntervalType.Work, 10);
    const shortBreak = createInterval(IntervalType.ShortBreak, 20);
    const work2 = createInterval(IntervalType.Work, 10);
    const longBreak = createInterval(IntervalType.LongBreak, 30);
    const editOpen = ref(false);

    const { status, play, pause } = useStatus();

    const {
      cycle,
      resetCycle,
      nextInterval,
      countDown,
      updateCycle,
    } = useCycle([work, shortBreak, work2, longBreak]);

    const { startTicker, stopTicker } = useTicker(countDown);

    function skip() {
      stopTicker();
      nextInterval();
      if (status.value === Status.Play) {
        startTicker();
      }
    }

    function reset() {
      pause();
      resetCycle();
    }

    function saveChanges(intervals: Interval[]) {
      reset();
      updateCycle(intervals);
      editOpen.value = false;
    }

    function onEditToggle(open: boolean) {
      editOpen.value = open;
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
      play,
      pause,
      cycle,
      skip,
      reset,
      saveChanges,
      editOpen,
      onEditToggle,
    };
  },
  components: {
    TheContainer,
    TheTimerList,
    LayoutStack,
    TheControls,
    TheCycleEdit,
    TheCycle,
  },
  name: 'App',
});
</script>
