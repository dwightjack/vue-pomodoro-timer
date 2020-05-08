<template>
  <transition-group name="timer" tag="div" class="grid grid-rows-1 grid-cols-1">
    <BaseTimer
      v-for="(interval, i) in intervals"
      :key="i"
      :duration="interval.remaining"
      v-show="i === current"
      :type="interval.type"
      class="row-start-1 col-start-1"
    />
  </transition-group>
</template>
<script lang="ts">
import Vue from 'vue';
import VueTypes from 'vue-types';
import BaseTimer from '@/components/BaseTimer.vue';

export default Vue.extend({
  props: {
    intervals: VueTypes.arrayOf(Object).def([]),
    current: VueTypes.integer.def(0),
  },
  components: {
    BaseTimer,
  },
});
</script>
<style lang="postcss" scoped>
.timer-enter-active,
.timer-leave-active {
  @apply transition-all duration-500 ease-in-out;
}
.timer-enter {
  @apply transform translate-y-2 opacity-0;
}
.timer-leave-to {
  @apply transform -translate-y-2 opacity-0;
}
</style>
