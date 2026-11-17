import type { BrowserWindowContext } from '../contexts/BrowserWindowContext';
import type { MainProcessContext } from '../contexts/MainProcessContext';
import { createChannelServicesMocks } from './createChannelServicesMocks';
import { createMediaRepositoryMock } from './createMediaRepositoryMock';
import { createBatchRepositoryMock } from './createBatchRepositoryMock';
import { createFileSystemServiceMock } from './createFileSystemServiceMock';
import { createCompressorServiceMock } from './createCompressorServiceMock';
import { createNotificationRepositoryMock } from './createNotificationRepositoryMock';
import { createProcessRepositoryMock } from './createProcessRepositoryMock';
import { createTimeServiceMock } from './createTimeServiceMock';

export function createContextsMocks(): {
  browserWindowContext: BrowserWindowContext;
  mainProcessContext: MainProcessContext;
} {
  const { browserWindowChannel, mainProcessChannel } = createChannelServicesMocks();

  return {
    browserWindowContext: {
      channelService: browserWindowChannel,
      timeService: createTimeServiceMock(),
      mediaRepository: createMediaRepositoryMock(),
      batchRepository: createBatchRepositoryMock(),
      notificationRepository: createNotificationRepositoryMock(),
      processRepository: createProcessRepositoryMock(),
    },
    mainProcessContext: {
      channelService: mainProcessChannel,
      fileSystem: createFileSystemServiceMock(),
      compressor: createCompressorServiceMock(),
    },
  };
}
