import { TerrainSymbol } from './TerrainSymbol';
import { Entity } from './Entity/Entity';
import { EntityInterface } from './Entity/EntityInterface';

export interface Level {
  terrain: TerrainSymbol[][]
  entities: EntityInterface[]
}
