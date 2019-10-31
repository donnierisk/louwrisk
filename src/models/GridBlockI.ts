import { TerrainSymbol } from './TerrainSymbol';
import { Entity } from './Entity';

export interface GridBlockI {
  symbol: TerrainSymbol,
  id: number,
  containedEntity?: Entity,
  containsPlayer?: boolean,
  inObserveRange?: boolean,
  zIndex?: number
}
