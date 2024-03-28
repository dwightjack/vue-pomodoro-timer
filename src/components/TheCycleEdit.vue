<script setup lang="ts">
import { ref, watch, unref } from 'vue';
import IntervalEditBox from '@/components/IntervalEditBox.vue';
import BaseControl from '@/components/BaseControl.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { createInterval } from '@/utils';
import { useCycle } from '@/stores/cycle';
import { useMain } from '@/stores/main';
import type { Interval } from '@/types';

const cycle = useCycle();
const main = useMain();

const emit = defineEmits<{
  toggled: [open: boolean];
  save: [intervals: Interval[]];
}>();
const intervalsRef = ref<Interval[]>(cycle.intervals.map((i) => ({ ...i })));

function deleteInterval(deleteId?: string) {
  intervalsRef.value = intervalsRef.value.filter(({ id }) => deleteId !== id);
}

function onSubmit() {
  emit('save', [...intervalsRef.value]);
}

function onCancel() {
  intervalsRef.value = [...unref(cycle.intervals)];
  emit('toggled', false);
}

function addInterval() {
  intervalsRef.value = [...intervalsRef.value, createInterval()];
}

watch(
  () => cycle.intervals,
  (newIntervals) => {
    intervalsRef.value = newIntervals.map((i) => ({ ...i }));
  },
);
</script>
<template>
  <details
    class="w-full"
    :class="
      main.editOpen &&
      'border rounded-lg overflow-hidden border-blue-200 dark:border-sky-400'
    "
    :open="main.editOpen"
    @toggle.stop="$emit('toggled', $event.target.open)"
  >
    <summary
      class="py-1 list-none text-center cursor-pointer hover:bg-blue-100 dark:hover:bg-sky-800 rounded"
    >
      <BaseIcon name="wrench" />
      <span class="align-middle ml-1">Settings</span>
    </summary>
    <LayoutStack
      tag="form"
      space="1"
      class="px-4 py-2"
      @submit.prevent="onSubmit"
    >
      <IntervalEditBox
        v-for="interval in intervalsRef"
        :id="interval.id"
        :key="interval.id"
        v-model:type="interval.type"
        v-model:duration="interval.duration"
        @delete="deleteInterval"
      />
      <LayoutInline :space="3" centered class="mt-2">
        <BaseControl @click="addInterval">
          <BaseIcon name="add-outline" />
          <span class="align-middle">Add</span>
        </BaseControl>
        <BaseControl @click="onCancel">
          <BaseIcon name="close" />
          <span class="align-middle">Cancel</span>
        </BaseControl>
        <BaseControl type="submit">
          <BaseIcon name="save-disk" />
          <span class="align-middle">Save</span>
        </BaseControl>
      </LayoutInline>
    </LayoutStack>
  </details>
</template>
