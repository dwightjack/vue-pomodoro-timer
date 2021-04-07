<template>
  <transition
    enter-class="opacity-0 transform -translate-y-2"
    enter-active-class="transition duration-200 delay-200"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 transform -translate-y-2"
  >
    <slot />
  </transition>
</template>
