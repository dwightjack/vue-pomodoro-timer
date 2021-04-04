<template>
  <div role="status">
    <transition
      name="opacity"
      enter-class="opacity-0"
      enter-active-class="transition-opacity duration-200"
      leave-active-class="transition-opacity duration-200"
      leave-to-class="opacity-0"
    >
      <div
        v-show="visible"
        aria-hidden="true"
        class="bg-opacity-75 bg-white fixed inset-0 flex items-center"
      >
        <div class="mx-auto w-40 bg-blue-500 h-2 c-the-loader-animate" />
      </div>
    </transition>

    <p v-if="visible" class="sr-only">{{ message }}</p>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { string, bool } from 'vue-types';

export default defineComponent({
  props: {
    message: string().def(''),
    visible: bool().def(false),
  },
});
</script>
<style scoped>
.c-the-loader-animate {
  animation-name: loader-animate;
  animation-duration: 1s;
  animation-timing-function: cubic-bezier(0.9, 0.05, 0.35, 0.97);
  animation-iteration-count: infinite;
  animation-fill-mode: forwards;
}

@keyframes loader-animate {
  0% {
    transform-origin: 0 0;
    transform: scaleX(0);
  }
  50% {
    transform-origin: 0 0;
    transform: scaleX(1);
  }
  51% {
    transform-origin: 100% 0;
    transform: scaleX(1);
  }
  100% {
    transform-origin: right;
    transform: scaleX(0);
  }
}
</style>
