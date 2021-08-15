<template>
  <LayoutInline
    role="group"
    class="items-center"
    aria-label="Timer controls"
    space="2"
  >
    <BaseControl @click="$emit(isPlaying ? 'pause' : 'play')">
      <BaseIcon :name="isPlaying ? 'pause' : 'play'" />
      <span class="sr-only">{{ isPlaying ? 'Pause' : 'Play' }}</span>
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
import { oneOf } from 'vue-types';
import { Status } from '@/types';
</script>
<script setup lang="ts">
import BaseControl from '@/components/BaseControl.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { computed } from 'vue';

const props = defineProps({
  status: oneOf(Object.values(Status)).def(Status.Pause),
});

defineEmits(['skip', 'reset', 'play', 'pause']);

const isPlaying = computed(() => props.status === Status.Play);
</script>
