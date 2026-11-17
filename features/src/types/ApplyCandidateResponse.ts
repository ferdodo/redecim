import type { FileSystemError } from 'core';

export type ApplyCandidateResponse = { type: 'success' } | { type: 'failure'; error: FileSystemError };
