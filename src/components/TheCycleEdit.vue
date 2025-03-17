<script setup lang="ts">
import { computed, ref, useId, useTemplateRef, watch } from 'vue';
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
const id = useId();

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
  <dialog
    ref="dialog"
    :aria-labelledby="id + `-title`"
    class="m-auto translate-y-2 bg-transparent opacity-0 transition-all transition-discrete duration-500 backdrop:opacity-0 backdrop:transition-all backdrop:transition-discrete backdrop:duration-500 open:translate-0 open:opacity-100 open:backdrop:opacity-100 starting:open:translate-y-2 starting:open:opacity-0 starting:open:backdrop:opacity-0"
    @close="close"
  >
    <LayoutStack
      tag="form"
      method="dialog"
      space="1"
      class="w-full rounded-lg border border-blue-200 bg-white px-4 py-2 dark:border-sky-400 dark:bg-stone-800"
      @submit="submit"
    >
      <h1 :id="id + `-title`" class="self-center text-lg">
        <BaseIcon name="wrench" class="align-middle" />
        Settings
      </h1>
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
