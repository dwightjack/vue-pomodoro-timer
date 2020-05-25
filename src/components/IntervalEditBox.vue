<template>
  <fieldset class="min-w-0">
    <legend class="sr-only">{{ IntervalType[type] }} interval settings</legend>
    <LayoutInline class="items-center">
      <label class="grid grid-flow-col items-center">
        <select
          class="c-interval-edit-box__input pr-6 col-start-1 row-start-1 min-w-0 truncate"
          v-model="typeRef"
          @change="onInput"
        >
          <option
            v-for="(value, name) in IntervalType"
            :key="value"
            :value="value"
            :selected="value === type"
            >{{ name }}</option
          >
        </select>
        <BaseIcon
          name="cheveron-down"
          class="pointer-events-none col-start-1 row-start-1 ml-auto mr-1"
        />
        <span class="sr-only">Type</span>
      </label>
      <label class="flex items-center">
        <input
          class="c-interval-edit-box__input"
          type="number"
          min="1"
          max="60"
          size="5"
          v-model="durationRef"
          @input="onInput"
        />
        <span class="sr-only">Duration</span>
        <span class="text-sm pl-1">mins</span>
      </label>
      <BaseControl @click="$emit('delete', id)">
        <BaseIcon name="trash" />
        <span class="sr-only">Delete</span>
      </BaseControl>
    </LayoutInline>
  </fieldset>
</template>
<script lang="ts">
import { defineComponent, ref } from '@vue/composition-api';
import VueTypes from 'vue-types';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseControl from '@/components/BaseControl.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { IntervalType } from '@/types';
import { minutesToMs, getMinutes } from '@/utils';

export default defineComponent({
  setup(props, { emit }) {
    const typeRef = ref(props.type);
    const durationRef = ref(getMinutes(props.duration));

    function onInput() {
      return emit('change', {
        ...props,
        type: typeRef.value,
        duration: minutesToMs(durationRef.value),
      });
    }

    return { IntervalType, typeRef, durationRef, onInput };
  },
  props: {
    type: VueTypes.string.def(''),
    duration: VueTypes.integer.def(0),
    id: VueTypes.string.isRequired,
    remaining: VueTypes.integer.def(0),
  },
  components: {
    BaseControl,
    BaseIcon,
    LayoutInline,
  },
});
</script>
<style lang="postcss" scoped>
.c-interval-edit-box__input {
  @apply appearance-none bg-transparent border rounded-lg pl-2 py-1 text-gray-700;
}
.c-interval-edit-box__input[type='number'] {
  -moz-appearance: textfield;
}
.c-interval-edit-box__input[type='number']::-webkit-inner-spin-button {
  -webkit-appearance: none;
}
</style>
