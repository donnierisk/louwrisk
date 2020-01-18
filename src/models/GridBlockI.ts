import { TerrainSymbol } from './TerrainSymbol';
import { Entity } from './Entity/Entity';

export interface GridBlockI {
  symbol: TerrainSymbol,
  id: number,
  x?: number,
  y?: number,
  containedEntity?: Entity,
  containsPlayer?: boolean,
  inObserveRange?: boolean,
  zIndex?: number
}
