<script setup lang="ts">
import { computed } from 'vue';
import { oneOf } from 'vue-types';
import BaseControl from '@/components/BaseControl.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { Status } from '@/types';

const props = defineProps({
  status: oneOf(Object.values(Status)).def(Status.Pause),
});

defineEmits<{
  play: [];
  pause: [];
  skip: [];
  reset: [];
}>();

const isPlaying = computed(() => props.status === Status.Play);
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
    <span
      class="mx-1 h-6 border-l border-blue-400 dark:border-sky-400"
      role="separator"
    />
    <BaseControl icon="fast-forward" @click="$emit('skip')"> Skip </BaseControl>
    <BaseControl icon="reload" @click="$emit('reset')"> Reset </BaseControl>
  </LayoutInline>
</template>
