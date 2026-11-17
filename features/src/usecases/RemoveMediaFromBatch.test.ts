import { test, expect } from 'tooling-suite';
import { AddMediaToBatch } from './AddMediaToBatch';
import { RemoveMediaFromBatch } from './RemoveMediaFromBatch';
import { createContextsMocks } from 'core';
import type { Media } from 'core';

function createMedia(filePath: string): Media {
  return { filePath, sizeInBytes: 0, bitsPerPixel: 24 };
}

test('RemoveMediaFromBatch removes media from batch', () => {
  const { browserWindowContext } = createContextsMocks();
  const media = createMedia('/path/image.png');
  new AddMediaToBatch(browserWindowContext).execute(media);

  new RemoveMediaFromBatch(browserWindowContext).execute(media);

  const batch = browserWindowContext.batchRepository.getBatch();
  expect(batch.items).toHaveLength(0);
  expect(batch.status).toBe('IDLE');
});

test('RemoveMediaFromBatch keeps other medias', () => {
  const { browserWindowContext } = createContextsMocks();
  const addMediaToBatch = new AddMediaToBatch(browserWindowContext);
  addMediaToBatch.execute(createMedia('/path/a.png'));
  addMediaToBatch.execute(createMedia('/path/b.png'));
  addMediaToBatch.execute(createMedia('/path/c.png'));

  new RemoveMediaFromBatch(browserWindowContext).execute(createMedia('/path/b.png'));

  const batch = browserWindowContext.batchRepository.getBatch();
  expect(batch.items).toHaveLength(2);
  expect(batch.items[0].mediaPath).toBe('/path/a.png');
  expect(batch.items[1].mediaPath).toBe('/path/c.png');
});

test('RemoveMediaFromBatch does nothing when media is not in batch', () => {
  const { browserWindowContext } = createContextsMocks();
  new AddMediaToBatch(browserWindowContext).execute(createMedia('/path/a.png'));

  new RemoveMediaFromBatch(browserWindowContext).execute(createMedia('/path/unknown.png'));

  const batch = browserWindowContext.batchRepository.getBatch();
  expect(batch.items).toHaveLength(1);
  expect(batch.items[0].mediaPath).toBe('/path/a.png');
});
