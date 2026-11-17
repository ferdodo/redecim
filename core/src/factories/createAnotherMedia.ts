import type { Media } from '../entities/Media';

export function createAnotherMedia(): Media {
  return {
    filePath: '/path/another.png',
    sizeInBytes: 800,
    bitsPerPixel: 24,
  };
}
