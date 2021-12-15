<template>
  <!-- hack for volar to accept toggle event -->
  <component
    :is="'details'"
    class="w-full"
    :class="
      main.editOpen && 'border rounded-lg overflow-hidden border-blue-200'
    "
    :open="main.editOpen"
    @toggle.stop="$emit('toggled', $event.target.open)"
  >
    <summary
      class="
        py-1
        list-none
        text-gray-700 text-center
        cursor-pointer
        hover:bg-blue-100
        rounded
      "
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
        :key="interval.id"
        :interval="interval"
        @update="update"
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
  </component>
</template>
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

const emit = defineEmits(['save', 'toggled']);
const intervalsRef = ref<Interval[]>([...unref(cycle.intervals)]);

function update(interval: Interval) {
  intervalsRef.value = intervalsRef.value.map((int) =>
    int.id === interval.id ? interval : int,
  );
}

function deleteInterval(deleteId: string) {
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
    intervalsRef.value = newIntervals;
  },
);
</script>
