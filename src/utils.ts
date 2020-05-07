export const toString = (v: number) => String(v).padStart(2, '0');
export const getMinutes = (v: number) => Math.floor((v / 1000 / 60) % 60);
export const getSeconds = (v: number) => Math.floor((v / 1000) % 60);

export function formatTime(ms: number) {
  const minutes = toString(getMinutes(ms));
  const seconds = toString(getSeconds(ms));
  return `${minutes}:${seconds}`;
}

// see https://www.w3.org/TR/2014/REC-html5-20141028/infrastructure.html#valid-duration-string
export function formatTimeDuration(ms: number) {
  const minutes = toString(getMinutes(ms));
  const seconds = toString(getSeconds(ms));
  return `PT${minutes}M${seconds}S`;
}
