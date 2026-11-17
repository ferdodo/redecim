import type { Batch } from 'core';
import { useContext, useEffect, useState } from 'react';
import { BrowserWindowContext } from '../contexts/BrowserWindowContext';

export function useBatch(): Batch {
  const { batchRepository } = useContext(BrowserWindowContext);
  const [batch, setBatch] = useState<Batch>(() => batchRepository.getBatch());

  useEffect(() => {
    const unsubscribe = batchRepository.observeBatch(setBatch);

    return (): void => {
      unsubscribe();
    };
  }, [batchRepository]);

  return batch;
}
