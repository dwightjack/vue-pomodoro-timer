<template>
  <div role="presentation">
    <GraphicTimer v-if="currentInterval" v-bind="currentInterval" />
    <TheNotificationBar ref="notificationBarRef">
      <p>Do you want to manage notification settings for this app?</p>
    </TheNotificationBar>
    <TheContainer>
      <h1 class="sr-only">Pomodoro Timer</h1>
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
          @toggled="onEditToggle"
          :open="editOpen"
        />
      </LayoutStack>
    </TheContainer>
    <TheLoader :visible="loading" message="Loading..." />
  </div>
</template>

<script lang="ts">
import TheContainer from '@/components/TheContainer.vue';
import TheTimerList from '@/components/TheTimerList.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import TheControls from '@/components/TheControls.vue';
import TheCycle from '@/components/TheCycle.vue';
import TheCycleEdit from '@/components/TheCycleEdit.vue';
import TheLoader from '@/components/TheLoader.vue';
import TheNotificationBar from '@/components/TheNotificationBar.vue';
import GraphicTimer from '@/components/GraphicTimer.vue';

import { defineComponent, watch, onMounted, ref } from 'vue';
import { Status, Interval, IntervalType } from '@/types';
import { useStatus } from '@/use/status';
import { useCycle } from '@/use/cycle';
import { useTicker } from '@/use/ticker';
import { useStorage } from '@/use/storage';
import { useNotification } from '@/use/notification';
import { useLoader } from '@/use/loader';
import { setupNotifications, createInterval, ID_STORE } from './utils';

type NotificationBar = InstanceType<typeof TheNotificationBar>;

export default defineComponent({
  setup() {
    const editOpen = ref(false);
    const intervals = ref<Interval[]>([]);
    const notificationBarRef = ref<NotificationBar>();

    const { status, play, pause } = useStatus();
    const { exec, loading } = useLoader();
    const intervalsStore = useStorage<Interval[]>('intervals', [
      createInterval(IntervalType.Work, 45),
    ]);
    const permissionsStore = useStorage<{ notification?: boolean }>(
      'permissions',
      {},
    );

    const {
      cycle,
      getCurrent: getCurrentInterval,
      current: currentInterval,
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
      exec(intervalsStore.save(newIntervals));
    }

    function onEditToggle(open: boolean) {
      editOpen.value = open;
    }

    async function initialize() {
      const storedIntervals = await exec(intervalsStore.load());
      // we use a function to create unique IDs,
      // but we need to exclude IDs generate in previous sessions
      // and stored in local storage
      ID_STORE.push(...storedIntervals.map(({ id }) => id));
      intervals.value = storedIntervals;
      updateCycle(intervals.value);
    }

    async function checkNotifyPermission() {
      const permissions = await permissionsStore.load();
      if (permissions.notification !== undefined) {
        return;
      }
      const confirmed = await notificationBarRef.value?.show();
      permissionsStore.save({ ...permissions, notification: confirmed });

      if (confirmed) {
        askPermission();
      }
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
    onMounted(checkNotifyPermission);

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
      askPermission,
      notificationBarRef,
      currentInterval,
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
    TheNotificationBar,
    GraphicTimer,
  },
  name: 'App',
});
</script>
