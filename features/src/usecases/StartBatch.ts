import type { BrowserWindowContext } from 'core';

export class StartBatch {
  constructor(private context: BrowserWindowContext) {}

  execute(): void {
    const batch = this.context.batchRepository.getBatch();
    this.context.batchRepository.saveBatch({ ...batch, status: 'PROCESSING' });
  }
}
