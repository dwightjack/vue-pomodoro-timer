<template functional>
  <div
    class="grid grid-col-1"
    v-bind="data.attrs"
    :class="{
      'c-layout-stack--centered': props.centered,
      [`gap-${props.space}`]: props.space,
    }"
  >
    <slot />
  </div>
</template>
<script lang="ts">
import Vue from 'vue';
import VueTypes from 'vue-types';

export default Vue.extend({
  props: {
    centered: VueTypes.bool.def(false),
    space: VueTypes.integer.def(4),
  },
});
</script>
<style scoped>
.c-layout-stack--centered {
  justify-items: center;
}
</style>
