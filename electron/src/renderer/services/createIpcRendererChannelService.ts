import type { ChannelService } from 'core';
import type { CallMessage } from '../../shared/CallMessage';
import type { ChannelMessage } from '../../shared/ChannelMessage';
import type { RedecimBridge } from '../../shared/RedecimBridge';
import type { ReplyMessage } from '../../shared/ReplyMessage';
import { ipcChannels } from '../../shared/ipcChannels';

export function createIpcRendererChannelService(bridge: RedecimBridge): ChannelService {
  const handlers = new Map<string, (data: unknown) => Promise<unknown>>();
  const subscribers = new Map<string, Set<(data: unknown) => void>>();

  function reply(message: ReplyMessage): void {
    bridge.send(ipcChannels.reply, message);
  }

  bridge.on(ipcChannels.publish, (payload) => {
    const { event, data } = payload as ChannelMessage;
    for (const subscriber of subscribers.get(event) ?? []) {
      subscriber(data);
    }
  });

  bridge.on(ipcChannels.call, async (payload) => {
    const { id, event, data } = payload as CallMessage;
    const handler = handlers.get(event);
    if (!handler) {
      reply({ id, error: `No handler registered for event: ${event}` });
      return;
    }
    try {
      reply({ id, result: await handler(data) });
    } catch (error) {
      reply({ id, error: String(error) });
    }
  });

  return {
    publish<T>(event: string, data: T): void {
      bridge.send(ipcChannels.publish, { event, data } satisfies ChannelMessage);
    },
    subscribe<T>(event: string, callback: (data: T) => void): void {
      const eventSubscribers = subscribers.get(event) ?? new Set();
      eventSubscribers.add(callback as (data: unknown) => void);
      subscribers.set(event, eventSubscribers);
    },
    call<TRequest, TResponse>(event: string, data: TRequest): Promise<TResponse> {
      return bridge.invoke(ipcChannels.invoke, { event, data } satisfies ChannelMessage) as Promise<TResponse>;
    },
    handle<TRequest, TResponse>(event: string, handler: (data: TRequest) => Promise<TResponse>): void {
      handlers.set(event, handler as (data: unknown) => Promise<unknown>);
    },
  };
}
