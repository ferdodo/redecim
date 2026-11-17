import type { MainProcessContext } from 'core';
import type { RemoveCandidateRequest } from '../types/RemoveCandidateRequest';
import type { RemoveCandidateResponse } from '../types/RemoveCandidateResponse';

export class RemoveCandidateHandler {
  constructor(private context: MainProcessContext) {}

  register(): void {
    this.context.channelService.handle<RemoveCandidateRequest, RemoveCandidateResponse>(
      'remove-candidate',
      async (request) => {
        return await this.context.fileSystem.deleteFile(request.candidateFilePath);
      },
    );
  }
}
