import { contextBridge, ipcRenderer } from 'electron';
import type { RedecimBridge } from '../shared/RedecimBridge';
import { ipcChannels } from '../shared/ipcChannels';

const allowedChannels = new Set<string>(Object.values(ipcChannels));

function assertAllowed(channel: string): void {
  if (!allowedChannels.has(channel)) {
    throw new Error(`IPC channel not allowed: ${channel}`);
  }
}

const bridge: RedecimBridge = {
  invoke(channel: string, payload: unknown): Promise<unknown> {
    assertAllowed(channel);
    return ipcRenderer.invoke(channel, payload);
  },
  send(channel: string, payload: unknown): void {
    assertAllowed(channel);
    ipcRenderer.send(channel, payload);
  },
  on(channel: string, listener: (payload: unknown) => void): void {
    assertAllowed(channel);
    ipcRenderer.on(channel, (_event, payload) => listener(payload));
  },
};

contextBridge.exposeInMainWorld('redecim', bridge);
