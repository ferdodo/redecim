import { execFile } from 'node:child_process';
import { mkdtemp, rm, stat, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import type { Media, Process } from 'core';
import ffmpegPath from 'ffmpeg-static';
import { expect, test } from 'tooling-suite';
import { createCompressorService } from './createCompressorService';

const timeout = 300_000;
const sampleVideoPath: string = resolve('fixtures/sample-video.mp4');

function mediaAt(filePath: string): Media {
  return { filePath, sizeInBytes: 0, bitsPerPixel: 24 };
}

function ffmpegStderr(args: string[]): Promise<string> {
  return new Promise((done) => {
    execFile(ffmpegPath as string, args, (_error, _stdout, stderr) => done(stderr));
  });
}

async function durationInSeconds(filePath: string): Promise<number> {
  const [, hours, minutes, seconds] = (await ffmpegStderr(['-hide_banner', '-i', filePath])).match(
    /Duration: (\d+):(\d+):([\d.]+)/,
  ) as RegExpMatchArray;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

async function compressSample(targetMaxBitsPerPixel: number): Promise<Process> {
  const result = await createCompressorService().compress(mediaAt(sampleVideoPath), targetMaxBitsPerPixel);
  if (result.type !== 'success') {
    throw new Error(`compression failed: ${result.error}`);
  }
  return result.value;
}

async function cleanup(compression: Process): Promise<void> {
  await rm(dirname(compression.outputFilePath), { recursive: true, force: true });
}

test(
  'compresses a real video into a playable h264 file of the same duration',
  async () => {
    const compression = await compressSample(0.02);

    const output = await stat(compression.outputFilePath);
    expect(output.isFile()).toBe(true);
    expect(compression.outputSizeInBytes).toBe(output.size);
    expect(output.size).toBeLessThan((await stat(sampleVideoPath)).size);
    expect(await ffmpegStderr(['-v', 'error', '-i', compression.outputFilePath, '-f', 'null', '-'])).toBe('');
    expect(await ffmpegStderr(['-hide_banner', '-i', compression.outputFilePath])).toMatch(/Video: h264/);
    expect(await durationInSeconds(compression.outputFilePath)).toBeCloseTo(
      await durationInSeconds(sampleVideoPath),
      0,
    );

    await cleanup(compression);
  },
  timeout,
);

test(
  'keeps the video stream under the target bits per pixel',
  async () => {
    const compression = await compressSample(0.02);

    expect(compression.outputBitsPerPixel).toBeGreaterThan(0);
    expect(compression.outputBitsPerPixel).toBeLessThanOrEqual(0.02 * 1.1);

    await cleanup(compression);
  },
  timeout,
);

test(
  'produces a smaller video for a lower target',
  async () => {
    const low = await compressSample(0.01);
    const high = await compressSample(0.04);

    expect(low.outputSizeInBytes).toBeLessThan(high.outputSizeInBytes);
    expect(low.outputBitsPerPixel).toBeLessThan(high.outputBitsPerPixel);

    await cleanup(low);
    await cleanup(high);
  },
  timeout,
);

test(
  'writes each compression in its own temporary directory without touching the source',
  async () => {
    const sourceSizeBefore = (await stat(sampleVideoPath)).size;
    const first = await compressSample(0.02);
    const second = await compressSample(0.02);

    expect(dirname(dirname(first.outputFilePath))).toBe(tmpdir());
    expect(dirname(first.outputFilePath)).not.toBe(dirname(second.outputFilePath));
    expect((await stat(sampleVideoPath)).size).toBe(sourceSizeBefore);

    await cleanup(first);
    await cleanup(second);
  },
  timeout,
);

test(
  'reports progress while compressing and stops listing the compression once done',
  async () => {
    const compressor = createCompressorService();
    let done = false;
    const compressing = compressor.compress(mediaAt(sampleVideoPath), 0.02).finally(() => {
      done = true;
    });

    const snapshots: Process[] = [];
    while (!done) {
      snapshots.push(...(await compressor.listProcesses()));
      await new Promise((wait) => setTimeout(wait, 50));
    }
    const result = await compressing;

    expect(snapshots.length).toBeGreaterThan(0);
    expect(snapshots.every((snapshot) => snapshot.mediaPath === sampleVideoPath)).toBe(true);
    expect(snapshots.every((snapshot) => snapshot.progression >= 0 && snapshot.progression < 1)).toBe(true);
    expect(snapshots.some((snapshot) => snapshot.progression > 0)).toBe(true);
    expect(await compressor.listProcesses()).toEqual([]);
    expect(result.type === 'success' && result.value.progression).toBe(1);

    if (result.type === 'success') {
      await cleanup(result.value);
    }
  },
  timeout,
);

test('rejects a non positive target', async () => {
  const result = await createCompressorService().compress(mediaAt(sampleVideoPath), 0);

  expect(result).toEqual({ type: 'failure', error: 'INVALID_TARGET_QUALITY' });
});

test('fails with an io error when the file does not exist', async () => {
  const result = await createCompressorService().compress(mediaAt(join(tmpdir(), 'redecim-missing.mp4')), 0.02);

  expect(result).toEqual({ type: 'failure', error: 'IO_ERROR' });
});

test('rejects a file that is not a video', async () => {
  const directory = await mkdtemp(join(tmpdir(), 'redecim-test-'));
  const textFilePath = join(directory, 'notes.mp4');
  await writeFile(textFilePath, 'not a video');

  const result = await createCompressorService().compress(mediaAt(textFilePath), 0.02);

  expect(result).toEqual({ type: 'failure', error: 'FORMAT_NOT_SUPPORTED' });
  await rm(directory, { recursive: true, force: true });
});
