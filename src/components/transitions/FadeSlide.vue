<template>
  <Transition
    enter-from-class="opacity-0 -translate-y-2"
    enter-active-class="transition duration-200 delay-200"
    leave-active-class="transition duration-200"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <slot />
  </Transition>
</template>
