import type { Batch } from '../entities/Batch';

export interface BatchRepository {
  getBatch(): Batch;
  saveBatch(batch: Batch): void;
  observeBatch(callback: (batch: Batch) => void): () => void;
}
