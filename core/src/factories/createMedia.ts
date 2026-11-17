import type { Media } from '../entities/Media';

export function createMedia(): Media {
  return {
    filePath: '/path/image.png',
    sizeInBytes: 1000,
    bitsPerPixel: 24,
  };
}
