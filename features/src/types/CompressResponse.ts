import type { CompressionError, Process } from 'core';

export type CompressResponse = { type: 'success'; value: Process } | { type: 'failure'; error: CompressionError };
