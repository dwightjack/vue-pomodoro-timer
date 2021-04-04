<template>
  <component
    :is="icon"
    class="c-base-icon inline-flex items-center fill-current"
    aria-hidden="true"
  />
</template>
<script lang="ts">
import { defineComponent, watch, shallowRef, Component } from 'vue';
import { oneOf } from 'vue-types';

const icons = import.meta.glob(
  '../assets/zondicons/{trash,pause,fast-forward,reload,wrench,add-outline,close,save-disk,cheveron-down,play}.svg',
);

export default defineComponent({
  props: {
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
  },
  setup(props) {
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
    return { icon };
  },
});
</script>
<style scoped>
.c-base-icon {
  width: 1em;
  height: 1em;
}
</style>
