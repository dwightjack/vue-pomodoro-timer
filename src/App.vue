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
import {
  defineComponent,
  watch,
  onMounted,
  ref,
  Ref,
} from '@vue/composition-api';
import { Status, Interval } from '@/types';
import { useStatus } from '@/use/status';
import { useCycle } from '@/use/cycle';
import { useTicker } from '@/use/ticker';
import { useStorage } from '@/use/storage';

export default defineComponent({
  setup() {
    const editOpen = ref(false);

    const { status, play, pause } = useStatus();
    let intervals: Ref<Interval[]>;

    const {
      cycle,
      resetCycle,
      nextInterval,
      countDown,
      updateCycle,
    } = useCycle();

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

    function saveChanges(newIntervals: Interval[]) {
      reset();
      updateCycle(newIntervals);
      intervals.value = newIntervals;
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

    onMounted(() => {
      ({ value: intervals } = useStorage<Interval[]>('intervals', []));
      updateCycle(intervals.value);
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
