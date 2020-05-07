<template functional>
  <button
    type="button"
    class="rounded p-2 text border-2 border-transparent text-blue-500 transition-colors duration-150"
    :class="{
      'bg-blue-200 hover:border-blue-500': props.pressed,
      'hover:bg-blue-100': !props.pressed,
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
