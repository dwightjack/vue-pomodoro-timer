<script setup lang="ts">
import { bool } from 'vue-types';
import BaseButton from '@/components/BaseButton.vue';

defineProps({
  controls: bool().def(false),
});
defineEmits<{
  confirm: [];
  cancel: [];
}>();
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <div class="flex items-center gap-2 bg-blue-600 p-2 text-sm text-white">
    <slot />
    <template v-if="controls">
      <BaseButton variant="secondary" size="sm" @click="$emit('confirm')"
        >yes</BaseButton
      >
      <BaseButton variant="secondary" size="sm" @click="$emit('cancel')"
        >dismiss</BaseButton
      >
    </template>
  </div>
</template>
