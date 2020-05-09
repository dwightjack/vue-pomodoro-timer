<template>
  <LayoutInline tag="ul" space="1">
    <IntervalSquare
      v-for="(interval, i) in cycle.intervals"
      :key="i"
      v-bind="interval"
      :current="cycle.current === i"
    />
  </LayoutInline>
</template>
<script lang="ts">
import { defineComponent } from '@vue/composition-api';
import VueTypes from 'vue-types';
import IntervalSquare from '@/components/IntervalSquare.vue';
import LayoutInline from '@/components/LayoutInline.vue';

export default defineComponent({
  props: {
    cycle: VueTypes.object.isRequired,
  },
  components: { IntervalSquare, LayoutInline },
});
</script>
