import { execFile, spawn } from 'node:child_process';
import { mkdtemp, stat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { basename, extname, join } from 'node:path';
import type { CompressorService, Media, Process } from 'core';
import { CompressionError } from 'core';
import ffmpegPath from 'ffmpeg-static';

type CompressionResult = Awaited<ReturnType<CompressorService['compress']>>;

interface VideoInfo {
  width: number;
  height: number;
  framesPerSecond: number;
  durationInSeconds: number;
}

interface FfmpegRun {
  exitCode: number | null;
  stderr: string;
}

function resolveFfmpeg(): string {
  if (!ffmpegPath) {
    throw new Error('ffmpeg-static provides no binary for this platform');
  }
  // Packaged Electron apps cannot spawn binaries from inside the asar archive.
  return ffmpegPath.replace(/app\.asar([\\/])/, 'app.asar.unpacked$1');
}

const ffmpeg: string = resolveFfmpeg();

function readFfmpegStderr(args: string[]): Promise<string> {
  return new Promise((resolve) => {
    execFile(ffmpeg, args, (_error, _stdout, stderr) => resolve(stderr));
  });
}

function runFfmpeg(args: string[], onProgressSeconds: (seconds: number) => void): Promise<FfmpegRun> {
  return new Promise((resolve) => {
    const child = spawn(ffmpeg, args);
    let stderr = '';
    let pendingProgress = '';

    child.stderr.on('data', (chunk: Buffer) => {
      stderr += chunk.toString();
    });
    child.stdout.on('data', (chunk: Buffer) => {
      const lines = (pendingProgress + chunk.toString()).split('\n');
      pendingProgress = lines.pop() ?? '';
      for (const line of lines) {
        const outTime = line.match(/^out_time_us=(\d+)/);
        if (outTime) {
          onProgressSeconds(Number(outTime[1]) / 1_000_000);
        }
      }
    });
    child.on('error', () => resolve({ exitCode: null, stderr }));
    child.on('close', (exitCode) => resolve({ exitCode, stderr }));
  });
}

async function probe(filePath: string): Promise<VideoInfo | null> {
  const stderr = await readFfmpegStderr(['-hide_banner', '-i', filePath]);
  const dimensions = stderr.match(/Video:.*?\b(\d{2,})x(\d{2,})\b/);
  const framesPerSecond = stderr.match(/([\d.]+) fps/);
  const duration = stderr.match(/Duration: (\d+):(\d+):([\d.]+)/);

  if (!dimensions || !framesPerSecond || !duration) {
    return null;
  }

  return {
    width: Number(dimensions[1]),
    height: Number(dimensions[2]),
    framesPerSecond: Number(framesPerSecond[1]),
    durationInSeconds: Number(duration[1]) * 3600 + Number(duration[2]) * 60 + Number(duration[3]),
  };
}

function failure(error: CompressionError): CompressionResult {
  return { type: 'failure', error };
}

async function isFile(filePath: string): Promise<boolean> {
  return stat(filePath).then(
    (stats) => stats.isFile(),
    () => false,
  );
}

export function createCompressorService(): CompressorService {
  const runningProcesses = new Map<string, Process>();

  async function encode(media: Media, video: VideoInfo, bitrate: number): Promise<CompressionResult> {
    const outputDirectory = await mkdtemp(join(tmpdir(), 'redecim-'));
    const outputFilePath = join(outputDirectory, `${basename(media.filePath, extname(media.filePath))}.mp4`);
    const pixelsPerSecond = video.width * video.height * video.framesPerSecond;
    const running: Process = {
      mediaPath: media.filePath,
      progression: 0,
      creationTimestampSecond: Math.floor(Date.now() / 1000),
      outputFilePath,
      outputSizeInBytes: 0,
      outputBitsPerPixel: 0,
    };
    runningProcesses.set(media.filePath, running);

    const { exitCode, stderr } = await runFfmpeg(
      [
        '-hide_banner',
        '-nostats',
        '-progress',
        'pipe:1',
        '-i',
        media.filePath,
        '-c:v',
        'libx264',
        '-b:v',
        `${bitrate}`,
        '-maxrate',
        `${bitrate}`,
        '-bufsize',
        `${bitrate * 2}`,
        '-c:a',
        'copy',
        '-y',
        outputFilePath,
      ],
      (seconds) => {
        const progression = Math.min(seconds / video.durationInSeconds, 0.99);
        runningProcesses.set(media.filePath, { ...running, progression });
      },
    );

    const videoStreamSize = stderr.match(/video:(\d+)\s*Ki?B/);
    if (exitCode !== 0 || !videoStreamSize) {
      return failure(CompressionError.IO_ERROR);
    }

    const videoStreamBits = Number(videoStreamSize[1]) * 1024 * 8;
    return {
      type: 'success',
      value: {
        ...running,
        progression: 1,
        outputSizeInBytes: (await stat(outputFilePath)).size,
        outputBitsPerPixel: videoStreamBits / (pixelsPerSecond * video.durationInSeconds),
      },
    };
  }

  return {
    async compress(media: Media, targetMaxBitsPerPixel: number): Promise<CompressionResult> {
      if (!(targetMaxBitsPerPixel > 0)) {
        return failure(CompressionError.INVALID_TARGET_QUALITY);
      }

      if (!(await isFile(media.filePath))) {
        return failure(CompressionError.IO_ERROR);
      }

      const video = await probe(media.filePath);
      if (!video) {
        return failure(CompressionError.FORMAT_NOT_SUPPORTED);
      }

      const bitrate = Math.floor(targetMaxBitsPerPixel * video.width * video.height * video.framesPerSecond);
      try {
        return await encode(media, video, bitrate);
      } finally {
        runningProcesses.delete(media.filePath);
      }
    },

    async listProcesses(): Promise<Process[]> {
      return [...runningProcesses.values()];
    },
  };
}
