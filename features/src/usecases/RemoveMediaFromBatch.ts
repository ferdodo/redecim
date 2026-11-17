import type { BrowserWindowContext, Media } from 'core';

export class RemoveMediaFromBatch {
  constructor(private context: BrowserWindowContext) {}

  execute(media: Media): void {
    const batch = this.context.batchRepository.getBatch();

    this.context.batchRepository.saveBatch({
      ...batch,
      items: batch.items.filter((item) => item.mediaPath !== media.filePath),
    });
  }
}
