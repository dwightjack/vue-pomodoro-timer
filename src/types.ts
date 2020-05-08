export enum Status {
  Play = 'play',
  Pause = 'pause',
}

export enum IntervalType {
  Work = 'work',
  ShortBreak = 'short-break',
  LongBreak = 'long-break',
}

export interface Interval {
  type: IntervalType;
  duration: number;
  remaining: number;
}

export interface Cycle {
  intervals: Interval[];
  current: number;
}
