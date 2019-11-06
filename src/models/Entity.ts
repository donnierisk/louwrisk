import { EntityType } from './EntityType';
import { GridPosition } from './GridPosition';
import Buff from './Buffs';

export interface Entity {
  type: EntityType
  position: GridPosition
  span?: GridPosition
  name?: string
  description?: string
  blocks?: boolean
  buff?: Buff
}
