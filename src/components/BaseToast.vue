<script setup lang="ts">
import { oneOf } from 'vue-types';
import BaseButton from '@/components/BaseButton.vue';

defineProps({
  role: oneOf(['status', 'alert'] as const).def('status'),
});
defineEmits<{
  confirm: [];
  cancel: [];
}>();
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <div
    class="p-2 flex items-center space-x-2 text-sm bg-blue-600 text-white"
    :role="role"
    aria-live="polite"
  >
    <slot />
    <BaseButton v-if="$attrs.onConfirm" @click="$emit('confirm')"
      >yes</BaseButton
    >
    <BaseButton v-if="$attrs.onCancel" @click="$emit('cancel')"
      >dismiss</BaseButton
    >
  </div>
</template>
