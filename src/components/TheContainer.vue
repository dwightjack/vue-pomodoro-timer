<script lang="ts" setup>
defineSlots<{ default?: () => unknown }>();
</script>
<template>
  <main
    id="app"
    class="container mx-auto flex min-h-screen flex-col items-center justify-center px-8 py-4"
  >
    <slot />
  </main>
</template>
