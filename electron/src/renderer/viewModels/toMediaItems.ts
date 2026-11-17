import type { Batch, Media, Process } from 'core';
import type { BatchWindow } from 'design-system';
import type { ComponentProps } from 'react';

type MediaItemData = ComponentProps<typeof BatchWindow>['mediaItems'][number];

interface MediaActions {
  toggleBatch(media: Media, inBatch: boolean): void;
  applyCandidate(media: Media): void;
  removeCandidate(media: Media): void;
}

function toFileUrl(filePath: string): string {
  return `file://${filePath.split('/').map(encodeURIComponent).join('/')}`;
}

function fileNameOf(filePath: string): string {
  return filePath.split(/[\\/]/).pop() ?? filePath;
}

function stateOf(media: Media, running: Process | undefined, error: string | undefined): MediaItemData['state'] {
  if (running) {
    return 'processing';
  }
  if (error) {
    return 'error';
  }
  return media.candidate ? 'completed' : 'idle';
}

export function toMediaItems(
  medias: Media[],
  batch: Batch,
  processes: Process[],
  actions: MediaActions,
): MediaItemData[] {
  return medias.map((media) => {
    const batchItem = batch.items.find((item) => item.mediaPath === media.filePath);
    const running = processes.find((process) => process.mediaPath === media.filePath && process.progression < 1);
    const inBatch = batchItem !== undefined;
    const { candidate } = media;

    return {
      fileName: fileNameOf(media.filePath),
      originalImage: toFileUrl(media.filePath),
      candidateImage: candidate && toFileUrl(candidate.filePath),
      originalSizeInBytes: media.sizeInBytes,
      candidateSizeInBytes: candidate?.sizeInBytes,
      state: stateOf(media, running, batchItem?.error),
      progression: running && Math.round(running.progression * 100),
      inBatch,
      isVideo: true,
      onToggleBatch: (): void => actions.toggleBatch(media, inBatch),
      onApplyCandidate: candidate && ((): void => actions.applyCandidate(media)),
      onRemoveCandidate: candidate && ((): void => actions.removeCandidate(media)),
    };
  });
}
