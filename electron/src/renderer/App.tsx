import type { Media } from 'core';
import { BatchWindow } from 'design-system';
import {
  AddMediaToBatch,
  ApplyCandidate,
  ConfigureBatch,
  RemoveCandidate,
  RemoveMediaFromBatch,
  ScanDirectory,
  StartBatch,
  SummarizeBatchState,
} from 'features';
import { type ReactElement, useContext, useMemo, useState } from 'react';
import { BrowserWindowContext } from './contexts/BrowserWindowContext';
import { getBridge } from './getBridge';
import { useBatch } from './hooks/useBatch';
import { useMedias } from './hooks/useMedias';
import { useProcesses } from './hooks/useProcesses';
import { useSummary } from './hooks/useSummary';
import { toMediaItems } from './viewModels/toMediaItems';

export function App(): ReactElement {
  const context = useContext(BrowserWindowContext);
  const medias = useMedias();
  const batch = useBatch();
  const processes = useProcesses();
  const summary = useSummary();
  const [path, setPath] = useState('');
  const [isScanning, setIsScanning] = useState(false);

  const useCases = useMemo(
    () => ({
      scanDirectory: new ScanDirectory(context),
      addMediaToBatch: new AddMediaToBatch(context),
      removeMediaFromBatch: new RemoveMediaFromBatch(context),
      configureBatch: new ConfigureBatch(context),
      startBatch: new StartBatch(context),
      applyCandidate: new ApplyCandidate(context),
      removeCandidate: new RemoveCandidate(context),
      summarizeBatchState: new SummarizeBatchState(context),
    }),
    [context],
  );

  const scan = async (): Promise<void> => {
    setIsScanning(true);
    try {
      await useCases.scanDirectory.execute(path);
    } finally {
      setIsScanning(false);
    }
  };

  const selectDirectory = async (): Promise<void> => {
    const bridge = getBridge();
    const selected = (await bridge.invoke('redecim:select-directory', null)) as string | null;
    if (selected) {
      setPath(selected);
    }
  };

  const minimize = async (): Promise<void> => {
    const bridge = getBridge();
    await bridge.invoke('redecim:minimize-window', null);
  };

  const mediaItems = toMediaItems(medias, batch, processes, {
    toggleBatch: (media: Media, inBatch: boolean): void =>
      inBatch ? useCases.removeMediaFromBatch.execute(media) : useCases.addMediaToBatch.execute(media),
    applyCandidate: (media: Media): Promise<void> => useCases.applyCandidate.execute(media),
    removeCandidate: (media: Media): Promise<void> => useCases.removeCandidate.execute(media),
  });

  return (
    <div style={{ height: '100%', display: 'flex' }}>
      <BatchWindow
        title="Redecim"
        path={path}
        onPathChange={setPath}
        onSelectDirectory={selectDirectory}
        onScan={scan}
        isScanning={isScanning}
        mediaItems={mediaItems}
        status={batch.status}
        targetMaxBitsPerPixel={batch.targetMaxBitsPerPixel}
        onTargetMaxBitsPerPixelChange={(target: number): void => useCases.configureBatch.execute(target)}
        onStart={(): void => useCases.startBatch.execute()}
        onClose={(): void => window.close()}
        onMinimize={minimize}
        summary={summary}
      />
    </div>
  );
}
