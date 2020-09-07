import { ref } from 'vue';

type TickerCallback = () => void;

export function useTicker(callback: TickerCallback, duration = 1000) {
  const ticker = ref<number>();

  function startTicker() {
    stop();
    ticker.value = setInterval(callback, duration);
  }

  function stopTicker() {
    ticker.value && clearInterval(ticker.value);
  }

  return {
    startTicker,
    stopTicker,
  };
}
