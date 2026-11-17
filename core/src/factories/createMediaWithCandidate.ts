import type { Media } from '../entities/Media';

export function createMediaWithCandidate(): Media {
  return {
    filePath: '/path/image.png',
    sizeInBytes: 1000,
    bitsPerPixel: 24,
    candidate: {
      filePath: '/path/image.candidate.png',
      sizeInBytes: 300,
      bitsPerPixel: 8,
    },
  };
}
