<template>
  <LayoutInline
    role="group"
    class="items-center"
    aria-label="Timer controls"
    space="2"
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
  </LayoutInline>
</template>
<script lang="ts">
import BaseControl from '@/components/BaseControl.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import VueTypes from 'vue-types';
import { defineComponent, computed } from 'vue';
import { Status } from '@/types';

export default defineComponent({
  setup(props) {
    const isPlaying = computed(() => props.status === Status.Play);

    return { isPlaying };
  },
  components: {
    BaseControl,
    BaseIcon,
    LayoutInline,
  },
  props: {
    status: VueTypes.oneOf(Object.values(Status)).def(Status.Pause),
  },
});
</script>
