import { MapSymbol } from './MapSymbol';

export interface GridBlockI {
  symbol: MapSymbol,
  id: number,
  zIndex: number,
  containsEntity?: {
    entityType: string
  },
  inObserveRange?: boolean,
}
