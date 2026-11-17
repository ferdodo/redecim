import type { MainProcessContext } from 'core';
import type { ScanDirectoryRequest } from '../types/ScanDirectoryRequest';
import type { ScanDirectoryResponse } from '../types/ScanDirectoryResponse';

export class ScanDirectoryHandler {
  constructor(private context: MainProcessContext) {}

  register(): void {
    this.context.channelService.handle<ScanDirectoryRequest, ScanDirectoryResponse>(
      'scan-directory',
      async (request) => {
        return await this.handle(request.path);
      },
    );
  }

  private async handle(path: string): Promise<ScanDirectoryResponse> {
    const result = await this.context.fileSystem.explorePath(path);

    if (result.type === 'failure') {
      return {
        type: 'failure',
        error: result.error,
      };
    }

    const medias = await Promise.all(
      result.value.map(async (filePath) => {
        const sizeResult = await this.context.fileSystem.getFileSize(filePath);
        const sizeInBytes = sizeResult.type === 'success' ? sizeResult.value : 0;
        return {
          filePath,
          sizeInBytes,
          bitsPerPixel: 24,
        };
      }),
    );

    return {
      type: 'success',
      medias,
    };
  }
}
