import type { MainProcessContext } from 'core';
import type { CompressRequest } from '../types/CompressRequest';
import type { CompressResponse } from '../types/CompressResponse';

export class OrchestrateProcessesHandler {
  constructor(private context: MainProcessContext) {}

  register(): void {
    this.context.channelService.handle<CompressRequest, CompressResponse>('compress', async (request) => {
      return await this.context.compressor.compress(request.media, request.targetMaxBitsPerPixel);
    });
  }
}
