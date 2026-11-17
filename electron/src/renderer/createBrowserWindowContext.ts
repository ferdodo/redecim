import type { BrowserWindowContext } from 'core';
import type { RedecimBridge } from '../shared/RedecimBridge';
import { createInMemoryBatchRepository } from './repositories/createInMemoryBatchRepository';
import { createInMemoryMediaRepository } from './repositories/createInMemoryMediaRepository';
import { createInMemoryNotificationRepository } from './repositories/createInMemoryNotificationRepository';
import { createInMemoryProcessRepository } from './repositories/createInMemoryProcessRepository';
import { createBrowserTimeService } from './services/createBrowserTimeService';
import { createIpcRendererChannelService } from './services/createIpcRendererChannelService';

export function createBrowserWindowContext(bridge: RedecimBridge): BrowserWindowContext {
  return {
    channelService: createIpcRendererChannelService(bridge),
    timeService: createBrowserTimeService(),
    mediaRepository: createInMemoryMediaRepository(),
    batchRepository: createInMemoryBatchRepository(),
    notificationRepository: createInMemoryNotificationRepository(),
    processRepository: createInMemoryProcessRepository(),
  };
}
