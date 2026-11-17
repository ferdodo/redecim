import type { ChannelService } from '../services/ChannelService';

export function createChannelServicesMocks(): {
  browserWindowChannel: ChannelService;
  mainProcessChannel: ChannelService;
} {
  const mainProcessHandlers = new Map<string, (data: unknown) => Promise<unknown>>();
  const browserWindowHandlers = new Map<string, (data: unknown) => Promise<unknown>>();

  const browserWindowChannel: ChannelService = {
    publish(): void {},
    subscribe(): void {},
    call<P, R>(event: string, data: P): Promise<R> {
      const handler = mainProcessHandlers.get(event);
      if (!handler) {
        throw new Error(`No handler registered for event: ${event}`);
      }
      return handler(data) as Promise<R>;
    },
    handle<P, R>(event: string, handler: (data: P) => Promise<R>): void {
      browserWindowHandlers.set(event, handler as (data: unknown) => Promise<unknown>);
    },
  };

  const mainProcessChannel: ChannelService = {
    publish(): void {},
    subscribe(): void {},
    call<P, R>(event: string, data: P): Promise<R> {
      const handler = browserWindowHandlers.get(event);
      if (!handler) {
        throw new Error(`No handler registered for event: ${event}`);
      }
      return handler(data) as Promise<R>;
    },
    handle<P, R>(event: string, handler: (data: P) => Promise<R>): void {
      mainProcessHandlers.set(event, handler as (data: unknown) => Promise<unknown>);
    },
  };

  return {
    browserWindowChannel,
    mainProcessChannel,
  };
}
