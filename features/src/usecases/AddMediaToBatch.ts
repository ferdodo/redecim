import type { BrowserWindowContext, Media } from 'core';

export class AddMediaToBatch {
  constructor(private context: BrowserWindowContext) {}

  execute(media: Media): void {
    const batch = this.context.batchRepository.getBatch();
    const alreadyInBatch = batch.items.some((item) => item.mediaPath === media.filePath);

    if (alreadyInBatch) {
      return;
    }

    this.context.batchRepository.saveBatch({
      ...batch,
      items: [...batch.items, { mediaPath: media.filePath }],
    });
  }
}
