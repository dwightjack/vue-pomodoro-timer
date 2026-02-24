<script setup lang="ts">
import { computed, ref, useId, useTemplateRef, watch } from 'vue';
import IntervalEditBox from '@/components/IntervalEditBox.vue';
import BaseButton from '@/components/BaseButton.vue';
import LayoutStack from '@/components/LayoutStack.vue';
import LayoutInline from '@/components/LayoutInline.vue';
import { useCycle } from '@/stores/cycle';
import type { Interval } from '@/types';
import { bool } from 'vue-types';
import { clone } from '@/utils';
import IconWrench from '~icons/zondicons/wrench';
import IconClose from '~icons/zondicons/close';
import IconAddOutline from '~icons/zondicons/add-outline';
import IconSaveDisk from '~icons/zondicons/save-disk';

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
    class="view-transition-[settings] m-auto h-full max-h-none w-full max-w-none translate-y-2 bg-transparent p-5 text-gray-700 opacity-0 transition-all transition-discrete duration-500 backdrop:opacity-0 backdrop:backdrop-blur-xs backdrop:transition-all backdrop:transition-discrete backdrop:duration-500 open:flex open:translate-0 open:opacity-100 open:backdrop:opacity-100 md:h-fit md:max-h-[80vh] md:w-fit starting:open:translate-y-2 starting:open:opacity-0 starting:open:backdrop:opacity-0"
    closedby="any"
    @close="close"
  >
    <LayoutStack
      tag="form"
      method="dialog"
      centered
      space="1"
      class="flex w-full flex-col rounded-lg border-4 border-white bg-white/80 px-4 py-2"
      @submit="submit"
    >
      <h1 :id="id + `-title`" class="self-center text-lg">
        <IconWrench class="align-middle" />
        Settings
      </h1>
      <div class="w-full space-y-3 overflow-y-auto px-4 py-2">
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

      <LayoutInline :space="3" class="mt-auto">
        <BaseButton @click="addInterval">
          <IconAddOutline name="add-outline" />
          Add
        </BaseButton>
        <BaseButton @click="close">
          <IconClose />
          Cancel
        </BaseButton>
        <BaseButton type="submit">
          <IconSaveDisk />
          Save
        </BaseButton>
      </LayoutInline>
    </LayoutStack>
  </dialog>
</template>
