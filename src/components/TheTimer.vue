<template>
  <div class="p-6 bg-blue-100 rounded-lg text-gray-800">
    <time class="c-the-timer__time text-4xl">{{ time }}</time>
  </div>
</template>
<script lang="ts">
import { defineComponent, computed } from '@vue/composition-api';
import VueTypes from 'vue-types';

const toString = (v: number) => String(v).padStart(2, '0');
const getMinutes = (v: number) => Math.floor((v / 1000 / 60) % 60);
const getSeconds = (v: number) => Math.floor((v / 1000) % 60);

export default defineComponent({
  setup(props) {
    const time = computed(() => {
      const minutes = toString(getMinutes(props.duration));
      const seconds = toString(getSeconds(props.duration));
      return `${minutes}:${seconds}`;
    });
    return { time };
  },
  props: {
    duration: VueTypes.integer.def(0),
  },
});
</script>
<style scoped>
.c-the-timer__time {
  font-variant-numeric: tabular-nums;
}
</style>
