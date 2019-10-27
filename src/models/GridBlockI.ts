import { MapSymbol } from './MapSymbol';

export interface GridBlockI {
  symbol: MapSymbol,
  id: number,
  zIndex: number,
  containsPlayer?: boolean,
  inObserveRange?: boolean,
}
