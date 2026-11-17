import { SummarizeBatchState } from 'features';
import { useContext, useEffect, useState } from 'react';
import { BrowserWindowContext } from '../contexts/BrowserWindowContext';

export function useSummary(): string {
  const context = useContext(BrowserWindowContext);
  const [summary, setSummary] = useState('');

  useEffect(() => {
    const unsubscribe = new SummarizeBatchState(context).observe(setSummary);

    return (): void => {
      unsubscribe();
    };
  }, [context]);

  return summary;
}
