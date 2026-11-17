import type { Media } from '../entities/Media';

export interface MediaRepository {
  getMedias(): Media[];
  saveMedia(media: Media): void;
  updateMedia(media: Media): void;
  deleteAndReplaceAllMedias(medias: Media[]): void;
  observeMedias(callback: (medias: Media[]) => void): () => void;
}
