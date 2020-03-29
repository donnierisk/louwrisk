import { EntityType } from './EntityType';
import { GridPosition } from '../GridPosition';
import Buff from '../Buffs';
import { MortalState } from '../MortalState';
import { ActionState } from '../Action/ActionStates';
import { PositionState } from '../PositionState';
import { Direction } from '../Direction';

export interface EntityInterface {
  type: EntityType
  position: GridPosition
  status: EntityStatus
  mortalState: MortalState
  direction: Direction
  inventory: Map<string, string>
  actionState?: ActionState
  positionState?: PositionState
  invincible?: boolean
  viewRange?: number
  span?: GridPosition
  id?: number
  spriteName: string
  description?: string
  blocks?: boolean
  buff?: Buff
  animation: string
}

export interface EntityStatus {
  health: SingleStatus,
  armour?: SingleStatus,
  strength?: SingleStatus,
  dexterity?: SingleStatus,
  speed?: SingleStatus,
  damage?: SingleStatus,
  stamina?: SingleStatus,
  morale?: string,
  ethos?: string,
  favor?: SingleStatus,
  reputation?: string
}

export interface SingleStatus {
  curr: number,
  base: number
}
