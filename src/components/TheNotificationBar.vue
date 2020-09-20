<template>
  <transition
    name="fade-slide"
    enter-class="opacity-0 transform -translate-y-2"
    enter-active-class="transition duration-200 delay-200"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 transform -translate-y-2"
  >
    <div
      class="fixed inset-x-0 top-0 p-2 flex items-center space-x-2 text-sm bg-blue-600 text-white"
      role="status"
      aria-live="polite"
      v-show="visible"
    >
      <slot :visible="visible" :confirm="confirm" :cancel="cancel" />
      <template v-if="actions">
        <button
          type="button"
          class="c-the-notification-bar__btn"
          @click="confirm"
        >
          yes
        </button>
        <button
          type="button"
          class="c-the-notification-bar__btn"
          @click="cancel"
        >
          dismiss
        </button>
      </template>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent, ref, onBeforeUnmount } from 'vue';
import { bool } from 'vue-types';

export default defineComponent({
  setup(_, { emit }) {
    const resolver = ref<(v: boolean) => void>();
    const visible = ref(false);

    function confirm() {
      if (resolver.value) {
        resolver.value(true);
        resolver.value = undefined;
      }
    }

    function cancel() {
      if (resolver.value) {
        resolver.value(false);
        resolver.value = undefined;
      }
    }

    function show() {
      visible.value = true;
      return new Promise<boolean>((resolve) => {
        resolver.value = (v: boolean) => {
          resolve(v);
          emit(v ? 'confirm' : 'cancel');
          visible.value = false;
        };
      });
    }

    onBeforeUnmount(cancel);

    return {
      confirm,
      cancel,
      show,
      visible,
    };
  },
  props: {
    actions: bool().def(true),
  },
});
</script>
<style lang="postcss" scoped>
.c-the-notification-bar__btn {
  @apply bg-blue-700 px-2 py-1 transition-colors duration-75 rounded-sm;
}

.c-the-notification-bar__btn:hover {
  @apply bg-blue-800;
}
</style>
