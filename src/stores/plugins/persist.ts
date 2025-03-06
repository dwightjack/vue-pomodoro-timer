import { useStorage } from '@/use/storage';
import { PiniaPluginContext } from 'pinia';
import { toRaw } from 'vue';

export function persistPlugin({ options, store }: PiniaPluginContext) {
  if (!options.persist) {
    return;
  }
  const storage = useStorage(store.$id, toRaw(store.$state));

  storage.load().then((newState) => {
    store.$patch(newState);
  });

  store.$subscribe((_, state) => {
    storage.save(toRaw(state));
  });
}

declare module 'pinia' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    // Persist to localStorage
    persist?: boolean;
  }
}
