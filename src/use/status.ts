import { ref } from '@vue/composition-api';
import { Status } from '@/types';

export function useStatus() {
  const status = ref<Status>(Status.Pause);

  function start() {
    status.value = Status.Play;
  }

  function stop() {
    status.value = Status.Pause;
  }

  return {
    status,
    stop,
    start,
  };
}
