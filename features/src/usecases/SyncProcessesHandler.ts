import type { MainProcessContext, Process } from 'core';

export class SyncProcessesHandler {
  constructor(private context: MainProcessContext) {}

  register(): void {
    this.context.channelService.handle<void, Process[]>('sync-processes', async () => {
      return await this.context.compressor.listProcesses();
    });
  }
}
