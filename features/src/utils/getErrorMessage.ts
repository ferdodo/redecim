import { FileSystemError } from 'core';

export function getErrorMessage(error: FileSystemError): string {
  switch (error) {
    case FileSystemError.PATH_NOT_FOUND:
      return 'Path not found';
    case FileSystemError.PERMISSION_DENIED:
      return 'Permission denied';
    case FileSystemError.NOT_A_DIRECTORY:
      return 'Path is not a directory';
    case FileSystemError.INVALID_PATH:
      return 'Invalid path';
    case FileSystemError.IO_ERROR:
      return 'File access error';
  }
}
