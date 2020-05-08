<template>
  <span class="c-base-icon" aria-hidden="true" :is="icon" />
</template>
<script lang="ts">
import { defineComponent, watch, ref } from '@vue/composition-api';
import VueTypes from 'vue-types';
export default defineComponent({
  setup(props) {
    const icon = ref<unknown>();
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
    );
    return { icon };
  },
  props: {
    name: VueTypes.string.isRequired,
  },
});
</script>
<style scoped>
.c-base-icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  fill: currentColor;
}
</style>
