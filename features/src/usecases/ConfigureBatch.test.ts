import { test, expect } from 'tooling-suite';
import { ConfigureBatch } from './ConfigureBatch';
import { createContextsMocks } from 'core';

test('ConfigureBatch sets target max bits per pixel', () => {
  const { browserWindowContext } = createContextsMocks();

  new ConfigureBatch(browserWindowContext).execute(8);

  expect(browserWindowContext.batchRepository.getBatch().targetMaxBitsPerPixel).toBe(8);
});
