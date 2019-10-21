import { MapSymbol } from './MapSymbol';

export interface GridBlockI {
  symbol: MapSymbol,
  containsPlayer?: boolean,
  inObserveRange?: boolean
}
