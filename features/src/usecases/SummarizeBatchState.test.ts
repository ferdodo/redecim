import { test, expect } from 'tooling-suite';
import { SummarizeBatchState } from './SummarizeBatchState';
import { AddMediaToBatch } from './AddMediaToBatch';
import { StartBatch } from './StartBatch';
import {
  createAnotherMedia,
  createCompletedProcess,
  createContextsMocks,
  createMedia,
  createMediaWithCandidate,
} from 'core';

test('SummarizeBatchState shows hint when no media scanned', () => {
  const { browserWindowContext } = createContextsMocks();
  const summaries: string[] = [];

  new SummarizeBatchState(browserWindowContext).observe((summary) => summaries.push(summary));

  expect(summaries.length).toBeGreaterThan(0);
  const latest = summaries[summaries.length - 1];
  expect(latest).toBe('Select a directory to scan for files to compress');
});

test('SummarizeBatchState shows hint when media available but none selected', () => {
  const { browserWindowContext } = createContextsMocks();
  const summaries: string[] = [];

  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);

  new SummarizeBatchState(browserWindowContext).observe((summary) => summaries.push(summary));

  expect(summaries.length).toBeGreaterThan(0);
  const latest = summaries[summaries.length - 1];
  expect(latest).toBe('Select media to compress');
});

test('SummarizeBatchState shows items to compress', () => {
  const { browserWindowContext } = createContextsMocks();
  const summaries: string[] = [];

  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());

  new SummarizeBatchState(browserWindowContext).observe((summary) => summaries.push(summary));

  expect(summaries.length).toBeGreaterThan(0);
  const latest = summaries[summaries.length - 1];
  expect(latest).toBe('1 to compress');
});

test('SummarizeBatchState shows completion status', () => {
  const { browserWindowContext } = createContextsMocks();
  const summaries: string[] = [];

  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithCandidate()]);
  new AddMediaToBatch(browserWindowContext).execute(createMediaWithCandidate());

  new SummarizeBatchState(browserWindowContext).observe((summary) => summaries.push(summary));

  expect(summaries.length).toBeGreaterThan(0);
  const latest = summaries[summaries.length - 1];
  expect(latest).toBe('1/1 compressed');
});

test('SummarizeBatchState shows partial progress status', () => {
  const { browserWindowContext } = createContextsMocks();
  const summaries: string[] = [];

  const media1 = createMediaWithCandidate();
  const media2 = createAnotherMedia();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([media1, media2]);
  new AddMediaToBatch(browserWindowContext).execute(media1);
  new AddMediaToBatch(browserWindowContext).execute(media2);

  new SummarizeBatchState(browserWindowContext).observe((summary) => summaries.push(summary));

  expect(summaries.length).toBeGreaterThan(0);
  const latest = summaries[summaries.length - 1];
  expect(latest).toBe('1/2 compressed');
});

test('SummarizeBatchState shows progress bar when batch is processing', () => {
  const { browserWindowContext } = createContextsMocks();
  const summaries: string[] = [];

  const media = createMediaWithCandidate();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([media]);
  new AddMediaToBatch(browserWindowContext).execute(media);

  new SummarizeBatchState(browserWindowContext).observe((summary) => summaries.push(summary));
  const beforeStart = summaries.length;

  new StartBatch(browserWindowContext).execute();

  expect(summaries.length).toBeGreaterThan(beforeStart);
  const latest = summaries[summaries.length - 1];
  expect(latest).toMatch(/\[.*\]/);
  expect(latest).toMatch(/100%/);
  expect(latest).toMatch(/1\/1/);
});

test('SummarizeBatchState counts a completed process still listed only once', () => {
  const { browserWindowContext } = createContextsMocks();
  const summaries: string[] = [];

  const media = createMediaWithCandidate();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([media]);
  new AddMediaToBatch(browserWindowContext).execute(media);
  new StartBatch(browserWindowContext).execute();
  browserWindowContext.processRepository.upsertProcess(createCompletedProcess());

  new SummarizeBatchState(browserWindowContext).observe((summary) => summaries.push(summary));

  const latest = summaries[summaries.length - 1];
  expect(latest).toMatch(/100%/);
  expect(latest).toMatch(/1\/1/);
});

test('SummarizeBatchState progress bar uses non-breaking spaces', () => {
  const { browserWindowContext } = createContextsMocks();
  const summaries: string[] = [];

  const media = createMediaWithCandidate();
  const anotherMedia = createAnotherMedia();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([media, anotherMedia]);
  new AddMediaToBatch(browserWindowContext).execute(media);
  new AddMediaToBatch(browserWindowContext).execute(anotherMedia);

  new SummarizeBatchState(browserWindowContext).observe((summary) => summaries.push(summary));

  new StartBatch(browserWindowContext).execute();

  const latest = summaries[summaries.length - 1];
  expect(latest).toContain(' ');
});
