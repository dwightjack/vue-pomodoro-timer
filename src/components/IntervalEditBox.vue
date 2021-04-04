<template>
  <fieldset class="min-w-0">
    <legend class="sr-only">Interval Settings</legend>
    <LayoutInline class="items-center">
      <label class="grid grid-flow-col items-center">
        <select
          v-model="typeRef"
          class="c-interval-edit-box__input pr-6 col-start-1 row-start-1 min-w-0 truncate"
          @change="onInput"
        >
          <option
            v-for="(value, name) in IntervalType"
            :key="value"
            :value="value"
            :selected="value === interval.type"
          >
            {{ name }}
          </option>
        </select>
        <BaseIcon
          name="cheveron-down"
          class="pointer-events-none col-start-1 row-start-1 ml-auto mr-1"
        />
        <span class="sr-only">Type</span>
      </label>
      <label class="flex items-center">
        <input
          v-model="durationRef"
          class="c-interval-edit-box__input"
          type="number"
          min="1"
          max="60"
          :size="5"
          @input="onInput"
        />
        <span class="sr-only">Duration</span>
        <span class="text-sm pl-1">mins</span>
      </label>
      <BaseControl @click="$emit('delete', interval.id)">
        <BaseIcon name="trash" />
        <span class="sr-only">Delete</span>
      </BaseControl>
    </LayoutInline>
  </fieldset>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from 'vue';
import { string, integer, oneOf, shape } from 'vue-types';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseControl from '@/components/BaseControl.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { Interval, IntervalType } from '@/types';
import { minutesToMs, getMinutes } from '@/utils';

export default defineComponent({
  components: {
    BaseControl,
    BaseIcon,
    LayoutInline,
  },
  props: {
    interval: shape<Interval>({
      type: oneOf(Object.values(IntervalType)),
      duration: integer(),
      id: string().isRequired,
      remaining: integer(),
    }).def({}),
  },
  emits: ['delete', 'update'],
  setup(props, { emit }) {
    const typeRef = ref<IntervalType>(props.interval.type ?? IntervalType.None);
    const durationRef = ref(getMinutes(props.interval.duration || 0));

    watch(
      () => props.interval.type,
      (type) => (typeRef.value = type),
    );
    watch(
      () => props.interval.duration,
      (duration) => (durationRef.value = getMinutes(duration || 0)),
    );

    function onInput() {
      const payload: Interval = {
        ...props.interval,
        type: typeRef.value as IntervalType,
        duration: minutesToMs(durationRef.value),
      };
      return emit('update', payload);
    }

    return { IntervalType, typeRef, durationRef, onInput };
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
