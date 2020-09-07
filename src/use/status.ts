import { ref } from 'vue';
import { Status } from '@/types';

export function useStatus() {
  const status = ref<Status>(Status.Pause);

  function play() {
    status.value = Status.Play;
  }

  function pause() {
    status.value = Status.Pause;
  }

  return {
    status,
    pause,
    play,
  };
}
