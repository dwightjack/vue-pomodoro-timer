<script setup lang="ts">
import { bool, string } from 'vue-types';
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
  cancellable: bool().def(false),
});

defineEmits<{
  delete: [id?: string];
}>();
</script>
<template>
  <fieldset class="w-full min-w-0">
    <legend class="sr-only">Interval Settings</legend>
    <LayoutInline vertical-align="center">
      <label class="grid-overlap grid grow items-center">
        <select v-model="type" class="input min-w-0 truncate">
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
          class="pointer-events-none ms-auto me-1"
        />
        <span class="sr-only">Type</span>
      </label>
      <label class="flex items-center gap-1">
        <input
          v-model.number="duration"
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
        icon="trash"
        @click="$emit('delete', id)"
      >
        Delete
      </BaseControl>
    </LayoutInline>
  </fieldset>
</template>
