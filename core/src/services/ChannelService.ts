export interface ChannelService {
  publish<T>(event: string, data: T): void;
  subscribe<T>(event: string, callback: (data: T) => void): void;
  call<TRequest, TResponse>(event: string, data: TRequest): Promise<TResponse>;
  handle<TRequest, TResponse>(event: string, handler: (data: TRequest) => Promise<TResponse>): void;
}
