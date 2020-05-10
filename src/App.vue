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
import { Status, Interval, IntervalType } from '@/types';
import { useStatus } from '@/use/status';
import { useCycle } from '@/use/cycle';
import { useTicker } from '@/use/ticker';
import { useStorage } from '@/use/storage';
import { useNotification } from '@/use/notification';
import { getMinutes, pluralize } from './utils';

export default defineComponent({
  setup() {
    const editOpen = ref(false);

    const { status, play, pause } = useStatus();
    let intervals: Ref<Interval[]>;

    const {
      cycle,
      getCurrent: getCurrentInterval,
      resetCycle,
      nextInterval,
      countDown,
      updateCycle,
    } = useCycle();

    const { startTicker, stopTicker } = useTicker(countDown);

    const { notify, askPermission } = useNotification();

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

    function notifyInterval(type: IntervalType, duration: number) {
      const minutes = pluralize(getMinutes(duration), 'minute', 'minutes');

      if (IntervalType.Work === type) {
        notify('Time to work!', {
          body: `\nLet's get some job done for the next ${minutes}!`,
        });
        return;
      }

      notify(
        `Time for a ${
          type === IntervalType.ShortBreak ? 'short' : 'long'
        } break!`,
        { body: `\nLet's rest for about ${minutes}!` },
      );
    }

    watch(status, (value, _, onInvalidate) => {
      onInvalidate(stopTicker);
      if (value === Status.Play) {
        startTicker();
        return;
      }
      stopTicker();
    });

    watch(
      () => cycle.current,
      (next, prev) => {
        if (prev === -1 || status.value !== Status.Play) {
          return;
        }
        const { type, duration } = getCurrentInterval();
        notifyInterval(type, duration);
      },
    );

    onMounted(() => {
      ({ value: intervals } = useStorage<Interval[]>('intervals', []));
      updateCycle(intervals.value);
    });

    onMounted(nextInterval);
    onMounted(askPermission);

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
