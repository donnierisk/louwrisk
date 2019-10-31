import { EntityType } from './EntityTypes';
import { GridPosition } from './GridPosition';
import Buff from './Buffs';


export interface Entity {
  type: EntityType
  span: GridPosition
  name: string
  description: string
  blocks: boolean
  buff?: Buff
}
