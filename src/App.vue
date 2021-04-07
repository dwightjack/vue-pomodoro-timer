<template>
  <div role="presentation">
    <GraphicTimer
      v-if="currentInterval"
      :duration="currentInterval.duration"
      :remaining="currentInterval.remaining"
      :type="currentInterval.type"
    />
    <TheNotificationBar>
      <TransitionFadeSlide>
        <BaseToast
          v-if="notifyBarVisible"
          :on-cancel="notifyBar.cancel"
          :on-confirm="notifyBar.confirm"
        >
          <p>Do you want to manage notification settings for this app?</p>
        </BaseToast>
      </TransitionFadeSlide>
      <TransitionFadeSlide>
        <BaseToast v-if="needRefresh" role="alert">
          <p>Application update available.</p>
          <BaseButton @click="updateServiceWorker()">Update</BaseButton>
        </BaseToast>
      </TransitionFadeSlide>
    </TheNotificationBar>
    <TheContainer>
      <h1 class="sr-only">Pomodoro Timer</h1>
      <LayoutStack centered>
        <TheTimerList v-bind="cycle" />

        <TheCycle :cycle="cycle" />
        <TheControls
          :status="status"
          @play="play"
          @pause="pause"
          @skip="skip"
          @reset="reset"
        />
        <TheCycleEdit
          :intervals="cycle.intervals"
          :open="editOpen"
          @save="saveChanges"
          @toggled="onEditToggle"
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
import BaseToast from '@/components/BaseToast.vue';
import BaseButton from '@/components/BaseButton.vue';
import GraphicTimer from '@/components/GraphicTimer.vue';
import TransitionFadeSlide from '@/components/transitions/FadeSlide.vue';

import { defineComponent, watch, onMounted, ref } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { Status, Interval, IntervalType } from '@/types';
import { useStatus } from '@/use/status';
import { useCycle } from '@/use/cycle';
import { useTicker } from '@/use/ticker';
import { useStorage } from '@/use/storage';
import { useNotification } from '@/use/notification';
import { useLoader } from '@/use/loader';
import { useAsyncModal } from '@/use/asyncModal';
import { setupNotifications, createInterval, ID_STORE } from './utils';

export default defineComponent({
  name: 'App',
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
    BaseToast,
    BaseButton,
    TransitionFadeSlide,
  },
  setup() {
    const editOpen = ref(false);
    const intervals = ref<Interval[]>([]);
    const tickWorker = new Worker('/tick-worker.js');

    const { needRefresh, updateServiceWorker } = useRegisterSW();

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

    const { startTicker, stopTicker } = useTicker(tickWorker, countDown);

    const { notify, askPermission } = useNotification();
    const [notifyBarVisible, notifyBar] = useAsyncModal();

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
      const confirmed = await notifyBar.show();
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
      (_, prev) => {
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
      notifyBarVisible,
      notifyBar,
      currentInterval,
      needRefresh,
      updateServiceWorker,
    };
  },
});
</script>
