import type { FileSystemService } from '../services/FileSystemService';
import { FileSystemError } from '../types/FileSystemError';

type FileSystemServiceMock = FileSystemService & {
  simulateFilePaths(paths: string[]): void;
  simulateError(error: FileSystemError): void;
  simulateFileSizes(sizes: Map<string, number>): void;
};

export function createFileSystemServiceMock(): FileSystemServiceMock {
  let filePaths: string[] = [];
  let error: FileSystemError | null = null;
  let fileSizes = new Map<string, number>();

  return {
    simulateFilePaths(paths: string[]): void {
      filePaths = paths;
      error = null;
    },
    simulateError(errorCode: FileSystemError): void {
      error = errorCode;
    },
    simulateFileSizes(sizes: Map<string, number>): void {
      fileSizes = sizes;
    },
    async explorePath(): Promise<{ type: 'success'; value: string[] } | { type: 'failure'; error: FileSystemError }> {
      if (error) {
        return {
          type: 'failure' as const,
          error,
        };
      }
      return {
        type: 'success' as const,
        value: filePaths,
      };
    },
    async moveFile(
      sourcePath: string,
      targetPath: string,
    ): Promise<{ type: 'success' } | { type: 'failure'; error: FileSystemError }> {
      if (error) {
        return {
          type: 'failure' as const,
          error,
        };
      }
      filePaths = filePaths.filter((path) => path !== sourcePath && path !== targetPath);
      filePaths.push(targetPath);
      return { type: 'success' as const };
    },
    async deleteFile(path: string): Promise<{ type: 'success' } | { type: 'failure'; error: FileSystemError }> {
      if (error) {
        return {
          type: 'failure' as const,
          error,
        };
      }
      filePaths = filePaths.filter((filePath) => filePath !== path);
      return { type: 'success' as const };
    },
    async getFileSize(path: string): Promise<{ type: 'success'; value: number } | { type: 'failure'; error: FileSystemError }> {
      if (error) {
        return {
          type: 'failure' as const,
          error,
        };
      }
      const size = fileSizes.get(path);
      if (size === undefined) {
        return {
          type: 'failure' as const,
          error: FileSystemError.PATH_NOT_FOUND,
        };
      }
      return { type: 'success' as const, value: size };
    },
  };
}
