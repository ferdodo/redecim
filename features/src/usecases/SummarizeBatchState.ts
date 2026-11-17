import type { BrowserWindowContext } from 'core';

const NBSP = ' ';

export class SummarizeBatchState {
  constructor(private context: BrowserWindowContext) {}

  observe(callback: (summary: string) => void): () => void {
    const { batchRepository, mediaRepository, processRepository } = this.context;

    const generateSummary = (): void => {
      const batch = batchRepository.getBatch();
      const medias = mediaRepository.getMedias();
      const processes = processRepository.getProcesses();

      const totalItems = batch.items.length;
      const itemsWithCandidates = batch.items.filter(
        (item) => !item.error && medias.some((m) => m.filePath === item.mediaPath && m.candidate),
      ).length;
      const itemsProcessing = processes.filter((p) => p.progression < 1).length;
      const processingProgress = processes
        .filter((p) => p.progression < 1)
        .reduce((sum, p) => sum + p.progression, 0);

      let summary: string;

      if (batch.status === 'IDLE') {
        if (medias.length === 0) {
          summary = 'Select a directory to scan for files to compress';
        } else if (totalItems === 0) {
          summary = 'Select media to compress';
        } else if (itemsWithCandidates === 0) {
          summary = `${totalItems} to compress`;
        } else {
          summary = `${itemsWithCandidates}/${totalItems} compressed`;
        }
      } else {
        const totalProgress = itemsWithCandidates + processingProgress;
        const progressPercent = totalItems > 0 ? Math.round((totalProgress / totalItems) * 100) : 0;
        const barLength = 20;
        const filled = Math.round((progressPercent / 100) * barLength);
        const empty = barLength - filled;
        const bar = `[${'='.repeat(filled)}${NBSP.repeat(empty)}]`;

        summary = `${bar} ${progressPercent}% (${itemsWithCandidates}/${totalItems}) ${itemsProcessing > 0 ? `processing: ${itemsProcessing}` : ''}`;
      }

      callback(summary);
    };

    const unsubscribeBatch = batchRepository.observeBatch(generateSummary);
    const unsubscribeMedias = mediaRepository.observeMedias(generateSummary);
    const unsubscribeProcesses = processRepository.observeProcesses(generateSummary);

    return (): void => {
      unsubscribeBatch();
      unsubscribeMedias();
      unsubscribeProcesses();
    };
  }
}
