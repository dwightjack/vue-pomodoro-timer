<template>
  <component
    class="c-base-icon inline-flex items-center fill-current"
    aria-hidden="true"
    :is="icon"
  />
</template>
<script lang="ts">
import { defineComponent, watch, shallowRef } from 'vue';
import { string } from 'vue-types';

export default defineComponent({
  setup(props) {
    const icon = shallowRef<unknown>();
    watch(
      () => props.name,
      async (name) => {
        if (!name) {
          icon.value = undefined;
        }
        try {
          icon.value = (await import(`@/assets/zondicons/${name}.svg`)).default;
        } catch (e) {
          console.error(e);
          icon.value = undefined;
        }
      },
      { immediate: true },
    );
    return { icon };
  },
  props: {
    name: string().isRequired,
  },
});
</script>
<style scoped>
.c-base-icon {
  width: 1em;
  height: 1em;
}
</style>
