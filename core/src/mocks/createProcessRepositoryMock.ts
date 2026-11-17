import type { Process } from '../entities/Process';
import type { ProcessRepository } from '../repositories/ProcessRepository';

export function createProcessRepositoryMock(): ProcessRepository {
  let processes: Process[] = [];
  let observers: ((processes: Process[]) => void)[] = [];

  const notify = (): void => {
    observers.forEach((observer) => {
      observer(processes);
    });
  };

  return {
    getProcesses(): Process[] {
      return processes;
    },
    upsertProcess(process: Process): void {
      const exists = processes.some((existing) => existing.mediaPath === process.mediaPath);
      processes = exists
        ? processes.map((existing) => (existing.mediaPath === process.mediaPath ? process : existing))
        : [...processes, process];
      notify();
    },
    removeProcess(process: Process): void {
      processes = processes.filter((existing) => existing.mediaPath !== process.mediaPath);
      notify();
    },
    observeProcesses(callback: (processes: Process[]) => void): () => void {
      observers = [...observers, callback];
      callback(processes);
      return (): void => {
        observers = observers.filter((observer) => observer !== callback);
      };
    },
  };
}
