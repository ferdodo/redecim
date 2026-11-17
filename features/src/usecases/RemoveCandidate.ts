import type { BrowserWindowContext, Media } from 'core';
import { generateId } from '../utils/generateId';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { RemoveCandidateRequest } from '../types/RemoveCandidateRequest';
import type { RemoveCandidateResponse } from '../types/RemoveCandidateResponse';

export class RemoveCandidate {
  constructor(private context: BrowserWindowContext) {}

  async execute(media: Media): Promise<void> {
    const { candidate, ...mediaWithoutCandidate } = media;

    if (!candidate) {
      return;
    }

    const response = await this.context.channelService.call<RemoveCandidateRequest, RemoveCandidateResponse>(
      'remove-candidate',
      { candidateFilePath: candidate.filePath },
    );

    if (response.type === 'failure') {
      this.context.notificationRepository.addNotification({
        id: generateId(),
        type: 'error',
        message: getErrorMessage(response.error),
      });
      return;
    }

    this.context.mediaRepository.updateMedia(mediaWithoutCandidate);
  }
}
