<script setup lang="ts">
import { bool, string } from 'vue-types';
import IconCheveronDown from '~icons/zondicons/cheveron-down';
import IconTrash from '~icons/zondicons/trash';
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
  cancellable: bool().def(false),
});

defineEmits<{
  delete: [id?: string];
}>();
</script>
<template>
  <fieldset
    class="min-w-0 rounded-lg p-2 text-white transition-colors"
    :class="{
      'bg-amber-700': type === IntervalType.Work,
      'bg-teal-700': type === IntervalType.ShortBreak,
      'bg-green-600': type === IntervalType.LongBreak,
    }"
  >
    <legend class="sr-only">Interval Settings</legend>
    <LayoutInline vertical-align="center">
      <label class="grid-overlap grid grow items-center text-gray-700">
        <select v-model="type" class="input min-w-0 truncate" name="type">
          <template v-for="(value, name) in IntervalType" :key="value">
            <option
              v-if="value !== IntervalType.None"
              :value
              :selected="value === type"
            >
              {{ name }}
            </option></template
          >
        </select>
        <IconCheveronDown class="pointer-events-none ms-auto me-1" />
        <span class="sr-only">Type</span>
      </label>
      <label class="flex items-center gap-1">
        <input
          v-model.number="duration"
          name="duration"
          class="input"
          type="number"
          min="1"
          max="60"
          :size="5"
        />
        <span class="sr-only">Duration</span>
        <span class="text-sm">mins</span>
      </label>
      <BaseControl
        :disabled="!cancellable"
        :icon="IconTrash"
        @click="$emit('delete', id)"
      >
        Delete
      </BaseControl>
    </LayoutInline>
  </fieldset>
</template>
