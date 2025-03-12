<script setup lang="ts">
import { computed, ref, useTemplateRef, watch } from 'vue';
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

const { open } = defineProps({
  open: bool().isRequired,
});

const emit = defineEmits<{
  toggled: [open: boolean];
  save: [intervals: Interval[]];
}>();

const cancellable = computed(() => intervalsRef.value.length > 1);

const intervalsRef = ref<Interval[]>([]);

function deleteInterval(deleteId?: string) {
  intervalsRef.value = intervalsRef.value.filter(({ id }) => deleteId !== id);
}
function addInterval() {
  intervalsRef.value.push(cycle.createInterval());
}

function close() {
  emit('toggled', false);
}

function submit() {
  emit('save', clone(intervalsRef.value));
  close();
}

const dialog = useTemplateRef('dialog');
watch(
  () => open,
  (open: boolean) => {
    if (open === true) {
      intervalsRef.value = clone(cycle.intervals);
      dialog.value?.showModal();
      return;
    }
    dialog.value?.close();
  },
);
</script>
<template>
  <dialog ref="dialog" class="m-auto bg-transparent" @close="close">
    <LayoutStack
      v-show="open"
      tag="form"
      space="1"
      class="w-full rounded-lg border border-blue-200 bg-white px-4 py-2 dark:border-sky-400 dark:bg-stone-800"
      @submit.prevent="submit"
    >
      <h2 class="self-center text-lg">
        <BaseIcon name="wrench" class="align-middle" />
        Settings
      </h2>
      <div class="space-y-1 px-4 py-2">
        <IntervalEditBox
          v-for="interval in intervalsRef"
          :id="interval.id"
          :key="interval.id"
          v-model:type="interval.type"
          v-model:duration="interval.duration"
          :cancellable="cancellable"
          @delete="deleteInterval"
        />
      </div>
      <LayoutInline :space="3" centered class="mt-2">
        <BaseButton variant="ghost" @click="addInterval">
          <BaseIcon name="add-outline" />
          Add
        </BaseButton>
        <BaseButton variant="ghost" @click="close">
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
