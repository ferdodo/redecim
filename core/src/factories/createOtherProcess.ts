import type { Process } from '../entities/Process';

export function createOtherProcess(): Process {
  return {
    mediaPath: '/path/other.png',
    progression: 0.5,
    creationTimestampSecond: 1700000000,
    outputFilePath: '/path/other.candidate.png',
    outputSizeInBytes: 200,
    outputBitsPerPixel: 8,
  };
}
