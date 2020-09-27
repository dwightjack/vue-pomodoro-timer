import { ref, computed } from 'vue';

export function useLoader() {
  const pending = ref(0);
  const loading = computed(() => !!pending.value);

  async function exec<T>(promise: Promise<T>) {
    pending.value += 1;
    try {
      return await promise;
    } finally {
      pending.value = Math.max(pending.value - 1, 0);
    }
  }

  return { exec, loading };
}
