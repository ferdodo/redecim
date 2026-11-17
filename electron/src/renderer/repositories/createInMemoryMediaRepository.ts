import type { Media, MediaRepository } from 'core';
import { createObservableValue } from './createObservableValue';

export function createInMemoryMediaRepository(): MediaRepository {
  const medias = createObservableValue<Media[]>([]);

  return {
    getMedias(): Media[] {
      return medias.get();
    },
    saveMedia(media: Media): void {
      medias.set([...medias.get(), media]);
    },
    updateMedia(updatedMedia: Media): void {
      medias.set(medias.get().map((media) => (media.filePath === updatedMedia.filePath ? updatedMedia : media)));
    },
    deleteAndReplaceAllMedias(newMedias: Media[]): void {
      medias.set([...newMedias]);
    },
    observeMedias(callback: (medias: Media[]) => void): () => void {
      return medias.observe(callback);
    },
  };
}
