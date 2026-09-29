type TickerCallback = () => void;

export function useTicker(callback: TickerCallback, duration = 1000) {
  const tickWorker = new Worker(new URL('../workers/tick', import.meta.url), {
    type: 'module',
  });
  function handler({ data }: MessageEvent) {
    if (data === 'tick') {
      callback();
    }
  }

  function stopTicker() {
    tickWorker.removeEventListener('message', handler);
    tickWorker.postMessage({ type: 'stop' });
  }

  function startTicker() {
    stopTicker();
    tickWorker.postMessage({ type: 'start', duration });
    tickWorker.addEventListener('message', handler);
  }

  return {
    startTicker,
    stopTicker,
  };
}
