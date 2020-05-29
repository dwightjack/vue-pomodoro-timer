<template>
  <div>
    <h2 class="sr-only">Intervals</h2>
    <ul class="flex flex-wrap justify-center items-center -mt-1 -ml-1">
      <IntervalSquare
        v-for="(interval, i) in cycle.intervals"
        :key="i"
        v-bind="interval"
        :current="cycle.current === i"
        :aria-current="cycle.current === i"
        class="ml-1 mt-1"
      />
    </ul>
  </div>
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
