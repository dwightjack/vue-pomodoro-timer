<script setup lang="ts">
import { string } from 'vue-types';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseControl from '@/components/BaseControl.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { minutesToMs, getMinutes } from '@/utils';
import { IntervalType } from '@/types';

const type = defineModel<IntervalType>('type', {
  default: IntervalType.None,
});

const duration = defineModel<number>('duration', {
  get: getMinutes,
  set: minutesToMs,
  default: 0,
});

defineProps({
  id: string().isRequired,
});

defineEmits<{
  delete: [id?: string];
}>();
</script>
<template>
  <fieldset class="min-w-0">
    <legend class="sr-only">Interval Settings</legend>
    <LayoutInline class="items-center">
      <label class="grid grid-flow-col items-center">
        <select
          v-model="type"
          class="input pr-6 col-start-1 row-start-1 min-w-0 truncate"
        >
          <template v-for="(value, name) in IntervalType" :key="value">
            <option
              v-if="value !== IntervalType.None"
              :value="value"
              :selected="value === type"
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
          v-model.number="duration"
          class="input"
          type="number"
          min="1"
          max="60"
          :size="5"
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
