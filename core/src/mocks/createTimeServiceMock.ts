import type { TimeService } from '../services/TimeService';

type TimeServiceMock = TimeService & {
  advanceTime(milliseconds: number): Promise<void>;
};

export function createTimeServiceMock(): TimeServiceMock {
  let now = 0;
  const intervals: { callback: () => void | Promise<void>; intervalMilliseconds: number; nextTime: number }[] = [];

  return {
    setInterval(callback: () => void | Promise<void>, intervalMilliseconds: number): void {
      intervals.push({ callback, intervalMilliseconds, nextTime: now + intervalMilliseconds });
    },
    async advanceTime(milliseconds: number): Promise<void> {
      const targetTime = now + milliseconds;
      for (;;) {
        const dueIntervals = intervals.filter((interval) => interval.nextTime <= targetTime);
        if (dueIntervals.length === 0) break;
        const next = dueIntervals.reduce((earliest, interval) =>
          interval.nextTime < earliest.nextTime ? interval : earliest,
        );
        now = next.nextTime;
        next.nextTime += next.intervalMilliseconds;
        await next.callback();
      }
      now = targetTime;
    },
  };
}
