<template>
  <fieldset class="min-w-0">
    <legend class="sr-only">Interval Settings</legend>
    <LayoutInline class="items-center">
      <label class="grid grid-flow-col items-center">
        <select
          v-model="typeRef"
          class="input pr-6 col-start-1 row-start-1 min-w-0 truncate"
          @change="onInput"
        >
          <template v-for="(value, name) in IntervalType" :key="value">
            <option
              v-if="value !== IntervalType.None"
              :value="value"
              :selected="value === interval.type"
            >
              {{ name }}
            </option></template
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
          v-model="durationRef"
          class="input"
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
<script setup lang="ts">
import { string, integer, oneOf, shape } from 'vue-types';
import { ref, watch } from 'vue';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseControl from '@/components/BaseControl.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { minutesToMs, getMinutes } from '@/utils';
import { IntervalType } from '@/types';
import type { Interval } from '@/types';

const props = defineProps({
  interval: shape<Interval>({
    type: oneOf(Object.values(IntervalType)),
    duration: integer(),
    id: string().isRequired,
    remaining: integer(),
  }).isRequired,
});

const emit = defineEmits<{
  delete: [id?: string];
  update: [payload: Interval];
}>();

const typeRef = ref<IntervalType>(props.interval.type ?? IntervalType.None);
const durationRef = ref(getMinutes(props.interval.duration || 0));

function onInput() {
  const payload: Interval = Object.assign({}, props.interval, {
    type: typeRef.value,
    duration: minutesToMs(durationRef.value),
  });
  return emit('update', payload);
}

watch(
  () => props.interval.type,
  (type = IntervalType.None) => (typeRef.value = type),
);
watch(
  () => props.interval.duration,
  (duration) => (durationRef.value = getMinutes(duration || 0)),
);
</script>
