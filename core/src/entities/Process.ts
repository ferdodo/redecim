export interface Process {
  mediaPath: string;
  progression: number;
  creationTimestampSecond: number;
  outputFilePath: string;
  outputSizeInBytes: number;
  outputBitsPerPixel: number;
}
