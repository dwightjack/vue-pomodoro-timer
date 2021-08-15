import { defineStore } from 'pinia';
import { Status } from '@/types';

export const useMain = defineStore('main', {
  state: () => ({
    status: Status.Pause,
    editOpen: false,
  }),

  getters: {
    isPlaying(): boolean {
      return this.status === Status.Play;
    },
  },

  actions: {
    play() {
      this.status = Status.Play;
    },

    pause() {
      this.status = Status.Pause;
    },
  },
});
