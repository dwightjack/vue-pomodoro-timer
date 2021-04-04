<template>
  <div>
    <h2 class="sr-only">Intervals</h2>
    <ul class="flex flex-wrap justify-center items-center gap-1">
      <IntervalSquare
        v-for="(interval, i) in cycle.intervals"
        :key="i"
        :type="interval.type"
        :duration="interval.duration"
        :current="cycle.current === i"
      />
    </ul>
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue';
import { object } from 'vue-types';
import IntervalSquare from '@/components/IntervalSquare.vue';
import { Cycle } from '@/types';

export default defineComponent({
  components: { IntervalSquare },
  props: {
    cycle: object<Cycle>().isRequired,
  },
});
</script>
