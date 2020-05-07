<template>
  <ul class="grid grid-flow-col gap-1">
    <IntervalSquare
      v-for="(interval, i) in cycle.intervals"
      :key="i"
      v-bind="interval"
      :current="cycle.current === i"
    />
  </ul>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import VueTypes from 'vue-types';
import IntervalSquare from '@/components/IntervalSquare.vue';

export default defineComponent({
  props: {
    cycle: VueTypes.object.isRequired,
  },
  components: { IntervalSquare },
});
</script>
