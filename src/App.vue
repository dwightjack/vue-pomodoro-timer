<script setup lang="ts">
import TheTimerList from '@/components/TheTimerList.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import TheControls from '@/components/TheControls.vue';
import TheCycle from '@/components/TheCycle.vue';
import TheCycleEdit from '@/components/TheCycleEdit.vue';
import BaseToast from '@/components/BaseToast.vue';
import BaseButton from '@/components/BaseButton.vue';
import TheGraphicTimer from '@/components/TheGraphicTimer.vue';
import TheTimerLabel from '@/components/TheTimerLabel.vue';
import TransitionFadeSlide from '@/components/transitions/FadeSlide.vue';

import {
  watch,
  onMounted,
  onBeforeUnmount,
  watchEffect,
  onWatcherCleanup,
} from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { Status, Interval, IntervalType } from '@/types';
import { useMain } from '@/stores/main';
import { useCycle } from '@/stores/cycle';
import { useTicker } from '@/use/ticker';
import { useNotification } from '@/use/notification';
import { useAsyncModal } from '@/use/asyncModal';
import { setupNotifications, toTitleCase } from './utils';

const { needRefresh, updateServiceWorker } = useRegisterSW();

const main = useMain();
const cycle = useCycle();

const { startTicker, stopTicker } = useTicker(cycle.countDown);
onBeforeUnmount(stopTicker);
watch(
  () => main.status,
  (status) => {
    onWatcherCleanup(stopTicker);
    if (status === Status.Play) {
      startTicker();
      return;
    }
    stopTicker();
  },
);

const { notify, checkNotifyPermission } = useNotification();
const [notifyBarVisible, notifyBar] = useAsyncModal();
const notifyInterval = setupNotifications(notify);
onMounted(() => checkNotifyPermission(notifyBar.show));

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
onMounted(reset);

async function saveChanges(newIntervals: Interval[]) {
  reset();
  cycle.updateCycle(newIntervals);
}

const transitions = [
  'bg-circle',
  'bg-from-topright',
  'bg-from-top',
  'bg-from-center',
];

function changeBg(type: IntervalType) {
  document.body.dataset.interval = type;
  document.documentElement.style.setProperty(
    '--bg-animation',
    transitions[Math.floor(Math.random() * transitions.length)],
  );
}

watch(
  () => cycle.currentInterval,
  (interval) => {
    changeBg(interval.type);
    if (!main.isPlaying) {
      return;
    }
    notifyInterval(interval.type, interval.duration);
  },
  { immediate: true },
);

watchEffect(() => {
  document.title = `${toTitleCase(cycle.currentInterval.type)} interval, ${main.isPlaying ? 'Playing' : 'Paused'} - Pomodoro Timer`;
});
</script>

<template>
  <TheGraphicTimer v-if="cycle.currentInterval" />
  <div
    class="view-transition-[status] fixed inset-x-0 top-0 z-10 divide-y divide-blue-100"
    role="status"
  >
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
  </div>
  <main
    class="view-transition-[main] container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-4 sm:px-8"
  >
    <h1 class="sr-only">Pomodoro Timer</h1>
    <TheTimerLabel />
    <LayoutStack centered class="delay-500 duration-500 starting:opacity-0">
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
        @toggled="main.toggleEdit"
      />
    </LayoutStack>
  </main>
</template>
