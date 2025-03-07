<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import IntervalEditBox from '@/components/IntervalEditBox.vue';
import BaseButton from '@/components/BaseButton.vue';
import BaseIcon from '@/components/BaseIcon.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { useCycle } from '@/stores/cycle';
import type { Interval } from '@/types';
import { bool } from 'vue-types';
import { clone } from '@/utils';

const cycle = useCycle();
const dialog = ref<HTMLDialogElement>();

const props = defineProps({
  open: bool().isRequired,
});

const emit = defineEmits<{
  toggled: [open: boolean];
  save: [intervals: Interval[]];
}>();

const intervalsRef = ref<Interval[]>([]);
const cancellable = computed(() => intervalsRef.value.length > 1);

function deleteInterval(deleteId?: string) {
  intervalsRef.value = intervalsRef.value.filter(({ id }) => deleteId !== id);
}

function onSubmit() {
  emit('save', clone(intervalsRef.value));
}

function onCancel() {
  intervalsRef.value = clone(cycle.intervals);
  emit('toggled', false);
}

function onToggle(toggle: boolean) {
  emit('toggled', toggle);
  if (toggle === true) {
    intervalsRef.value = clone(cycle.intervals);
    dialog.value?.showModal();
    return;
  }
  dialog.value?.close();
}

watch(() => props.open, onToggle);

function addInterval() {
  intervalsRef.value.push(cycle.createInterval());
}
</script>
<template>
  <dialog
    ref="dialog"
    class="m-auto bg-transparent"
    @close="() => onToggle(false)"
  >
    <LayoutStack
      v-show="open"
      tag="form"
      space="2"
      class="w-full rounded-lg border border-blue-200 bg-white px-4 py-2 dark:border-sky-400 dark:bg-stone-800"
      @submit.prevent="onSubmit"
    >
      <h2>Settings</h2>
      <IntervalEditBox
        v-for="interval in intervalsRef"
        :id="interval.id"
        :key="interval.id"
        v-model:type="interval.type"
        v-model:duration="interval.duration"
        :cancellable="cancellable"
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
  </dialog>
</template>
