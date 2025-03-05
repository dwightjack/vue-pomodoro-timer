<script lang="ts" setup>
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <main
    class="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 py-4 sm:px-8"
  >
    <slot />
  </main>
</template>
