import { EntityType } from './EntityType';
import { GridPosition } from './GridPosition';
import Buff from './Buffs';
import { MortalState } from './MortalState';

export interface Entity {
  type: EntityType
  position: GridPosition
  health: number
  mortalState: MortalState
  invincible?: boolean
  span?: GridPosition
  id?: number
  name?: string
  description?: string
  blocks?: boolean
  buff?: Buff
}
