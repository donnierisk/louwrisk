import { EntityType } from './EntityType';
import { GridPosition } from '../GridPosition';
import Buff from '../Buffs';
import { MortalState } from '../MortalState';
import { ActionState } from '../Action/ActionState';
import { PositionState } from '../PositionState';


export interface EntityInterface {
  type: EntityType
  position: GridPosition
  health: number
  mortalState: MortalState
  actionState?: ActionState
  positionState?: PositionState
  invincible?: boolean
  span?: GridPosition
  id?: number
  spriteName: string
  description?: string
  blocks?: boolean
  buff?: Buff
}
