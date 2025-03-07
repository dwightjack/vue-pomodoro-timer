<script setup lang="ts">
import TheTimerList from '@/components/TheTimerList.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import TheControls from '@/components/TheControls.vue';
import TheCycle from '@/components/TheCycle.vue';
import TheCycleEdit from '@/components/TheCycleEdit.vue';
import TheNotificationBar from '@/components/TheNotificationBar.vue';
import BaseToast from '@/components/BaseToast.vue';
import BaseButton from '@/components/BaseButton.vue';
import TheGraphicTimer from '@/components/TheGraphicTimer.vue';
import TransitionFadeSlide from '@/components/transitions/FadeSlide.vue';

import { watch, onMounted, onBeforeUnmount } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { Status, Interval } from '@/types';
import { useMain } from '@/stores/main';
import { useCycle } from '@/stores/cycle';
import { useTicker } from '@/use/ticker';
import { useStorage } from '@vueuse/core';
import { useNotification } from '@/use/notification';
import { useAsyncModal } from '@/use/asyncModal';
import { setupNotifications } from './utils';

const tickWorker = new Worker(new URL('./workers/tick', import.meta.url), {
  type: 'module',
});

const { needRefresh, updateServiceWorker } = useRegisterSW();

const permissions = useStorage<{ notification?: boolean }>('permissions', {});
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
}

function onEditToggle(open: boolean) {
  main.editOpen = open;
}

async function checkNotifyPermission() {
  if (permissions.value.notification !== undefined) {
    return;
  }
  const confirmed = await notifyBar.show();
  permissions.value.notification = confirmed;

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

onMounted(checkNotifyPermission);
onMounted(reset);
onBeforeUnmount(() => tickWorker.postMessage({ type: 'stop' }));
</script>

<template>
  <TheGraphicTimer v-if="cycle.currentInterval" />
  <TheNotificationBar>
    <TransitionFadeSlide>
      <BaseToast
        v-if="notifyBarVisible"
        controls
        @cancel="notifyBar.cancel"
        @confirm="notifyBar.confirm"
      >
        <p>Do you want to manage notification settings for this app?</p>
      </BaseToast>
    </TransitionFadeSlide>
    <TransitionFadeSlide>
      <BaseToast v-if="needRefresh">
        <p>Application update available.</p>
        <BaseButton
          variant="secondary"
          size="sm"
          @click="updateServiceWorker()"
        >
          Update
        </BaseButton>
      </BaseToast>
    </TransitionFadeSlide>
  </TheNotificationBar>
  <main
    class="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-4 sm:px-8"
  >
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
        @settings="main.editOpen = !main.editOpen"
      />
      <TheCycleEdit
        :open="main.editOpen"
        @save="saveChanges"
        @toggled="onEditToggle"
      />
    </LayoutStack>
    <slot />
  </main>
</template>
