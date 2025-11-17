<script setup lang="ts">
import { computed } from 'vue';
import { oneOf } from 'vue-types';
import BaseControl from '@/components/BaseControl.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { Status } from '@/types';
import { useMain } from '@/stores/main';
import IconPlay from '~icons/zondicons/play';
import IconPause from '~icons/zondicons/pause';
import IconReload from '~icons/zondicons/reload';
import IconWrench from '~icons/zondicons/wrench';
import IconFastForward from '~icons/zondicons/fast-forward';

defineEmits<{
  play: [];
  pause: [];
  skip: [];
  reset: [];
  settings: [];
}>();

const main = useMain();

const { status } = defineProps({
  status: oneOf(Object.values(Status)).def(Status.Pause),
});
const isPlaying = computed(() => status === Status.Play);
</script>
<template>
  <LayoutInline tag="fieldset" vertical-align="center" space="2">
    <legend class="sr-only">Timer controls</legend>
    <BaseControl
      :icon="isPlaying ? IconPause : IconPlay"
      @click="isPlaying ? $emit('pause') : $emit('play')"
    >
      {{ isPlaying ? 'Pause' : 'Play' }}
    </BaseControl>

    <BaseControl :icon="IconFastForward" @click="$emit('skip')">
      Skip
    </BaseControl>
    <BaseControl :icon="IconReload" @click="$emit('reset')">
      Reset
    </BaseControl>
    <BaseControl
      :icon="IconWrench"
      :pressed="main.editOpen"
      @click="main.toggleEdit()"
    >
      Settings
    </BaseControl>
  </LayoutInline>
</template>
