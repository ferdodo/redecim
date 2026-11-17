import type { ChannelService } from 'core';
import { expect, test } from 'tooling-suite';
import { createIpcRendererChannelService } from '../../renderer/services/createIpcRendererChannelService';
import { createIpcMainChannelService } from './createIpcMainChannelService';

type Listener = (...args: unknown[]) => unknown;

function connectProcesses(): { main: ChannelService; renderer: ChannelService } {
  const mainListeners = new Map<string, Listener>();
  const rendererListeners = new Map<string, Listener>();
  const fakeEvent = {};

  const ipcMain = {
    handle: (channel: string, listener: Listener): void => {
      mainListeners.set(channel, listener);
    },
    on: (channel: string, listener: Listener): void => {
      mainListeners.set(channel, listener);
    },
  };
  const webContents = {
    send: (channel: string, payload: unknown): void => {
      rendererListeners.get(channel)?.(structuredClone(payload));
    },
  };
  const bridge = {
    invoke: async (channel: string, payload: unknown): Promise<unknown> =>
      mainListeners.get(channel)?.(fakeEvent, structuredClone(payload)),
    send: (channel: string, payload: unknown): void => {
      mainListeners.get(channel)?.(fakeEvent, structuredClone(payload));
    },
    on: (channel: string, listener: Listener): void => {
      rendererListeners.set(channel, listener);
    },
  };

  return {
    main: createIpcMainChannelService(ipcMain, webContents),
    renderer: createIpcRendererChannelService(bridge),
  };
}

test('renderer calls a handler registered in main', async () => {
  const { main, renderer } = connectProcesses();
  main.handle<{ path: string }, string>('scan-directory', async ({ path }) => `scanned ${path}`);

  expect(await renderer.call('scan-directory', { path: '/videos' })).toBe('scanned /videos');
});

test('renderer call fails when main has no handler', async () => {
  const { renderer } = connectProcesses();

  await expect(renderer.call('unknown', undefined)).rejects.toThrow('No handler registered for event: unknown');
});

test('main calls a handler registered in renderer', async () => {
  const { main, renderer } = connectProcesses();
  renderer.handle<number, number>('double', async (value) => value * 2);

  expect(await main.call('double', 21)).toBe(42);
});

test('main call fails when renderer handler throws', async () => {
  const { main, renderer } = connectProcesses();
  renderer.handle('explode', async () => {
    throw new Error('boom');
  });

  await expect(main.call('explode', undefined)).rejects.toThrow('boom');
});

test('main call fails when renderer has no handler', async () => {
  const { main } = connectProcesses();

  await expect(main.call('unknown', undefined)).rejects.toThrow('No handler registered for event: unknown');
});

test('publications reach every subscriber of the other process only', () => {
  const { main, renderer } = connectProcesses();
  const receivedByMain: unknown[] = [];
  const receivedByRenderer: unknown[] = [];
  main.subscribe('progress', (data) => receivedByMain.push(data));
  main.subscribe('progress', (data) => receivedByMain.push(data));
  renderer.subscribe('progress', (data) => receivedByRenderer.push(data));
  renderer.subscribe('other', (data) => receivedByRenderer.push(data));

  renderer.publish('progress', 0.5);
  main.publish('progress', 0.75);

  expect(receivedByMain).toEqual([0.5, 0.5]);
  expect(receivedByRenderer).toEqual([0.75]);
});
