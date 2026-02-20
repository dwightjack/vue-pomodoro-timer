<script setup lang="ts">
import TheTimerList from '@/components/TheTimerList.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import TheControls from '@/components/TheControls.vue';
import TheCycle from '@/components/TheCycle.vue';
import TheCycleEdit from '@/components/TheCycleEdit.vue';
import BaseToast from '@/components/BaseToast.vue';
import BaseButton from '@/components/BaseButton.vue';
import TheGraphicTimer from '@/components/TheGraphicTimer.vue';
import TransitionFadeSlide from '@/components/transitions/FadeSlide.vue';

import { watch, onMounted, onBeforeUnmount } from 'vue';
import { useRegisterSW } from 'virtual:pwa-register/vue';
import { Status, Interval, IntervalType } from '@/types';
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
  cycle.updateCycle(newIntervals);
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

const transitions = [
  [`circle(0 at 80% 20%)`, `circle(200vmax at 80% 20%)`],
  [
    `polygon(100% 0, 100% 0, 100% 0)`,
    `polygon(100% 0, -57.735% 0, 100% 273.205%)`,
  ],
  [
    `polygon(0 0, 100% 0, 100% 0, 0 0)`,
    `polygon(0 0, 100% 0, 100% 100%, 0 100%)`,
  ],
  [
    `shape(
    from 0 50%, hline to 100%, vline to 50%, hline to 0, vline to 50%,
    move to 0 50%, hline to 100%, vline to 50%, hline to 0, vline to 50%
  )`,
    `shape(
    from 0 0, hline to 100%, vline to 50%, hline to 0, vline to 0,
    move to 0 50%, hline to 100%, vline to 100%, hline to 0, vline to 50%
  )`,
  ],
];

function changeBg(type: IntervalType) {
  if (!document.startViewTransition) {
    document.body.dataset.interval = type;
    return;
  }
  document
    .startViewTransition(() => {
      document.body.dataset.interval = type;
    })
    .ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: transitions[Math.floor(Math.random() * transitions.length)],
        },
        {
          duration: 600,
          easing: 'cubic-bezier(0.85, 0.09, 0.15, 0.91)',
          delay: 150,
          fill: 'both',
          // Specify which pseudo-element to animate
          pseudoElement: '::view-transition-new(root)',
        },
      );
    });
}

watch(
  () => cycle.current,
  (_, prev) => {
    const { type, duration } = cycle.getCurrent();
    changeBg(type);
    if (prev === -1 || !main.isPlaying) {
      return;
    }
    notifyInterval(type, duration);
  },
);

onMounted(checkNotifyPermission);
onMounted(reset);
onMounted(() => changeBg(cycle.getCurrent().type));
onBeforeUnmount(() => tickWorker.postMessage({ type: 'stop' }));
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
        @toggled="main.toggleEdit"
      />
    </LayoutStack>
    <slot />
  </main>
</template>
