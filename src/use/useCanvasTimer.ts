import { MaybeRef, ref, unref } from 'vue';

const FAVICON_PATH = new Path2D(
  'M84 62.268C85.3333 63.0378 85.3333 64.9622 84 65.732L54 83.0526C52.6667 83.8224 51 82.8601 51 81.3205L51 46.6795C51 45.1399 52.6667 44.1776 54 44.9474L84 62.268Z',
);

export const FAVICON_SIZE = 128;

class CanvasTimer {
  #canvas?: HTMLCanvasElement;
  #ctx?: CanvasRenderingContext2D;

  setCanvas(canvas: HTMLCanvasElement) {
    this.#canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      this.#ctx = ctx;
    }
  }

  #drawTimer(
    color: string,
    center: number,
    radius: number,
    start = 0,
    end = 2 * Math.PI,
  ) {
    if (!this.#ctx) {
      return;
    }
    const ctx = this.#ctx;

    ctx.fillStyle = color;
    ctx.globalAlpha = 0.3;
    ctx.beginPath();
    ctx.arc(center, center, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(center, center);
    ctx.arc(center, center, radius, start, end);
    ctx.fill();

    ctx.fillStyle = 'white';
    ctx.fill(FAVICON_PATH);
  }

  async render(elapsedRatio: number): Promise<string> {
    if (!this.#ctx || !this.#canvas) {
      return '';
    }
    const color = window
      .getComputedStyle(this.#canvas)
      .getPropertyValue('color');

    // -90deg starting from the x axis
    const rotation = Math.PI / -2;
    // start angle + 360deg * elapsed ratio
    const start = rotation + 2 * Math.PI * elapsedRatio;
    // start angle + 360deg
    const end = rotation + 2 * Math.PI;

    this.#ctx.clearRect(0, 0, FAVICON_SIZE, FAVICON_SIZE);

    this.#drawTimer(color, FAVICON_SIZE / 2, FAVICON_SIZE / 2, start, end);

    const { promise, resolve } = Promise.withResolvers<string>();

    this.#canvas.toBlob((blob) => {
      if (blob) {
        resolve(URL.createObjectURL(blob));
      }
      resolve('');
    });

    return promise;
  }
}

export function useCanvasTimer() {
  const favicon = ref<HTMLLinkElement>();
  const originalFavicon = ref<HTMLLinkElement>();

  const canvasTimer = new CanvasTimer();

  async function renderCanvas(elapsed: number) {
    if (favicon.value) {
      favicon.value.href = await canvasTimer.render(elapsed);
    }
  }

  async function mountCanvas(
    canvasElement: MaybeRef<HTMLCanvasElement | null>,
  ) {
    const canvas = unref(canvasElement);
    const icon = document.querySelector<HTMLLinkElement>(
      'link[rel="icon"][type="image/svg+xml"]',
    );
    if (!icon || !canvas) {
      return;
    }
    originalFavicon.value = icon.cloneNode() as HTMLLinkElement;
    icon.type = 'image/png';
    favicon.value = icon;
    canvasTimer.setCanvas(canvas);
  }

  function restore() {
    if (!originalFavicon.value) {
      return;
    }
    favicon.value?.replaceWith(originalFavicon.value);
    favicon.value = undefined;
    originalFavicon.value = undefined;
  }

  return {
    renderCanvas,
    restore,
    mountCanvas,
  };
}
