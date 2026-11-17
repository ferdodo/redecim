import { test, expect } from 'tooling-suite';
import { RemoveCandidate } from './RemoveCandidate';
import { RemoveCandidateHandler } from './RemoveCandidateHandler';
import {
  createContextsMocks,
  createFileSystemServiceMock,
  createMediaWithCandidate,
  createMediaWithoutCandidate,
  FileSystemError,
} from 'core';

test('RemoveCandidate deletes candidate file', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateFilePaths(['/path/image.png', '/path/image.candidate.png']);
  mainProcessContext.fileSystem = fileSystem;
  new RemoveCandidateHandler(mainProcessContext).register();

  await new RemoveCandidate(browserWindowContext).execute(createMediaWithCandidate());

  expect(await fileSystem.explorePath('/path')).toEqual({
    type: 'success',
    value: ['/path/image.png'],
  });
});

test('RemoveCandidate removes candidate from media', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  new RemoveCandidateHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([
    createMediaWithCandidate(),
    createMediaWithoutCandidate(),
  ]);

  await new RemoveCandidate(browserWindowContext).execute(createMediaWithCandidate());

  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([
    { filePath: '/path/image.png', sizeInBytes: 1000, bitsPerPixel: 24 },
    createMediaWithoutCandidate(),
  ]);
});

test('RemoveCandidate does nothing when media has no candidate', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateFilePaths(['/path/other.png']);
  mainProcessContext.fileSystem = fileSystem;
  new RemoveCandidateHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithoutCandidate()]);

  await new RemoveCandidate(browserWindowContext).execute(createMediaWithoutCandidate());

  expect(await fileSystem.explorePath('/path')).toEqual({ type: 'success', value: ['/path/other.png'] });
  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([createMediaWithoutCandidate()]);
});

test('RemoveCandidate adds error notification on failure and keeps media', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();
  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateError(FileSystemError.PERMISSION_DENIED);
  mainProcessContext.fileSystem = fileSystem;
  new RemoveCandidateHandler(mainProcessContext).register();
  browserWindowContext.mediaRepository.deleteAndReplaceAllMedias([createMediaWithCandidate()]);

  await new RemoveCandidate(browserWindowContext).execute(createMediaWithCandidate());

  const notifications = browserWindowContext.notificationRepository.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].type).toBe('error');
  expect(notifications[0].message).toBe('Permission denied');
  expect(browserWindowContext.mediaRepository.getMedias()).toEqual([createMediaWithCandidate()]);
});
