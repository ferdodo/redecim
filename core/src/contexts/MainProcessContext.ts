import type { ChannelService } from '../services/ChannelService';
import type { CompressorService } from '../services/CompressorService';
import type { FileSystemService } from '../services/FileSystemService';

export interface MainProcessContext {
  channelService: ChannelService;
  compressor: CompressorService;
  fileSystem: FileSystemService;
}
