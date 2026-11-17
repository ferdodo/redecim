import { test, expect } from 'tooling-suite';
import { StartBatch } from './StartBatch';
import { createContextsMocks } from 'core';

test('StartBatch sets batch status to processing', () => {
  const { browserWindowContext } = createContextsMocks();

  new StartBatch(browserWindowContext).execute();

  expect(browserWindowContext.batchRepository.getBatch().status).toBe('PROCESSING');
});
