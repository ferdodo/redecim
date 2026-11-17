import { test, expect } from 'tooling-suite';
import { OrchestrateProcesses } from './OrchestrateProcesses';
import { OrchestrateProcessesHandler } from './OrchestrateProcessesHandler';
import { AddMediaToBatch } from './AddMediaToBatch';
import { ConfigureBatch } from './ConfigureBatch';
import { StartBatch } from './StartBatch';
import {
  CompressionError,
  createAnotherMedia,
  createCompletedProcess,
  createCompressorServiceMock,
  createContextsMocks,
  createMedia,
  createMediaWithCandidate,
  createMediaWithoutCandidate,
  createProcess,
} from 'core';

test('OrchestrateProcesses does nothing while batch is idle', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());

  new OrchestrateProcesses(browserWindowContext).register();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(await compressor.listProcesses()).toEqual([]);
  expect(browserWindowContext.batchRepository.getBatch().status).toBe('IDLE');
});

test('OrchestrateProcesses compresses pending media when batch is processing', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(await compressor.listProcesses()).toEqual(browserWindowContext.processRepository.getProcesses());
  expect(browserWindowContext.processRepository.getProcesses().map((process) => process.mediaPath)).toEqual([
    '/path/image.png',
  ]);
  expect(browserWindowContext.batchRepository.getBatch().status).toBe('PROCESSING');
});

test('OrchestrateProcesses does not compress media outside of batch', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createAnotherMedia(), createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect((await compressor.listProcesses()).map((process) => process.mediaPath)).toEqual(['/path/image.png']);
});

test('OrchestrateProcesses does not count completed process awaiting recovery as running', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithoutCandidate(), createAnotherMedia()]);
  const addMediaToBatch = new AddMediaToBatch(browserWindowContext);
  addMediaToBatch.execute(createMediaWithoutCandidate());
  addMediaToBatch.execute(createAnotherMedia());
  browserWindowContext.processRepository.upsertProcess(createCompletedProcess());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect((await compressor.listProcesses()).map((process) => process.mediaPath)).toEqual([
    '/path/other.png',
    '/path/another.png',
  ]);
});

test('OrchestrateProcesses compresses with batch target bits per pixel', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  mainProcessContext.compressor = createCompressorServiceMock();
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());
  new ConfigureBatch(browserWindowContext).execute(8);

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(browserWindowContext.processRepository.getProcesses()[0].outputBitsPerPixel).toBe(8);
});

test('OrchestrateProcesses runs at most two processes at a time', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([
    createMedia(),
    createMediaWithoutCandidate(),
    createAnotherMedia(),
  ]);
  const addMediaToBatch = new AddMediaToBatch(browserWindowContext);
  addMediaToBatch.execute(createMedia());
  addMediaToBatch.execute(createMediaWithoutCandidate());
  addMediaToBatch.execute(createAnotherMedia());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect((await compressor.listProcesses()).map((process) => process.mediaPath)).toEqual([
    '/path/image.png',
    '/path/other.png',
  ]);
});

test('OrchestrateProcesses launches next media when a process is recovered', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([
    createMedia(),
    createMediaWithoutCandidate(),
    createAnotherMedia(),
  ]);
  const addMediaToBatch = new AddMediaToBatch(browserWindowContext);
  addMediaToBatch.execute(createMedia());
  addMediaToBatch.execute(createMediaWithoutCandidate());
  addMediaToBatch.execute(createAnotherMedia());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));
  browserWindowContext.mediaRepository.updateMedia(createMediaWithCandidate());
  browserWindowContext.processRepository.removeProcess(browserWindowContext.processRepository.getProcesses()[0]);
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect((await compressor.listProcesses()).map((process) => process.mediaPath)).toEqual([
    '/path/image.png',
    '/path/other.png',
    '/path/another.png',
  ]);
});

test('OrchestrateProcesses does not compress media that already has a process', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());
  browserWindowContext.processRepository.upsertProcess(createProcess());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(await compressor.listProcesses()).toEqual([]);
});

test('OrchestrateProcesses does not compress twice while compress is pending', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  browserWindowContext.batchRepository.saveBatch(browserWindowContext.batchRepository.getBatch());
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(await compressor.listProcesses()).toHaveLength(1);
});

test('OrchestrateProcesses completes batch when every media has a candidate', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  mainProcessContext.compressor = createCompressorServiceMock();
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));
  browserWindowContext.mediaRepository.updateMedia(createMediaWithCandidate());
  browserWindowContext.processRepository.removeProcess(browserWindowContext.processRepository.getProcesses()[0]);

  expect(browserWindowContext.batchRepository.getBatch().status).toBe('IDLE');
});

test('OrchestrateProcesses completes batch without compressing media that already has a candidate', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithCandidate()]);
  new AddMediaToBatch(browserWindowContext).execute(createMediaWithCandidate());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(await compressor.listProcesses()).toEqual([]);
  expect(browserWindowContext.batchRepository.getBatch().status).toBe('IDLE');
});

test('OrchestrateProcesses completes empty batch', () => {
  const { browserWindowContext } = createContextsMocks();

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();

  expect(browserWindowContext.batchRepository.getBatch().status).toBe('IDLE');
});

test('OrchestrateProcesses marks item in error and notifies when compress fails', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  compressor.simulateCompressionError(CompressionError.IO_ERROR);
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMedia()]);
  new AddMediaToBatch(browserWindowContext).execute(createMedia());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  const batch = browserWindowContext.batchRepository.getBatch();
  expect(batch.items).toEqual([{ mediaPath: '/path/image.png', error: 'IO_ERROR' }]);
  expect(batch.status).toBe('IDLE');
  const notifications = browserWindowContext.notificationRepository.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].type).toBe('error');
  expect(notifications[0].message).toBe('Compression failed: /path/image.png');
});

test('OrchestrateProcesses marks only failed item in error', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const compressor = createCompressorServiceMock();
  compressor.simulateCompressionError(CompressionError.IO_ERROR);
  mainProcessContext.compressor = compressor;
  new OrchestrateProcessesHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([
    createMediaWithCandidate(),
    createMediaWithoutCandidate(),
  ]);
  const addMediaToBatch = new AddMediaToBatch(browserWindowContext);
  addMediaToBatch.execute(createMediaWithCandidate());
  addMediaToBatch.execute(createMediaWithoutCandidate());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();
  await new Promise((resolve) => setTimeout(resolve, 0));

  expect(browserWindowContext.batchRepository.getBatch().items).toEqual([
    { mediaPath: '/path/image.png' },
    { mediaPath: '/path/other.png', error: 'IO_ERROR' },
  ]);
});

test('OrchestrateProcesses marks item in error when media is missing', () => {
  const { browserWindowContext } = createContextsMocks();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithCandidate()]);
  const addMediaToBatch = new AddMediaToBatch(browserWindowContext);
  addMediaToBatch.execute(createMediaWithCandidate());
  addMediaToBatch.execute(createMediaWithoutCandidate());

  new OrchestrateProcesses(browserWindowContext).register();
  new StartBatch(browserWindowContext).execute();

  const batch = browserWindowContext.batchRepository.getBatch();
  expect(batch.items).toEqual([
    { mediaPath: '/path/image.png' },
    { mediaPath: '/path/other.png', error: 'MEDIA_NOT_FOUND' },
  ]);
  expect(batch.status).toBe('IDLE');
});
