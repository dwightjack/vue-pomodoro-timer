<template>
  <main
    id="app"
    class="container mx-auto px-8 py-4 flex flex-col items-center justify-center min-h-screen"
  >
    <slot />
  </main>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({});
</script>
