import type { BrowserWindowContext, Media } from 'core';

export class ConfigureBatch {
  constructor(private context: BrowserWindowContext) {}

  execute(targetMaxBitsPerPixel: Media['bitsPerPixel']): void {
    const batch = this.context.batchRepository.getBatch();
    this.context.batchRepository.saveBatch({ ...batch, targetMaxBitsPerPixel });
  }
}
