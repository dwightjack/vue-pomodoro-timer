<template functional>
  <button
    type="button"
    class="rounded p-2 text-white"
    :class="{
      'bg-blue-800': props.pressed,
      'bg-blue-600': !props.pressed,
    }"
    :aria-pressed="props.pressed"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <slot />
  </button>
</template>
<script lang="ts">
import Vue from 'vue';
import VueTypes from 'vue-types';

export default Vue.extend({
  props: {
    pressed: VueTypes.bool.def(false),
  },
});
</script>
