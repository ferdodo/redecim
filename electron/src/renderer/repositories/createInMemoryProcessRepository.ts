import type { Process, ProcessRepository } from 'core';
import { createObservableValue } from './createObservableValue';

export function createInMemoryProcessRepository(): ProcessRepository {
  const processes = createObservableValue<Process[]>([]);

  return {
    getProcesses(): Process[] {
      return processes.get();
    },
    upsertProcess(process: Process): void {
      const current = processes.get();
      const exists = current.some((existing) => existing.mediaPath === process.mediaPath);
      processes.set(
        exists
          ? current.map((existing) => (existing.mediaPath === process.mediaPath ? process : existing))
          : [...current, process],
      );
    },
    removeProcess(process: Process): void {
      processes.set(processes.get().filter((existing) => existing.mediaPath !== process.mediaPath));
    },
    observeProcesses(callback: (processes: Process[]) => void): () => void {
      return processes.observe(callback);
    },
  };
}
