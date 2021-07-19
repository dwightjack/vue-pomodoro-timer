import { uid } from 'uid';
import { IntervalType, Interval } from '@/types';

export const toString = (v: number) => String(v).padStart(2, '0');
export const getMinutes = (v: number) => Math.floor(v / 1000 / 60);
export const getSeconds = (v: number) => Math.floor((v / 1000) % 60);
export const minutesToMs = (v: number) => v * 60 * 1000;

export const ID_STORE: string[] = [];
export function uniqId() {
  let id = uid();
  let iterations = 10;
  while (ID_STORE.includes(id) && iterations) {
    id = uid();
    iterations -= 1;
  }
  ID_STORE.push(id);
  return id;
}

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

const pluralRules = new Intl.PluralRules('en');

// see https://2ality.com/2019/12/intl-pluralrules.html
export function pluralize(count: number, singular: string, plural: string) {
  const grammaticalNumber = pluralRules.select(count);
  switch (grammaticalNumber) {
    case 'one':
      return count + ' ' + singular;
    case 'other':
      return count + ' ' + plural;
    default:
      throw new Error('Unknown: ' + grammaticalNumber);
  }
}

export function toSpacedString(str: string) {
  return str.replace(/[-_]/g, ' ');
}

export function toTitleCase(str: string) {
  return toSpacedString(str).replace(/\b(\w)/g, (_, a) => a.toUpperCase());
}

export function createInterval(type = IntervalType.Work, mins = 0): Interval {
  return {
    type,
    duration: mins ? mins * 60 * 1000 : 0,
    remaining: 0,
    id: uniqId(),
  };
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function setupNotifications(notify: Function) {
  return (type: IntervalType, duration: number) => {
    const minutes = pluralize(getMinutes(duration), 'minute', 'minutes');

    if (IntervalType.Work === type) {
      notify('Time to work!', {
        body: `\nLet's get some work done for the next ${minutes}!`,
        requireInteraction: true,
      });
      return;
    }

    notify(
      `Time for a ${
        type === IntervalType.ShortBreak ? 'short' : 'long'
      } break!`,
      { body: `\nLet's rest for about ${minutes}!`, requireInteraction: false },
    );
  };
}

export function getIntervalTypeColor(type: IntervalType) {
  if (type === IntervalType.Work) {
    return 'text-orange-500';
  }
  if (type === IntervalType.ShortBreak) {
    return 'text-green-500';
  }
  if (type === IntervalType.LongBreak) {
    return 'text-green-700';
  }
  return 'text-blue-300';
}
