<script setup lang="ts">
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
import TheGraphicTimer from '@/components/TheGraphicTimer.vue';
import TransitionFadeSlide from '@/components/transitions/FadeSlide.vue';

import { watch, onMounted } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { Status, Interval, IntervalType } from '@/types';
import { useMain } from '@/stores/main';
import { useCycle } from '@/stores/cycle';
import { useTicker } from '@/use/ticker';
import { useStorage } from '@/use/storage';
import { useNotification } from '@/use/notification';
import { useLoader } from '@/use/loader';
import { useAsyncModal } from '@/use/asyncModal';
import { setupNotifications, createInterval, ID_STORE } from './utils';

const tickWorker = new Worker('/tick-worker.js');

const { needRefresh, updateServiceWorker } = useRegisterSW();

const { exec, loading } = useLoader();
const intervalsStore = useStorage<Interval[]>('intervals', [
  createInterval(IntervalType.Work, 45),
]);
const permissionsStore = useStorage<{ notification?: boolean }>(
  'permissions',
  {},
);
const main = useMain();
const cycle = useCycle();

const { startTicker, stopTicker } = useTicker(tickWorker, cycle.countDown);

const { notify, askPermission } = useNotification();
const [notifyBarVisible, notifyBar] = useAsyncModal();

function skip() {
  stopTicker();
  cycle.nextInterval();
  if (main.isPlaying) {
    startTicker();
  }
}

function reset() {
  main.pause();
  cycle.resetCycle();
}

async function saveChanges(newIntervals: Interval[]) {
  reset();
  main.editOpen = false;
  cycle.updateCycle(newIntervals);
  exec(intervalsStore.save(newIntervals));
}

function onEditToggle(open: boolean) {
  main.editOpen = open;
}

async function initialize() {
  const storedIntervals = await exec(intervalsStore.load());
  // we use a function to create unique IDs,
  // but we need to exclude IDs generate in previous sessions
  // and stored in local storage
  ID_STORE.push(...storedIntervals.map(({ id }) => id));
  cycle.updateCycle(storedIntervals);
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

watch(
  () => main.status,
  (value, _, onInvalidate) => {
    onInvalidate(stopTicker);
    if (value === Status.Play) {
      startTicker();
      return;
    }
    stopTicker();
  },
);

watch(
  () => cycle.current,
  (_, prev) => {
    if (prev === -1 || !main.isPlaying) {
      return;
    }
    const { type, duration } = cycle.getCurrent();
    notifyInterval(type, duration);
  },
);

onMounted(initialize);
onMounted(checkNotifyPermission);
</script>

<template>
  <div role="presentation">
    <TheGraphicTimer v-if="cycle.currentInterval" />
    <TheNotificationBar>
      <TransitionFadeSlide>
        <BaseToast @cancel="notifyBar.cancel" @confirm="notifyBar.confirm">
          <p>Do you want to manage notification settings for this app?</p>
        </BaseToast>
      </TransitionFadeSlide>
      <TransitionFadeSlide>
        <BaseToast v-if="needRefresh" role="alert">
          <p>Application update available.</p>
          <BaseButton @click="updateServiceWorker()"> Update </BaseButton>
        </BaseToast>
      </TransitionFadeSlide>
    </TheNotificationBar>
    <TheContainer>
      <h1 class="sr-only">Pomodoro Timer</h1>
      <LayoutStack centered>
        <TheTimerList />

        <TheCycle />
        <TheControls
          :status="main.status"
          @play="main.play"
          @pause="main.pause"
          @skip="skip"
          @reset="reset"
        />
        <TheCycleEdit @save="saveChanges" @toggled="onEditToggle" />
      </LayoutStack>
    </TheContainer>
    <TheLoader :visible="loading" message="Loading..." />
  </div>
</template>
