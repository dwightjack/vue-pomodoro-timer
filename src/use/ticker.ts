type TickerCallback = () => void;

export function useTicker(
  worker: Worker,
  callback: TickerCallback,
  duration = 1000,
) {
  function handler({ data }: MessageEvent) {
    if (data === 'tick') {
      callback();
    }
  }

  function stopTicker() {
    worker.removeEventListener('message', handler);
    worker.postMessage({ type: 'stop' });
  }

  function startTicker() {
    stopTicker();
    worker.postMessage({ type: 'start', duration });
    worker.addEventListener('message', handler);
  }

  return {
    startTicker,
    stopTicker,
  };
}
