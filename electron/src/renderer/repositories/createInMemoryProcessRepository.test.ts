import { createAdvancedProcess, createOtherProcess, createProcess } from 'core';
import type { Process } from 'core';
import { expect, test } from 'tooling-suite';
import { createInMemoryProcessRepository } from './createInMemoryProcessRepository';

test('upserts processes by media path and removes them', () => {
  const repository = createInMemoryProcessRepository();
  const snapshots: Process[][] = [];
  repository.observeProcesses((processes) => snapshots.push(processes));

  repository.upsertProcess(createProcess());
  repository.upsertProcess(createOtherProcess());
  repository.upsertProcess(createAdvancedProcess());
  repository.removeProcess(createOtherProcess());

  expect(snapshots).toEqual([
    [],
    [createProcess()],
    [createProcess(), createOtherProcess()],
    [createAdvancedProcess(), createOtherProcess()],
    [createAdvancedProcess()],
  ]);
});
