import { ref } from 'vue';

export function useAsyncModal() {
  const resolver = ref<(v: boolean) => void>();
  const visible = ref(false);

  function show() {
    visible.value = true;
    return new Promise<boolean>((resolve) => {
      resolver.value = (v: boolean) => {
        resolve(v);
        visible.value = false;
      };
    });
  }

  function confirm() {
    if (resolver.value) {
      resolver.value(true);
      resolver.value = undefined;
    }
  }

  function cancel() {
    if (resolver.value) {
      resolver.value(false);
      resolver.value = undefined;
    }
  }

  const methods = {
    confirm,
    cancel,
    show,
  };

  return [visible, methods] as const;
}
