import { ref, watch } from '@vue/composition-api';

export function useStorage<T>(key: string, initial: T) {
  const item = localStorage.getItem(key);

  const value = ref<T>(item !== null ? JSON.parse(item) : initial);

  const unwatch = watch(value, (to) => {
    localStorage.setItem(key, JSON.stringify(to));
  });

  function remove() {
    localStorage.removeItem(key);
    stop();
  }

  return { value, unwatch, remove };
}
