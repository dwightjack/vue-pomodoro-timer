<script setup lang="ts">
import { integer } from 'vue-types';
import { computed } from 'vue';
import { formatTime } from '@/utils';

const { remaining } = defineProps({
  remaining: integer().def(0),
});

const time = computed(() => formatTime(remaining));
</script>
<template>
  <div
    role="timer"
    aria-label="Interval countdown"
    class="rounded-lg border-4 px-8 py-4 text-4xl leading-14 tabular-nums"
  >
    {{ time }}
  </div>
</template>
