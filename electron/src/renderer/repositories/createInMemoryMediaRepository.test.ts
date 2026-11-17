import { createAnotherMedia, createMedia, createMediaWithCandidate } from 'core';
import type { Media } from 'core';
import { expect, test } from 'tooling-suite';
import { createInMemoryMediaRepository } from './createInMemoryMediaRepository';

test('saves, updates and replaces medias with a new array each time', () => {
  const repository = createInMemoryMediaRepository();
  const snapshots: Media[][] = [];
  repository.observeMedias((medias) => snapshots.push(medias));

  repository.saveMedia(createMedia());
  repository.updateMedia(createMediaWithCandidate());
  repository.deleteAndReplaceAllMedias([createAnotherMedia()]);

  expect(snapshots).toEqual([[], [createMedia()], [createMediaWithCandidate()], [createAnotherMedia()]]);
  expect(new Set(snapshots).size).toBe(snapshots.length);
  expect(repository.getMedias()).toEqual([createAnotherMedia()]);
});

test('updateMedia leaves other medias untouched', () => {
  const repository = createInMemoryMediaRepository();
  repository.deleteAndReplaceAllMedias([createMedia(), createAnotherMedia()]);

  repository.updateMedia(createMediaWithCandidate());

  expect(repository.getMedias()).toEqual([createMediaWithCandidate(), createAnotherMedia()]);
});
