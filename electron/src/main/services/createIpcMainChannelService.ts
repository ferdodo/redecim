import { randomUUID } from 'node:crypto';
import type { ChannelService } from 'core';
import type { CallMessage } from '../../shared/CallMessage';
import type { ChannelMessage } from '../../shared/ChannelMessage';
import type { ReplyMessage } from '../../shared/ReplyMessage';
import { ipcChannels } from '../../shared/ipcChannels';

interface IpcMainPort {
  handle(channel: string, listener: (event: unknown, payload: unknown) => Promise<unknown>): void;
  on(channel: string, listener: (event: unknown, payload: unknown) => void): void;
}

interface RendererPort {
  send(channel: string, payload: unknown): void;
}

interface PendingCall {
  resolve(result: unknown): void;
  reject(error: Error): void;
}

export function createIpcMainChannelService(ipcMain: IpcMainPort, renderer: RendererPort): ChannelService {
  const handlers = new Map<string, (data: unknown) => Promise<unknown>>();
  const subscribers = new Map<string, Set<(data: unknown) => void>>();
  const pendingCalls = new Map<string, PendingCall>();

  ipcMain.handle(ipcChannels.invoke, async (_event, payload) => {
    const { event, data } = payload as ChannelMessage;
    const handler = handlers.get(event);
    if (!handler) {
      throw new Error(`No handler registered for event: ${event}`);
    }
    return handler(data);
  });

  ipcMain.on(ipcChannels.publish, (_event, payload) => {
    const { event, data } = payload as ChannelMessage;
    for (const subscriber of subscribers.get(event) ?? []) {
      subscriber(data);
    }
  });

  ipcMain.on(ipcChannels.reply, (_event, payload) => {
    const reply = payload as ReplyMessage;
    const pending = pendingCalls.get(reply.id);
    pendingCalls.delete(reply.id);
    if ('error' in reply) {
      pending?.reject(new Error(reply.error));
    } else {
      pending?.resolve(reply.result);
    }
  });

  return {
    publish<T>(event: string, data: T): void {
      renderer.send(ipcChannels.publish, { event, data } satisfies ChannelMessage);
    },
    subscribe<T>(event: string, callback: (data: T) => void): void {
      const eventSubscribers = subscribers.get(event) ?? new Set();
      eventSubscribers.add(callback as (data: unknown) => void);
      subscribers.set(event, eventSubscribers);
    },
    call<TRequest, TResponse>(event: string, data: TRequest): Promise<TResponse> {
      const id = randomUUID();
      return new Promise((resolve, reject) => {
        pendingCalls.set(id, { resolve: resolve as (result: unknown) => void, reject });
        renderer.send(ipcChannels.call, { id, event, data } satisfies CallMessage);
      });
    },
    handle<TRequest, TResponse>(event: string, handler: (data: TRequest) => Promise<TResponse>): void {
      handlers.set(event, handler as (data: unknown) => Promise<unknown>);
    },
  };
}
