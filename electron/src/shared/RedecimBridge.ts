export interface RedecimBridge {
  invoke(channel: string, payload: unknown): Promise<unknown>;
  send(channel: string, payload: unknown): void;
  on(channel: string, listener: (payload: unknown) => void): void;
}
