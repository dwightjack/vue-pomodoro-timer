<template>
  <div
    class="grid grid-flow-col gap-2 items-center"
    role="group"
    aria-label="Timer controls"
  >
    <BaseControl :pressed="isPlaying" @click="$emit('play')">Play</BaseControl>
    <BaseControl :pressed="!isPlaying" @click="$emit('pause')"
      >Pause</BaseControl
    >
    <span class="mx-1 border-l border-blue-400 h-6" role="separator" />
    <BaseControl @click="$emit('skip')">Skip</BaseControl>
    <BaseControl @click="$emit('reset')">Reset</BaseControl>
  </div>
</template>
<script lang="ts">
import BaseControl from '@/components/BaseControl.vue';
import VueTypes from 'vue-types';
import { defineComponent, computed } from '@vue/composition-api';
import { Status } from '@/types';

export default defineComponent({
  setup(props) {
    const isPlaying = computed(() => props.status === Status.Play);

    return { isPlaying };
  },
  components: {
    BaseControl,
  },
  props: {
    status: VueTypes.oneOf(Object.values(Status)).def(Status.Pause),
  },
});
</script>
