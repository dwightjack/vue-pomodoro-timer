<script setup lang="ts">
import { computed } from 'vue';
import { oneOf } from 'vue-types';
import BaseControl from '@/components/BaseControl.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { Status } from '@/types';
import { useMain } from '@/stores/main';

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
      :icon="isPlaying ? 'pause' : 'play'"
      @click="isPlaying ? $emit('pause') : $emit('play')"
    >
      {{ isPlaying ? 'Pause' : 'Play' }}
    </BaseControl>

    <BaseControl icon="fast-forward" @click="$emit('skip')"> Skip </BaseControl>
    <BaseControl icon="reload" @click="$emit('reset')"> Reset </BaseControl>
    <BaseControl
      icon="wrench"
      :pressed="main.editOpen"
      @click="main.toggleEdit()"
    >
      Settings
    </BaseControl>
  </LayoutInline>
</template>
