import type { Batch, Media } from 'core';
import { createCompletedProcess, createMedia, createMediaWithCandidate, createProcess } from 'core';
import { expect, test } from 'tooling-suite';
import { toMediaItems } from './toMediaItems';

const idleBatch: Batch = { items: [], status: 'IDLE', targetMaxBitsPerPixel: 0.1 };

function recordingActions(): { calls: string[]; actions: Parameters<typeof toMediaItems>[3] } {
  const calls: string[] = [];
  return {
    calls,
    actions: {
      toggleBatch: (media: Media, inBatch: boolean): void => {
        calls.push(`toggle ${media.filePath} ${inBatch}`);
      },
      applyCandidate: (media: Media): void => {
        calls.push(`apply ${media.filePath}`);
      },
      removeCandidate: (media: Media): void => {
        calls.push(`remove ${media.filePath}`);
      },
    },
  };
}

test('maps an idle media outside the batch', () => {
  const { actions } = recordingActions();
  const media: Media = { filePath: '/home/me/my videos/clip #1.mp4', sizeInBytes: 1000, bitsPerPixel: 1 };

  const [item] = toMediaItems([media], idleBatch, [], actions);

  expect(item).toMatchObject({
    fileName: 'clip #1.mp4',
    originalImage: 'file:///home/me/my%20videos/clip%20%231.mp4',
    originalSizeInBytes: 1000,
    state: 'idle',
    inBatch: false,
    isVideo: true,
  });
  expect(item.candidateImage).toBeUndefined();
  expect(item.progression).toBeUndefined();
  expect(item.onApplyCandidate).toBeUndefined();
  expect(item.onRemoveCandidate).toBeUndefined();
});

test('shows a running compression as processing with a percentage', () => {
  const { actions } = recordingActions();

  const [item] = toMediaItems([createMedia()], idleBatch, [createProcess()], actions);

  expect(item.state).toBe('processing');
  expect(item.progression).toBe(50);
});

test('ignores a finished process', () => {
  const { actions } = recordingActions();

  const [item] = toMediaItems([createMedia()], idleBatch, [createCompletedProcess()], actions);

  expect(item.state).toBe('idle');
});

test('shows a batch error', () => {
  const { actions } = recordingActions();
  const batch: Batch = { ...idleBatch, items: [{ mediaPath: createMedia().filePath, error: 'IO_ERROR' }] };

  const [item] = toMediaItems([createMedia()], batch, [], actions);

  expect(item.state).toBe('error');
  expect(item.inBatch).toBe(true);
});

test('exposes the candidate and its actions once compressed', () => {
  const { calls, actions } = recordingActions();

  const [item] = toMediaItems([createMediaWithCandidate()], idleBatch, [], actions);
  item.onApplyCandidate?.();
  item.onRemoveCandidate?.();

  expect(item.state).toBe('completed');
  expect(item.candidateImage).toBe('file:///path/image.candidate.png');
  expect(item.candidateSizeInBytes).toBe(300);
  expect(calls).toEqual(['apply /path/image.png', 'remove /path/image.png']);
});

test('toggles batch membership according to the current state', () => {
  const { calls, actions } = recordingActions();
  const batch: Batch = { ...idleBatch, items: [{ mediaPath: createMedia().filePath }] };

  toMediaItems([createMedia()], idleBatch, [], actions)[0].onToggleBatch();
  toMediaItems([createMedia()], batch, [], actions)[0].onToggleBatch();

  expect(calls).toEqual(['toggle /path/image.png false', 'toggle /path/image.png true']);
});
