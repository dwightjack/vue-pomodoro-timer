<script setup lang="ts">
import { ref, watch, unref } from 'vue';
import IntervalEditBox from '@/components/IntervalEditBox.vue';
import BaseButton from '@/components/BaseButton.vue';
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
      'overflow-hidden rounded-lg border border-blue-200 dark:border-sky-400'
    "
    :open="main.editOpen"
    @toggle.stop="$emit('toggled', ($event.target as HTMLDetailsElement).open)"
  >
    <summary
      class="cursor-pointer list-none rounded-sm py-1 text-center hover:bg-blue-100 dark:hover:bg-sky-800"
    >
      <BaseIcon name="wrench" />
      <span class="ml-1 align-middle">Settings</span>
    </summary>
    <LayoutStack
      tag="form"
      space="2"
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
        <BaseButton variant="ghost" @click="addInterval">
          <BaseIcon name="add-outline" />
          Add
        </BaseButton>
        <BaseButton variant="ghost" @click="onCancel">
          <BaseIcon name="close" />
          Cancel
        </BaseButton>
        <BaseButton variant="ghost" type="submit">
          <BaseIcon name="save-disk" />
          Save
        </BaseButton>
      </LayoutInline>
    </LayoutStack>
  </details>
</template>
