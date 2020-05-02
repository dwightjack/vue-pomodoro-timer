<template>
  <div class="p-4 bg-blue-100 rounded-lg grid grid-flow-col gap-2">
    <BaseControl :pressed="isPlaying" @click="$emit('start')"
      >Start</BaseControl
    >
    <BaseControl :pressed="!isPlaying" @click="$emit('stop')">Stop</BaseControl>
    <span class="mx-1 border-l border-blue-600" />
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
