import type { BrowserWindowContext } from 'core';

export class RecoverCandidate {
  constructor(private context: BrowserWindowContext) {}

  register(): void {
    const { mediaRepository, processRepository } = this.context;

    processRepository.observeProcesses((processes) => {
      const completedProcess = processes.find((process) => process.progression === 1);

      if (!completedProcess) {
        return;
      }

      const media = mediaRepository.getMedias().find((media) => media.filePath === completedProcess.mediaPath);

      if (media) {
        mediaRepository.updateMedia({
          ...media,
          candidate: {
            filePath: completedProcess.outputFilePath,
            sizeInBytes: completedProcess.outputSizeInBytes,
            bitsPerPixel: completedProcess.outputBitsPerPixel,
          },
        });
      }

      processRepository.removeProcess(completedProcess);
    });
  }
}
