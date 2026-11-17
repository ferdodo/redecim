import type { BrowserWindowContext, Process } from 'core';

export class SyncProcesses {
  constructor(private context: BrowserWindowContext) {}

  register(): void {
    this.context.timeService.setInterval(async () => {
      const activeProcesses = await this.context.channelService.call<void, Process[]>('sync-processes', undefined);
      const { processRepository } = this.context;

      for (const process of processRepository.getProcesses()) {
        const isActive = activeProcesses.some((active) => active.mediaPath === process.mediaPath);
        if (!isActive && process.progression !== 1) {
          processRepository.upsertProcess({ ...process, progression: 1 });
        }
      }

      for (const active of activeProcesses) {
        const known = processRepository.getProcesses().find((process) => process.mediaPath === active.mediaPath);
        if (known?.progression !== active.progression) {
          processRepository.upsertProcess(active);
        }
      }
    }, 1000);
  }
}
