import type { RedecimBridge } from '../shared/RedecimBridge';

export function getBridge(): RedecimBridge {
  return (window as unknown as { redecim: RedecimBridge }).redecim;
}
