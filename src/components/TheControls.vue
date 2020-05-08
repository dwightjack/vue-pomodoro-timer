<template>
  <div
    class="grid grid-flow-col gap-2 items-center"
    role="group"
    aria-label="Timer controls"
  >
    <BaseControl :pressed="isPlaying" @click="$emit('play')">
      <BaseIcon name="play" />
      <span class="sr-only">Play</span>
    </BaseControl>
    <BaseControl :pressed="!isPlaying" @click="$emit('pause')">
      <BaseIcon name="pause" />
      <span class="sr-only">Pause</span>
    </BaseControl>
    <span class="mx-1 border-l border-blue-400 h-6" role="separator" />
    <BaseControl @click="$emit('skip')">
      <BaseIcon name="fast-forward" />
      <span class="sr-only">Skip</span>
    </BaseControl>
    <BaseControl @click="$emit('reset')">
      <BaseIcon name="reload" />
      <span class="sr-only">Reset</span>
    </BaseControl>
  </div>
</template>
<script lang="ts">
import BaseControl from '@/components/BaseControl.vue';
import BaseIcon from '@/components/BaseIcon.vue';
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
    BaseIcon,
  },
  props: {
    status: VueTypes.oneOf(Object.values(Status)).def(Status.Pause),
  },
});
</script>
