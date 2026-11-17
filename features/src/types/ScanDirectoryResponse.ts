import type { Media, FileSystemError } from 'core';

export type ScanDirectoryResponse =
  | { type: 'success'; medias: Media[] }
  | { type: 'failure'; error: FileSystemError };
