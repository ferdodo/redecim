import { test, expect } from 'tooling-suite';
import { RecoverCandidate } from './RecoverCandidate';
import {
  createCompletedProcess,
  createContextsMocks,
  createMedia,
  createMediaWithCandidate,
  createMediaWithoutCandidate,
  createProcess,
} from 'core';

test('RecoverCandidate transfers completed process to media candidate', () => {
  const { browserWindowContext } = createContextsMocks();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithoutCandidate(), createMedia()]);

  new RecoverCandidate(browserWindowContext).register();
  browserWindowContext.processRepository.upsertProcess(createCompletedProcess());

  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([
    createMediaWithoutCandidate(),
    createMediaWithCandidate(),
  ]);
});

test('RecoverCandidate removes completed process', () => {
  const { browserWindowContext } = createContextsMocks();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);

  new RecoverCandidate(browserWindowContext).register();
  browserWindowContext.processRepository.upsertProcess(createCompletedProcess());

  expect(browserWindowContext.processRepository.getProcesses()).toEqual([]);
});

test('RecoverCandidate ignores process in progress', () => {
  const { browserWindowContext } = createContextsMocks();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);

  new RecoverCandidate(browserWindowContext).register();
  browserWindowContext.processRepository.upsertProcess(createProcess());

  expect(browserWindowContext.processRepository.getProcesses()).toEqual([createProcess()]);
  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([createMedia()]);
});

test('RecoverCandidate recovers process already completed at register', () => {
  const { browserWindowContext } = createContextsMocks();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  browserWindowContext.processRepository.upsertProcess(createCompletedProcess());

  new RecoverCandidate(browserWindowContext).register();

  expect(browserWindowContext.processRepository.getProcesses()).toEqual([]);
  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([createMediaWithCandidate()]);
});
