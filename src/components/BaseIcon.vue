<script setup lang="ts">
import { watch, shallowRef } from 'vue';
import type { Component } from 'vue';

const icons = import.meta.glob<{ default: Component }>(
  '../assets/zondicons/{trash,pause,fast-forward,reload,wrench,add-outline,close,save-disk,cheveron-down,play}.svg',
  {
    import: 'default',
  },
);

const props = defineProps({
  name: oneOf([
    'trash',
    'pause',
    'fast-forward',
    'reload',
    'wrench',
    'add-outline',
    'close',
    'save-disk',
    'cheveron-down',
    'play',
  ] as const).isRequired,
});

const icon = shallowRef<Component>();

watch(
  () => props.name,
  async (name) => {
    if (!name) {
      icon.value = undefined;
    }
    try {
      icon.value = await icons[`../assets/zondicons/${name}.svg`]();
    } catch (e) {
      console.error(e);
      icon.value = undefined;
    }
  },
  { immediate: true },
);
</script>
<template>
  <component
    :is="icon"
    class="inline-flex items-center fill-current w-[1em] aspect-square"
    aria-hidden="true"
  />
</template>
<script lang="ts">
import { oneOf } from 'vue-types';
</script>
