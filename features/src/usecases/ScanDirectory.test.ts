import { test, expect } from 'tooling-suite';
import { ScanDirectory } from './ScanDirectory';
import { ScanDirectoryHandler } from './ScanDirectoryHandler';
import { createContextsMocks, createFileSystemServiceMock, FileSystemError } from 'core';

test('ScanDirectory loads files and saves them', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();

  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateFilePaths(['/path/file1.png', '/path/file2.jpg']);
  mainProcessContext.fileSystem = fileSystem;

  const handler = new ScanDirectoryHandler(mainProcessContext);
  handler.register();

  const usecase = new ScanDirectory(browserWindowContext);
  await usecase.execute('/path');

  const savedMedias = browserWindowContext.mediaRepository.getMedias();
  expect(savedMedias).toHaveLength(2);
  expect(savedMedias[0].filePath).toBe('/path/file1.png');
  expect(savedMedias[1].filePath).toBe('/path/file2.jpg');
});

test('ScanDirectory adds error notification on failure', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();

  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateError(FileSystemError.PERMISSION_DENIED);
  mainProcessContext.fileSystem = fileSystem;

  const handler = new ScanDirectoryHandler(mainProcessContext);
  handler.register();

  const usecase = new ScanDirectory(browserWindowContext);
  await usecase.execute('/path');

  const notifications = browserWindowContext.notificationRepository.getNotifications();
  expect(notifications).toHaveLength(1);
  expect(notifications[0].type).toBe('error');
  expect(notifications[0].message).toBe('Permission denied');
});

test('ScanDirectory saves media with correct properties', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();

  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateFilePaths(['/path/image.png']);
  mainProcessContext.fileSystem = fileSystem;

  const handler = new ScanDirectoryHandler(mainProcessContext);
  handler.register();

  const usecase = new ScanDirectory(browserWindowContext);
  await usecase.execute('/path');

  const savedMedias = browserWindowContext.mediaRepository.getMedias();
  expect(savedMedias[0].sizeInBytes).toBe(0);
  expect(savedMedias[0].bitsPerPixel).toBe(24);
});

test('ScanDirectory handles empty directory', async () => {
  const { browserWindowContext, mainProcessContext } = createContextsMocks();

  const fileSystem = createFileSystemServiceMock();
  fileSystem.simulateFilePaths([]);
  mainProcessContext.fileSystem = fileSystem;

  const handler = new ScanDirectoryHandler(mainProcessContext);
  handler.register();

  const usecase = new ScanDirectory(browserWindowContext);
  await usecase.execute('/empty');

  const savedMedias = browserWindowContext.mediaRepository.getMedias();
  expect(savedMedias).toHaveLength(0);
});
