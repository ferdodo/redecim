import type { Process } from '../entities/Process';

export interface ProcessRepository {
  getProcesses(): Process[];
  upsertProcess(process: Process): void;
  removeProcess(process: Process): void;
  observeProcesses(callback: (processes: Process[]) => void): () => void;
}
