import type { BrowserWindowContext, Media } from 'core';
import { generateId } from '../utils/generateId';
import type { CompressRequest } from '../types/CompressRequest';
import type { CompressResponse } from '../types/CompressResponse';

export class OrchestrateProcesses {
  constructor(private context: BrowserWindowContext) {}

  register(): void {
    const { batchRepository, mediaRepository, processRepository, notificationRepository, channelService } =
      this.context;
    const launchingMediaPaths = new Set<string>();

    const launch = async (media: Media, targetMaxBitsPerPixel: number): Promise<void> => {
      launchingMediaPaths.add(media.filePath);
      const response = await channelService.call<CompressRequest, CompressResponse>('compress', {
        media,
        targetMaxBitsPerPixel,
      });
      launchingMediaPaths.delete(media.filePath);

      if (response.type === 'failure') {
        notificationRepository.addNotification({
          id: generateId(),
          type: 'error',
          message: `Compression failed: ${media.filePath}`,
        });
        const batch = batchRepository.getBatch();
        batchRepository.saveBatch({
          ...batch,
          items: batch.items.map((item) =>
            item.mediaPath === media.filePath ? { ...item, error: response.error } : item,
          ),
        });
        return;
      }

      processRepository.upsertProcess(response.value);
    };

    const orchestrate = (): void => {
      const batch = batchRepository.getBatch();

      if (batch.status !== 'PROCESSING') {
        return;
      }

      const medias = mediaRepository.getMedias();
      const isMissing = (mediaPath: string): boolean => !medias.some((media) => media.filePath === mediaPath);

      if (batch.items.some((item) => !item.error && isMissing(item.mediaPath))) {
        batchRepository.saveBatch({
          ...batch,
          items: batch.items.map((item) =>
            !item.error && isMissing(item.mediaPath) ? { ...item, error: 'MEDIA_NOT_FOUND' } : item,
          ),
        });
        return;
      }

      const pendingMedias = batch.items
        .filter((item) => !item.error)
        .flatMap((item) => medias.filter((media) => media.filePath === item.mediaPath))
        .filter((media) => !media.candidate);

      if (pendingMedias.length === 0) {
        batchRepository.saveBatch({ ...batch, status: 'IDLE' });
        return;
      }

      const processes = processRepository.getProcesses();
      const runningCount = processes.filter((process) => process.progression < 1).length + launchingMediaPaths.size;
      const mediasToLaunch = pendingMedias
        .filter((media) => !launchingMediaPaths.has(media.filePath))
        .filter((media) => !processes.some((process) => process.mediaPath === media.filePath))
        .slice(0, Math.max(0, 2 - runningCount));

      for (const media of mediasToLaunch) {
        launch(media, batch.targetMaxBitsPerPixel);
      }
    };

    batchRepository.observeBatch(orchestrate);
    processRepository.observeProcesses(orchestrate);
  }
}
