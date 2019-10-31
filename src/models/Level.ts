import { TerrainSymbol } from './TerrainSymbol';
import { Entity } from './Entity';

export interface Level {
  terrain: TerrainSymbol[][]
  entities: Entity[]
}
