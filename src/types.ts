export enum Status {
  Play = 'play',
  Pause = 'pause',
}

export enum IntervalType {
  Work = 'work',
  ShortBreak = 'short-break',
  LongBreak = 'long-break',
  None = 'none',
}

export interface Interval {
  type: IntervalType;
  duration: number;
  id: string;
}
