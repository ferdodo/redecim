import type { Media } from '../entities/Media';
import type { MediaRepository } from '../repositories/MediaRepository';

export function createMediaRepositoryMock(): MediaRepository {
  let medias: Media[] = [];
  let observers: ((medias: Media[]) => void)[] = [];

  const notify = (): void => {
    observers.forEach((observer) => {
      observer(medias);
    });
  };

  return {
    getMedias(): Media[] {
      return medias;
    },
    saveMedia(media: Media): void {
      medias = [...medias, media];
      notify();
    },
    updateMedia(updatedMedia: Media): void {
      medias = medias.map((media) => (media.filePath === updatedMedia.filePath ? updatedMedia : media));
      notify();
    },
    deleteAndReplaceAllMedias(newMedias: Media[]): void {
      medias = [...newMedias];
      notify();
    },
    observeMedias(callback: (medias: Media[]) => void): () => void {
      observers = [...observers, callback];
      callback(medias);
      return (): void => {
        observers = observers.filter((observer) => observer !== callback);
      };
    },
  };
}
