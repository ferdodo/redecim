import type { FileSystemError } from 'core';

export type RemoveCandidateResponse = { type: 'success' } | { type: 'failure'; error: FileSystemError };
