import type { Batch, BatchRepository } from 'core';
import { createObservableValue } from './createObservableValue';

export function createInMemoryBatchRepository(): BatchRepository {
  const batch = createObservableValue<Batch>({ items: [], status: 'IDLE', targetMaxBitsPerPixel: 0.1 });

  return {
    getBatch(): Batch {
      return batch.get();
    },
    saveBatch(newBatch: Batch): void {
      batch.set(newBatch);
    },
    observeBatch(callback: (batch: Batch) => void): () => void {
      return batch.observe(callback);
    },
  };
}
