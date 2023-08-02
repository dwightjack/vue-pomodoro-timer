<template>
  <fieldset class="min-w-0">
    <legend class="sr-only">Interval Settings</legend>
    <LayoutInline class="items-center">
      <label class="grid grid-flow-col items-center">
        <select
          :value="type ?? IntervalType.None"
          class="input pr-6 col-start-1 row-start-1 min-w-0 truncate"
          @input="
            $emit('update:type', ($event.target as HTMLInputElement).value)
          "
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
          :value="getMinutes(duration ?? 0)"
          class="input"
          type="number"
          min="1"
          max="60"
          :size="5"
          @input="
            $emit(
              'update:duration',
              minutesToMs(
                Number(($event.target as HTMLInputElement).value || 0),
              ),
            )
          "
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
<script setup lang="ts">
import { string, integer, oneOf } from 'vue-types';
import BaseIcon from '@/components/BaseIcon.vue';
import BaseControl from '@/components/BaseControl.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { minutesToMs, getMinutes } from '@/utils';
import { IntervalType } from '@/types';

defineProps({
  type: oneOf(Object.values(IntervalType)),
  duration: integer(),
  id: string().isRequired,
});

defineEmits<{
  delete: [id?: string];
  'update:type': [type: IntervalType];
  'update:duration': [duration: number];
}>();
</script>
