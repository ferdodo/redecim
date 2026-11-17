import type { ChannelService } from '../services/ChannelService';
import type { TimeService } from '../services/TimeService';
import type { MediaRepository } from '../repositories/MediaRepository';
import type { BatchRepository } from '../repositories/BatchRepository';
import type { NotificationRepository } from '../repositories/NotificationRepository';
import type { ProcessRepository } from '../repositories/ProcessRepository';

export interface BrowserWindowContext {
  channelService: ChannelService;
  timeService: TimeService;
  mediaRepository: MediaRepository;
  batchRepository: BatchRepository;
  notificationRepository: NotificationRepository;
  processRepository: ProcessRepository;
}
