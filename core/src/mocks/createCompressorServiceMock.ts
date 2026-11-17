import type { CompressorService } from '../services/CompressorService';
import type { Media } from '../entities/Media';
import type { Process } from '../entities/Process';
import type { CompressionError } from '../types/CompressionError';

type CompressorServiceMock = CompressorService & {
  simulateProcesses(processes: Process[]): void;
  simulateCompressionError(error: CompressionError): void;
};

export function createCompressorServiceMock(): CompressorServiceMock {
  let processes: Process[] = [];
  let compressionError: CompressionError | null = null;

  return {
    simulateProcesses(newProcesses: Process[]): void {
      processes = newProcesses;
    },
    simulateCompressionError(error: CompressionError): void {
      compressionError = error;
    },
    async compress(
      media: Media,
      targetMaxBitsPerPixel: number,
    ): Promise<{ type: 'success'; value: Process } | { type: 'failure'; error: CompressionError }> {
      if (compressionError) {
        return { type: 'failure', error: compressionError };
      }
      const process: Process = {
        mediaPath: media.filePath,
        progression: 0,
        creationTimestampSecond: 0,
        outputFilePath: `${media.filePath}.candidate`,
        outputSizeInBytes: 0,
        outputBitsPerPixel: targetMaxBitsPerPixel,
      };
      processes = [...processes, process];
      return { type: 'success', value: process };
    },
    async listProcesses(): Promise<Process[]> {
      return processes;
    },
  };
}
