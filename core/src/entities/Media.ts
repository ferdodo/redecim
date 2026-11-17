export interface Media {
  filePath: string;
  sizeInBytes: number;
  bitsPerPixel: number;
  candidate?: {
    filePath: string;
    sizeInBytes: number;
    bitsPerPixel: number;
  };
}
