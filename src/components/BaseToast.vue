<script setup lang="ts">
import { bool, oneOf } from 'vue-types';
import BaseButton from '@/components/BaseButton.vue';

defineProps({
  role: oneOf(['status', 'alert'] as const).def('status'),
  controls: bool().def(false),
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
    <BaseButton @click="$emit('confirm')">yes</BaseButton>
    <BaseButton @click="$emit('cancel')">dismiss</BaseButton>
  </div>
</template>
