export interface TimeService {
  setInterval(callback: () => void | Promise<void>, intervalMilliseconds: number): void;
}
