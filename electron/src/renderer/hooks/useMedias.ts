import type { Media } from 'core';
import { useContext, useEffect, useState } from 'react';
import { BrowserWindowContext } from '../contexts/BrowserWindowContext';

export function useMedias(): Media[] {
  const { mediaRepository } = useContext(BrowserWindowContext);
  const [medias, setMedias] = useState<Media[]>(() => mediaRepository.getMedias());

  useEffect(() => {
    const unsubscribe = mediaRepository.observeMedias(setMedias);

    return (): void => {
      unsubscribe();
    };
  }, [mediaRepository]);

  return medias;
}
