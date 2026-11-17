import type { FileSystemError } from '../types/FileSystemError';

interface ExploreSuccess {
  type: 'success';
  value: string[];
}

interface MoveSuccess {
  type: 'success';
}

interface FileSystemFailure {
  type: 'failure';
  error: FileSystemError;
}

type ExploreResult = ExploreSuccess | FileSystemFailure;

type MoveResult = MoveSuccess | FileSystemFailure;

interface DeleteSuccess {
  type: 'success';
}

type DeleteResult = DeleteSuccess | FileSystemFailure;

interface FileSizeSuccess {
  type: 'success';
  value: number;
}

type FileSizeResult = FileSizeSuccess | FileSystemFailure;

export interface FileSystemService {
  explorePath(path: string): Promise<ExploreResult>;
  moveFile(sourcePath: string, targetPath: string): Promise<MoveResult>;
  deleteFile(path: string): Promise<DeleteResult>;
  getFileSize(path: string): Promise<FileSizeResult>;
}
