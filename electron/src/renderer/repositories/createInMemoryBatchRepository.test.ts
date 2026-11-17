import type { Batch } from 'core';
import { expect, test } from 'tooling-suite';
import { createInMemoryBatchRepository } from './createInMemoryBatchRepository';

test('starts idle and notifies every observer of saved batches', () => {
  const repository = createInMemoryBatchRepository();
  const first: Batch[] = [];
  const second: Batch[] = [];
  repository.observeBatch((batch) => first.push(batch));
  repository.observeBatch((batch) => second.push(batch));
  const processing: Batch = { items: [{ mediaPath: '/videos/a.mp4' }], status: 'PROCESSING', targetMaxBitsPerPixel: 0.1 };

  repository.saveBatch(processing);

  const initial: Batch = { items: [], status: 'IDLE', targetMaxBitsPerPixel: 0.1 };
  expect(first).toEqual([initial, processing]);
  expect(second).toEqual([initial, processing]);
  expect(repository.getBatch()).toEqual(processing);
});
