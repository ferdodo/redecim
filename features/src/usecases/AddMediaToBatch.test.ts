import { test, expect } from 'tooling-suite';
import { AddMediaToBatch } from './AddMediaToBatch';
import { createContextsMocks } from 'core';
import type { Media } from 'core';

function createMedia(filePath: string): Media {
  return { filePath, sizeInBytes: 0, bitsPerPixel: 24 };
}

test('AddMediaToBatch adds media to batch', () => {
  const { browserWindowContext } = createContextsMocks();
  const usecase = new AddMediaToBatch(browserWindowContext);

  usecase.execute(createMedia('/path/image.png'));

  const batch = browserWindowContext.batchRepository.getBatch();
  expect(batch.items).toHaveLength(1);
  expect(batch.items[0].mediaPath).toBe('/path/image.png');
  expect(batch.items[0].error).toBeUndefined();
  expect(batch.status).toBe('IDLE');
});

test('AddMediaToBatch appends after existing items', () => {
  const { browserWindowContext } = createContextsMocks();
  const usecase = new AddMediaToBatch(browserWindowContext);

  usecase.execute(createMedia('/path/a.png'));
  usecase.execute(createMedia('/path/b.png'));

  const batch = browserWindowContext.batchRepository.getBatch();
  expect(batch.items).toHaveLength(2);
  expect(batch.items[0].mediaPath).toBe('/path/a.png');
  expect(batch.items[1].mediaPath).toBe('/path/b.png');
});

test('AddMediaToBatch ignores media already in batch', () => {
  const { browserWindowContext } = createContextsMocks();
  const usecase = new AddMediaToBatch(browserWindowContext);

  usecase.execute(createMedia('/path/image.png'));
  usecase.execute(createMedia('/path/image.png'));

  expect(browserWindowContext.batchRepository.getBatch().items).toHaveLength(1);
});
