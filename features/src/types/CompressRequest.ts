import type { Media } from 'core';

export interface CompressRequest {
  media: Media;
  targetMaxBitsPerPixel: number;
}
