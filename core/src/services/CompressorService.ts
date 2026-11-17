import type { Media } from '../entities/Media';
import type { Process } from '../entities/Process';
import type { CompressionError } from '../types/CompressionError';

interface CompressionSuccess {
  type: 'success';
  value: Process;
}

interface CompressionFailure {
  type: 'failure';
  error: CompressionError;
}

type CompressionResult = CompressionSuccess | CompressionFailure;

export interface CompressorService {
  compress(media: Media, targetMaxBitsPerPixel: number): Promise<CompressionResult>;
  listProcesses(): Promise<Process[]>;
}
