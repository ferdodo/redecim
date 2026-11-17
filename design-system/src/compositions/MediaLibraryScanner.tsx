import type { ReactElement } from 'react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Stack } from '../components/Stack';
import { theme } from '../theme';
import { MediaBatchGallery } from './MediaBatchGallery';

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

interface MediaLibraryScannerProps {
  path: string;
  onPathChange: (path: string) => void;
  onSelectDirectory?: () => void | Promise<void>;
  onScan: () => void;
  isScanning?: boolean;
  items: MediaItemData[];
}

export function MediaLibraryScanner({
  path,
  onPathChange,
  onSelectDirectory,
  onScan,
  isScanning = false,
  items,
}: MediaLibraryScannerProps): ReactElement {
  return (
    <Stack gap="large">
      <div style={{ display: 'flex', gap: theme.spacing.large, alignItems: 'flex-end' }}>
        <div style={{ flex: 1 }}>
          <Input
            label="Folder path"
            value={path}
            onChange={onPathChange}
            placeholder="Click to select directory"
            disabled={isScanning}
            readOnly={!!onSelectDirectory}
            onClick={onSelectDirectory && !isScanning ? onSelectDirectory : undefined}
          />
        </div>
        <Button
          label={isScanning ? 'Scanning...' : 'Scan'}
          onClick={onScan}
          disabled={isScanning || !path}
          variant="primary"
        />
      </div>

      <MediaBatchGallery items={items} />
    </Stack>
  );
}
