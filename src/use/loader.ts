import { ref, computed } from '@vue/composition-api';

export function useLoader() {
  const pending = ref(0);
  const loading = computed(() => !!pending.value);

  async function exec<T>(promise: Promise<T>) {
    pending.value += 1;
    try {
      return await promise;
    } finally {
      const next = pending.value - 1;
      pending.value = Math.max(next, 0);
    }
  }

  return { exec, loading };
}
