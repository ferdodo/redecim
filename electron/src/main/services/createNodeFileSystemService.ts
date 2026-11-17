import { copyFile, readdir, rename, stat, unlink } from 'node:fs/promises';
import { extname, isAbsolute, join } from 'node:path';
import type { FileSystemService } from 'core';
import { FileSystemError } from 'core';

type ExploreResult = Awaited<ReturnType<FileSystemService['explorePath']>>;
type MoveResult = Awaited<ReturnType<FileSystemService['moveFile']>>;
type DeleteResult = Awaited<ReturnType<FileSystemService['deleteFile']>>;
type FileSizeResult = Awaited<ReturnType<FileSystemService['getFileSize']>>;

// Candidates are always mp4, so only containers that can hold the mp4 output are scanned.
const videoExtensions = new Set(['.mp4', '.m4v', '.mov']);

function toFileSystemError(error: unknown): FileSystemError {
  switch ((error as NodeJS.ErrnoException).code) {
    case 'ENOENT':
      return FileSystemError.PATH_NOT_FOUND;
    case 'EACCES':
    case 'EPERM':
      return FileSystemError.PERMISSION_DENIED;
    case 'ENOTDIR':
      return FileSystemError.NOT_A_DIRECTORY;
    case 'EINVAL':
      return FileSystemError.INVALID_PATH;
    default:
      return FileSystemError.IO_ERROR;
  }
}

async function move(sourcePath: string, targetPath: string): Promise<void> {
  try {
    await rename(sourcePath, targetPath);
  } catch (error) {
    // Temporary directories often live on another filesystem, where rename is impossible.
    if ((error as NodeJS.ErrnoException).code !== 'EXDEV') {
      throw error;
    }
    await copyFile(sourcePath, targetPath);
    await unlink(sourcePath);
  }
}

export function createNodeFileSystemService(): FileSystemService {
  return {
    async explorePath(path: string): Promise<ExploreResult> {
      if (!isAbsolute(path)) {
        return { type: 'failure', error: FileSystemError.INVALID_PATH };
      }

      try {
        if (!(await stat(path)).isDirectory()) {
          return { type: 'failure', error: FileSystemError.NOT_A_DIRECTORY };
        }
        const entries = await readdir(path, { recursive: true, withFileTypes: true });
        const videoPaths = entries
          .filter((entry) => entry.isFile() && videoExtensions.has(extname(entry.name).toLowerCase()))
          .map((entry) => join(entry.parentPath, entry.name))
          .sort();
        return { type: 'success', value: videoPaths };
      } catch (error) {
        return { type: 'failure', error: toFileSystemError(error) };
      }
    },

    async moveFile(sourcePath: string, targetPath: string): Promise<MoveResult> {
      try {
        await move(sourcePath, targetPath);
        return { type: 'success' };
      } catch (error) {
        return { type: 'failure', error: toFileSystemError(error) };
      }
    },

    async deleteFile(path: string): Promise<DeleteResult> {
      try {
        await unlink(path);
        return { type: 'success' };
      } catch (error) {
        return { type: 'failure', error: toFileSystemError(error) };
      }
    },

    async getFileSize(path: string): Promise<FileSizeResult> {
      try {
        const st = await stat(path);
        return { type: 'success', value: st.size };
      } catch (error) {
        return { type: 'failure', error: toFileSystemError(error) };
      }
    },
  };
}
