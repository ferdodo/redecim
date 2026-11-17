import type { ReactElement } from 'react';
import { MediaItem } from '../components/MediaItem';
import { Stack } from '../components/Stack';
import { theme } from '../theme';

interface MediaItemData {
  fileName: string;
  originalImage: string;
  candidateImage?: string;
  originalSizeInBytes: number;
  candidateSizeInBytes?: number;
  state: 'idle' | 'processing' | 'completed' | 'error';
  progression?: number;
  inBatch: boolean;
  onToggleBatch: () => void;
  isVideo?: boolean;
  onApplyCandidate?: () => void;
  onRemoveCandidate?: () => void;
}

interface MediaBatchGalleryProps {
  items: MediaItemData[];
}

export function MediaBatchGallery({ items }: MediaBatchGalleryProps): ReactElement {
  const itemsInBatch = items.filter((item) => item.inBatch).length;
  const sortedItems = [...items].sort((a, b) => b.originalSizeInBytes - a.originalSizeInBytes);

  return (
    <Stack gap="large">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: theme.colors.textMuted, fontSize: '12px', fontFamily: theme.fontFamily }}>
          {itemsInBatch} / {items.length} media selected
        </span>
      </div>

      {items.length === 0 ? (
        <div style={{ textAlign: 'center', padding: theme.spacing.large, color: theme.colors.textMuted, fontFamily: theme.fontFamily }}>
          No media available
        </div>
      ) : (
        <Stack gap="medium">
          {sortedItems.map((item, index) => (
            <MediaItem key={`${item.fileName}-${index}`} {...item} />
          ))}
        </Stack>
      )}
    </Stack>
  );
}
