let interval;

function stop() {
  interval && clearInterval(interval);
}

self.addEventListener(
  'message',
  function ({ data }) {
    if (data.type === 'start') {
      stop();
      interval = setInterval(() => {
        self.postMessage('tick');
      }, data.duration);
    } else if (data.type === 'stop') {
      stop();
    }
  },
  false,
);
