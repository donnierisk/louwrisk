import { MapSymbol } from './MapSymbol';

export interface GridBlockI {
  symbol: MapSymbol,
  id: number,
  containsPlayer?: boolean,
  inObserveRange?: boolean,
}
