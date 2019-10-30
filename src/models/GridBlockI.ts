import { MapSymbol } from './MapSymbol';

export interface GridBlockI {
  symbol: MapSymbol,
  id: number,
  containsEntity?: {
    entityType: string
  },
  containsPlayer?: boolean,
  inObserveRange?: boolean,
  zIndex?: number
}
