import { MediaLibraryScanner } from 'design-system';
import type { ReactElement } from 'react';
import { useState } from 'react';

export function MediaLibraryScannerDocumentation(): ReactElement {
  const sampleVideo = '/sample-video.mp4';
  const [path, setPath] = useState('/home/user/videos');

  return (
    <MediaLibraryScanner
      path={path}
      onPathChange={setPath}
      onScan={() => {}}
      items={[
        {
          fileName: 'video1.mp4',
          originalImage: sampleVideo,
          candidateImage: sampleVideo,
          originalSizeInBytes: 2500000,
          candidateSizeInBytes: 1600000,
          state: 'completed',
          inBatch: true,
          onToggleBatch: () => {},
          isVideo: true,
          onApplyCandidate: () => {},
          onRemoveCandidate: () => {},
        },
        {
          fileName: 'video2.mp4',
          originalImage: sampleVideo,
          candidateImage: sampleVideo,
          originalSizeInBytes: 1800000,
          candidateSizeInBytes: 1200000,
          state: 'processing',
          progression: 65,
          inBatch: true,
          onToggleBatch: () => {},
          isVideo: true,
          onApplyCandidate: () => {},
          onRemoveCandidate: () => {},
        },
        {
          fileName: 'video3.mp4',
          originalImage: sampleVideo,
          originalSizeInBytes: 3200000,
          state: 'idle',
          inBatch: false,
          onToggleBatch: () => {},
          isVideo: true,
        },
      ]}
    />
  );
}
