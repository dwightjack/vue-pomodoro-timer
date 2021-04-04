import { ref } from 'vue';

type TickerCallback = () => void;

export function useTicker(callback: TickerCallback, duration = 1000) {
  const ticker = ref<number>();

  function stopTicker() {
    ticker.value && clearInterval(ticker.value);
  }

  function startTicker() {
    stopTicker();
    ticker.value = setInterval(callback, duration);
  }

  return {
    startTicker,
    stopTicker,
  };
}
