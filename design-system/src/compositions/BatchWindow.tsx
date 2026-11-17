import type { ReactElement } from 'react';
import { Window } from '../components';
import { theme } from '../theme';
import { BatchControls } from './BatchControls';
import { MediaLibraryScanner } from './MediaLibraryScanner';

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

interface BatchWindowProps {
  title?: string;
  path: string;
  onPathChange: (path: string) => void;
  onSelectDirectory?: () => void | Promise<void>;
  mediaItems: MediaItemData[];
  isScanning?: boolean;
  status: 'IDLE' | 'PROCESSING';
  targetMaxBitsPerPixel: number;
  onTargetMaxBitsPerPixelChange: (targetMaxBitsPerPixel: number) => void;
  onStart: () => void;
  onScan: () => void;
  onClose?: () => void;
  onMinimize?: () => void;
  summary: string;
}

export function BatchWindow({
  title = 'Batch Processor',
  path,
  onPathChange,
  onSelectDirectory,
  mediaItems,
  isScanning = false,
  status,
  targetMaxBitsPerPixel,
  onTargetMaxBitsPerPixelChange,
  onStart,
  onScan,
  onClose,
  onMinimize,
  summary,
}: BatchWindowProps): ReactElement {
  const hasSelection = mediaItems.some((item) => item.inBatch);

  return (
    <Window title={title} onClose={onClose} onMinimize={onMinimize}>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          minHeight: 0,
        }}
      >
        <div style={{ flex: 1, minWidth: 0, minHeight: 0, overflow: 'auto', paddingBottom: theme.spacing.large }}>
          <div style={{ paddingRight: theme.spacing.large }}>
            <MediaLibraryScanner
              path={path}
              onPathChange={onPathChange}
              onSelectDirectory={onSelectDirectory}
              onScan={onScan}
              isScanning={isScanning}
              items={mediaItems}
            />
          </div>
        </div>

        <div style={{ flex: 0, minWidth: 0, paddingTop: theme.spacing.large }}>
          <BatchControls
            status={status}
            targetMaxBitsPerPixel={targetMaxBitsPerPixel}
            onTargetMaxBitsPerPixelChange={onTargetMaxBitsPerPixelChange}
            onStart={onStart}
            summary={summary}
            canStart={hasSelection}
          />
        </div>
      </div>
    </Window>
  );
}
