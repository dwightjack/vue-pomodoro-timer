<template>
  <div
    class="p-2 flex items-center space-x-2 text-sm bg-blue-600 text-white"
    :role="role"
    aria-live="polite"
  >
    <slot />
    <BaseButton v-if="onConfirm" @click="onConfirm">yes</BaseButton>
    <BaseButton v-if="onCancel" @click="onCancel">dismiss</BaseButton>
  </div>
</template>
<script setup lang="ts">
import { func, oneOf } from 'vue-types';
import BaseButton from '@/components/BaseButton.vue';

defineProps({
  onConfirm: func(),
  onCancel: func(),
  role: oneOf(['status', 'alert'] as const).def('status'),
});
// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineSlots<{ default?: (props: any) => any }>();
</script>
