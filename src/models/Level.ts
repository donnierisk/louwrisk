import { TerrainSymbol } from './TerrainSymbol';
import { Entity } from './Entity';
import { EntityInterface } from './EntityInterface';

export interface Level {
  terrain: TerrainSymbol[][]
  entities: EntityInterface[]
}
