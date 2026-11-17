import { join } from 'node:path';
import { createCompressorService } from 'compressor';
import type { MainProcessContext } from 'core';
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import {
  ApplyCandidateHandler,
  OrchestrateProcessesHandler,
  RemoveCandidateHandler,
  ScanDirectoryHandler,
  SyncProcessesHandler,
} from 'features';
import { createIpcMainChannelService } from './services/createIpcMainChannelService';
import { createNodeFileSystemService } from './services/createNodeFileSystemService';

async function start(): Promise<void> {
  await app.whenReady();

  const window = new BrowserWindow({
    width: 1100,
    height: 800,
    title: 'Redecim',
    titleBarStyle: 'hidden',
    transparent: true,
    webPreferences: {
      preload: join(__dirname, '../preload/preload.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
  });

  const context: MainProcessContext = {
    channelService: createIpcMainChannelService(ipcMain, window.webContents),
    compressor: createCompressorService(),
    fileSystem: createNodeFileSystemService(),
  };

  new ScanDirectoryHandler(context).register();
  new OrchestrateProcessesHandler(context).register();
  new SyncProcessesHandler(context).register();
  new ApplyCandidateHandler(context).register();
  new RemoveCandidateHandler(context).register();

  ipcMain.handle('redecim:select-directory', async (): Promise<string | null> => {
    const result = await dialog.showOpenDialog(window, {
      properties: ['openDirectory'],
    });
    return result.canceled ? null : result.filePaths[0] ?? null;
  });

  ipcMain.handle('redecim:minimize-window', (): void => {
    window.minimize();
  });

  await window.loadFile(join(__dirname, '../renderer/index.html'));
}

app.on('window-all-closed', () => app.quit());

start();
