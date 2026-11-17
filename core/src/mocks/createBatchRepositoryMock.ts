import type { Batch } from '../entities/Batch';
import type { BatchRepository } from '../repositories/BatchRepository';

export function createBatchRepositoryMock(): BatchRepository {
  let batch: Batch = {
    items: [],
    status: 'IDLE',
    targetMaxBitsPerPixel: 24,
  };
  let observers: ((batch: Batch) => void)[] = [];

  const notify = (): void => {
    observers.forEach((observer) => {
      observer(batch);
    });
  };

  return {
    getBatch(): Batch {
      return batch;
    },
    saveBatch(newBatch: Batch): void {
      batch = newBatch;
      notify();
    },
    observeBatch(callback: (batch: Batch) => void): () => void {
      observers = [...observers, callback];
      callback(batch);
      return (): void => {
        observers = observers.filter((observer) => observer !== callback);
      };
    },
  };
}
