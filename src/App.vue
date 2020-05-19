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
    <TheLoader :visible="loading" message="Loading..." />
  </TheContainer>
</template>

<script lang="ts">
import TheContainer from '@/components/TheContainer.vue';
import TheTimerList from '@/components/TheTimerList.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import TheControls from '@/components/TheControls.vue';
import TheCycle from '@/components/TheCycle.vue';
import TheCycleEdit from '@/components/TheCycleEdit.vue';
import TheLoader from '@/components/TheLoader.vue';
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
import { useNotification } from '@/use/notification';
import { useLoader } from '@/use/loader';
import { setupNotifications } from './utils';

export default defineComponent({
  setup() {
    const editOpen = ref(false);
    const intervals: Ref<Interval[]> = ref([]);
    const { status, play, pause } = useStatus();
    const { exec, loading } = useLoader();

    const { load: loadIntervals, save: saveIntervals } = useStorage<Interval[]>(
      'intervals',
      [],
    );

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

    async function saveChanges(newIntervals: Interval[]) {
      reset();
      editOpen.value = false;
      intervals.value = newIntervals;
      updateCycle(newIntervals);
      exec(saveIntervals(newIntervals));
    }

    function onEditToggle(open: boolean) {
      editOpen.value = open;
    }

    async function initialize() {
      intervals.value = await exec(loadIntervals());
      updateCycle(intervals.value);
      nextInterval();
    }

    const notifyInterval = setupNotifications(notify);

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

    onMounted(initialize);
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
      loading,
    };
  },
  components: {
    TheContainer,
    TheTimerList,
    LayoutStack,
    TheControls,
    TheCycleEdit,
    TheCycle,
    TheLoader,
  },
  name: 'App',
});
</script>
