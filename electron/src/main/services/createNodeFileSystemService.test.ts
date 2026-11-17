import { mkdir, mkdtemp, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { expect, test } from 'tooling-suite';
import { createNodeFileSystemService } from './createNodeFileSystemService';

async function withDirectory(run: (directory: string) => Promise<void>): Promise<void> {
  const directory = await mkdtemp(join(tmpdir(), 'redecim-fs-test-'));
  try {
    await run(directory);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
}

test('explorePath lists videos recursively, sorted, ignoring other files', async () => {
  await withDirectory(async (directory) => {
    await mkdir(join(directory, 'holidays'));
    await writeFile(join(directory, 'b.mp4'), '');
    await writeFile(join(directory, 'holidays', 'a.MOV'), '');
    await writeFile(join(directory, 'clip.m4v'), '');
    await writeFile(join(directory, 'notes.txt'), '');
    await writeFile(join(directory, 'movie.mkv'), '');

    const result = await createNodeFileSystemService().explorePath(directory);

    expect(result).toEqual({
      type: 'success',
      value: [join(directory, 'b.mp4'), join(directory, 'clip.m4v'), join(directory, 'holidays', 'a.MOV')],
    });
  });
});

test('explorePath rejects a relative path', async () => {
  const result = await createNodeFileSystemService().explorePath('videos');

  expect(result).toEqual({ type: 'failure', error: 'INVALID_PATH' });
});

test('explorePath reports a missing directory', async () => {
  await withDirectory(async (directory) => {
    const result = await createNodeFileSystemService().explorePath(join(directory, 'missing'));

    expect(result).toEqual({ type: 'failure', error: 'PATH_NOT_FOUND' });
  });
});

test('explorePath reports a file that is not a directory', async () => {
  await withDirectory(async (directory) => {
    const filePath = join(directory, 'video.mp4');
    await writeFile(filePath, '');

    const result = await createNodeFileSystemService().explorePath(filePath);

    expect(result).toEqual({ type: 'failure', error: 'NOT_A_DIRECTORY' });
  });
});

test('moveFile replaces the target with the source content', async () => {
  await withDirectory(async (directory) => {
    const sourcePath = join(directory, 'candidate.mp4');
    const targetPath = join(directory, 'original.mp4');
    await writeFile(sourcePath, 'compressed');
    await writeFile(targetPath, 'original');

    const result = await createNodeFileSystemService().moveFile(sourcePath, targetPath);

    expect(result).toEqual({ type: 'success' });
    expect(await readFile(targetPath, 'utf8')).toBe('compressed');
    await expect(stat(sourcePath)).rejects.toThrow();
  });
});

test('moveFile reports a missing source', async () => {
  await withDirectory(async (directory) => {
    const result = await createNodeFileSystemService().moveFile(
      join(directory, 'missing.mp4'),
      join(directory, 'original.mp4'),
    );

    expect(result).toEqual({ type: 'failure', error: 'PATH_NOT_FOUND' });
  });
});

test('deleteFile removes the file', async () => {
  await withDirectory(async (directory) => {
    const filePath = join(directory, 'candidate.mp4');
    await writeFile(filePath, '');

    const result = await createNodeFileSystemService().deleteFile(filePath);

    expect(result).toEqual({ type: 'success' });
    await expect(stat(filePath)).rejects.toThrow();
  });
});

test('deleteFile reports a missing file', async () => {
  await withDirectory(async (directory) => {
    const result = await createNodeFileSystemService().deleteFile(join(directory, 'missing.mp4'));

    expect(result).toEqual({ type: 'failure', error: 'PATH_NOT_FOUND' });
  });
});

test('getFileSize returns the file size in bytes', async () => {
  await withDirectory(async (directory) => {
    const filePath = join(directory, 'video.mp4');
    await writeFile(filePath, 'content-here');

    const result = await createNodeFileSystemService().getFileSize(filePath);

    expect(result).toEqual({ type: 'success', value: 12 });
  });
});

test('getFileSize reports a missing file', async () => {
  await withDirectory(async (directory) => {
    const result = await createNodeFileSystemService().getFileSize(join(directory, 'missing.mp4'));

    expect(result).toEqual({ type: 'failure', error: 'PATH_NOT_FOUND' });
  });
});
