import type { Process } from 'core';
import { useContext, useEffect, useState } from 'react';
import { BrowserWindowContext } from '../contexts/BrowserWindowContext';

export function useProcesses(): Process[] {
  const { processRepository } = useContext(BrowserWindowContext);
  const [processes, setProcesses] = useState<Process[]>(() => processRepository.getProcesses());

  useEffect(() => {
    const unsubscribe = processRepository.observeProcesses(setProcesses);

    return (): void => {
      unsubscribe();
    };
  }, [processRepository]);

  return processes;
}
