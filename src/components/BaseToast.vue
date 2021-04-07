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
<script lang="ts">
import { defineComponent } from 'vue';
import BaseButton from '@/components/BaseButton.vue';
import { func, oneOf } from 'vue-types';

export default defineComponent({
  components: {
    BaseButton,
  },
  props: {
    onConfirm: func(),
    onCancel: func(),
    role: oneOf(['status', 'alert']).def('status'),
  },
});
</script>
