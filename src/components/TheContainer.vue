<template>
  <main
    id="app"
    class="container mx-auto px-8 py-4 flex flex-col items-center justify-center min-h-screen"
  >
    <slot />
  </main>
</template>
<script lang="ts" setup>
// eslint-disable-next-line @typescript-eslint/no-explicit-any
defineSlots<{ default?: (props: any) => any }>();
</script>
