import type { Process } from '../entities/Process';

export function createProcess(): Process {
  return {
    mediaPath: '/path/image.png',
    progression: 0.5,
    creationTimestampSecond: 1700000000,
    outputFilePath: '/path/image.candidate.png',
    outputSizeInBytes: 300,
    outputBitsPerPixel: 8,
  };
}
