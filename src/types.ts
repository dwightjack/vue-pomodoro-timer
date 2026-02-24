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

export const IntervalTypeLabels = {
  [IntervalType.Work]: 'Work',
  [IntervalType.ShortBreak]: 'Short Break',
  [IntervalType.LongBreak]: 'Bong Break',
  [IntervalType.None]: 'None',
} as const;

export interface Interval {
  type: IntervalType;
  duration: number;
  id: string;
}
