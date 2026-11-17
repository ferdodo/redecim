export interface Batch {
  items: {
    mediaPath: string;
    error?: string;
  }[];
  status: 'IDLE' | 'PROCESSING';
  targetMaxBitsPerPixel: number;
}
