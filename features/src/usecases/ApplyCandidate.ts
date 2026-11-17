import type { BrowserWindowContext, Media } from 'core';
import { generateId } from '../utils/generateId';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { ApplyCandidateRequest } from '../types/ApplyCandidateRequest';
import type { ApplyCandidateResponse } from '../types/ApplyCandidateResponse';

export class ApplyCandidate {
  constructor(private context: BrowserWindowContext) {}

  async execute(media: Media): Promise<void> {
    const { candidate } = media;

    if (!candidate) {
      return;
    }

    const response = await this.context.channelService.call<ApplyCandidateRequest, ApplyCandidateResponse>(
      'apply-candidate',
      { filePath: media.filePath, candidateFilePath: candidate.filePath },
    );

    if (response.type === 'failure') {
      this.context.notificationRepository.addNotification({
        id: generateId(),
        type: 'error',
        message: getErrorMessage(response.error),
      });
      return;
    }

    this.context.mediaRepository.updateMedia({
      filePath: media.filePath,
      sizeInBytes: candidate.sizeInBytes,
      bitsPerPixel: candidate.bitsPerPixel,
    });

    const batch = this.context.batchRepository.getBatch();
    this.context.batchRepository.saveBatch({
      ...batch,
      items: batch.items.filter((item) => item.mediaPath !== media.filePath),
    });
  }
}
