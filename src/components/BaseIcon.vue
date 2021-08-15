<template>
  <component
    :is="icon"
    class="c-base-icon inline-flex items-center fill-current"
    aria-hidden="true"
  />
</template>
<script setup lang="ts">
import { watch, shallowRef } from 'vue';
import type { Component } from 'vue'
import { oneOf } from 'vue-types';

const icons = import.meta.glob(
  '../assets/zondicons/{trash,pause,fast-forward,reload,wrench,add-outline,close,save-disk,cheveron-down,play}.svg',
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
})

const icon = shallowRef<Component>();

watch(
  () => props.name,
  async (name) => {
    if (!name) {
      icon.value = undefined;
    }
    try {
      icon.value = (
        await icons[`../assets/zondicons/${name}.svg`]()
      ).default;
    } catch (e) {
      console.error(e);
      icon.value = undefined;
    }
  },
  { immediate: true },
);
</script>
<style scoped>
.c-base-icon {
  width: 1em;
  height: 1em;
}
</style>
