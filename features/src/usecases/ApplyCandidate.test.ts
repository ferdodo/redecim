import { test, expect } from 'tooling-suite';
import { ApplyCandidate } from './ApplyCandidate';
import { ApplyCandidateHandler } from './ApplyCandidateHandler';
import { AddMediaToBatch } from './AddMediaToBatch';
import {
  createContextsMocks,
  createFileSystemServiceMock,
  createMediaWithCandidate,
  createMediaWithoutCandidate,
  FileSystemError,
} from 'core';

test('ApplyCandidate replaces initial file with candidate', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateFilePaths(['/path/image.png', '/path/image.candidate.png']);
  mainProcessContext.fileSystem = fileSystem;
  new ApplyCandidateHandler(mainProcessContext).register();

  await new ApplyCandidate(browserWindowContext).execute(createMediaWithCandidate());

  expect(await fileSystem.explorePath('/path')).toEqual({
    type: 'success',
    value: ['/path/image.png'],
  });
});

test('ApplyCandidate updates media with candidate infos', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  new ApplyCandidateHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([
    createMediaWithCandidate(),
    createMediaWithoutCandidate(),
  ]);

  await new ApplyCandidate(browserWindowContext).execute(createMediaWithCandidate());

  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([
    { filePath: '/path/image.png', sizeInBytes: 300, bitsPerPixel: 8 },
    createMediaWithoutCandidate(),
  ]);
});

test('ApplyCandidate removes media from batch', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  new ApplyCandidateHandler(mainProcessContext).register();
  const addMediaToBatch = new AddMediaToBatch(browserWindowContext);
  addMediaToBatch.execute(createMediaWithCandidate());
  addMediaToBatch.execute(createMediaWithoutCandidate());

  await new ApplyCandidate(browserWindowContext).execute(createMediaWithCandidate());

  const batch = browserWindowContext.batchRepository.getBatch();
  expect(batch.items).toHaveLength(1);
  expect(batch.items[0].mediaPath).toBe('/path/other.png');
  expect(batch.status).toBe('IDLE');
});

test('ApplyCandidate does nothing when media has no candidate', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateFilePaths(['/path/other.png']);
  mainProcessContext.fileSystem = fileSystem;
  new ApplyCandidateHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithoutCandidate()]);
  new AddMediaToBatch(browserWindowContext).execute(createMediaWithoutCandidate());

  await new ApplyCandidate(browserWindowContext).execute(createMediaWithoutCandidate());

  expect(await fileSystem.explorePath('/path')).toEqual({ type: 'success', value: ['/path/other.png'] });
  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([createMediaWithoutCandidate()]);
  expect(browserWindowContext.batchRepository.getBatch().items).toHaveLength(1);
});

test('ApplyCandidate adds error notification on failure and keeps state', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateError(FileSystemError.PERMISSION_DENIED);
  mainProcessContext.fileSystem = fileSystem;
  new ApplyCandidateHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithCandidate()]);
  new AddMediaToBatch(browserWindowContext).execute(createMediaWithCandidate());

  await new ApplyCandidate(browserWindowContext).execute(createMediaWithCandidate());

  const notifications = browserWindowContext.notificationRepository.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].type).toBe('error');
  expect(notifications[0].message).toBe('Permission denied');
  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([createMediaWithCandidate()]);
  expect(browserWindowContext.batchRepository.getBatch().items).toHaveLength(1);
});
