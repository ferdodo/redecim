import type { Media } from '../entities/Media';

export function createMediaWithoutCandidate(): Media {
  return {
    filePath: '/path/other.png',
    sizeInBytes: 500,
    bitsPerPixel: 24,
  };
}
