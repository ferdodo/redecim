import { MediaItem, Panel, Stack } from 'design-system';
import type { ReactElement } from 'react';

export function MediaItemDocumentation(): ReactElement {
  const sampleVideo = '/sample-video.mp4';

  return (
    <Panel title="MediaItem">
      <Stack gap="large">
      <MediaItem
        fileName="video1.mp4"
        originalImage={sampleVideo}
        candidateImage={sampleVideo}
        originalSizeInBytes={2500000}
        candidateSizeInBytes={1600000}
        state="completed"
        inBatch={true}
        onToggleBatch={() => {}}
        isVideo={true}
        onApplyCandidate={() => {}}
        onRemoveCandidate={() => {}}
      />

      <MediaItem
        fileName="video2.mp4"
        originalImage={sampleVideo}
        candidateImage={sampleVideo}
        originalSizeInBytes={1800000}
        candidateSizeInBytes={1200000}
        state="processing"
        progression={65}
        inBatch={true}
        onToggleBatch={() => {}}
        isVideo={true}
        onApplyCandidate={() => {}}
        onRemoveCandidate={() => {}}
      />

      <MediaItem
        fileName="video3.mp4"
        originalImage={sampleVideo}
        originalSizeInBytes={3200000}
        state="idle"
        inBatch={false}
        onToggleBatch={() => {}}
        isVideo={true}
      />
      </Stack>
    </Panel>
  );
}
