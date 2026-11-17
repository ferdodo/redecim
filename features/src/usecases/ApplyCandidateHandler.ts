import type { MainProcessContext } from 'core';
import type { ApplyCandidateRequest } from '../types/ApplyCandidateRequest';
import type { ApplyCandidateResponse } from '../types/ApplyCandidateResponse';

export class ApplyCandidateHandler {
  constructor(private context: MainProcessContext) {}

  register(): void {
    this.context.channelService.handle<ApplyCandidateRequest, ApplyCandidateResponse>(
      'apply-candidate',
      async (request) => {
        return await this.context.fileSystem.moveFile(request.candidateFilePath, request.filePath);
      },
    );
  }
}
