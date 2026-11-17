import type { BrowserWindowContext } from 'core';
import { generateId } from '../utils/generateId';
import { getErrorMessage } from '../utils/getErrorMessage';
import type { ScanDirectoryRequest } from '../types/ScanDirectoryRequest';
import type { ScanDirectoryResponse } from '../types/ScanDirectoryResponse';

export class ScanDirectory {
  constructor(private context: BrowserWindowContext) {}

  async execute(path: string): Promise<void> {
    const response = await this.context.channelService.call<ScanDirectoryRequest, ScanDirectoryResponse>(
      'scan-directory',
      { path },
    );

    if (response.type === 'failure') {
      const notification = {
        id: generateId(),
        type: 'error' as const,
        message: getErrorMessage(response.error),
      };
      this.context.notificationRepository.addNotification(notification);
      return;
    }

    this.context.mediaRepository.deleteAndReplaceAllMedias(response.medias);
  }
}
