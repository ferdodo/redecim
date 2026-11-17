import type { TimeService } from 'core';

export function createBrowserTimeService(): TimeService {
  return {
    setInterval(callback: () => void | Promise<void>, intervalMilliseconds: number): void {
      globalThis.setInterval(() => {
        callback();
      }, intervalMilliseconds);
    },
  };
}
