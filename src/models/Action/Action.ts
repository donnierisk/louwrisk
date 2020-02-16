import { ActionTypes } from './ActionTypes';
import { Entity } from '../Entity/Entity';
import { GridPosition } from '../GridPosition';
import { LevelHandler } from '@/lib/LevelHandler';

export default class Action {
  private type: ActionTypes
  private actionEntity: Entity
  private interactionEntities?: Entity[]
  private level?: LevelHandler
  private dialogs?: string[]
  private position?: GridPosition
  private actionEvent: () => boolean
  constructor(type: ActionTypes, actionEntity: Entity, ...parameters: any[]) {
    this.type = type
    this.actionEntity = actionEntity
    switch (type) {
      case ActionTypes.ATTACK:
        this.actionEvent = this.attack
        this.interactionEntities = parameters[0]
        break;
      case ActionTypes.OBSERVE:
        this.actionEvent = this.observe
        this.interactionEntities = parameters[0]
        break;
      case ActionTypes.OBTAIN:
        this.actionEvent = this.obtain
        this.interactionEntities = parameters[0]
        break;
      case ActionTypes.MOVE:
        this.actionEvent = this.move
        this.position = parameters[0]
        this.level = parameters[1]
        break;
      case ActionTypes.DIALOGUE:
        this.actionEvent = this.dialog
        this.interactionEntities = parameters[0]
        this.dialogs = parameters[1]
        break;
      default:
        this.actionEvent = () => false
    }
  }

  public getPosition() {
    return this.position
  }

  public act(): boolean {
    return this.actionEvent()
  }

  public getType() {
    return this.type
  }

  public checkPosition(pos: GridPosition) {
    return this.position ? this.position.x === pos.x && this.position.y === pos.y : false
  }

  private attack(): boolean {
    if (this.interactionEntities) {
      this.interactionEntities.forEach((ent: Entity) => {
        ent.damage(1)
      })
    }
    return true
  }

  private move(): boolean {
    if (this.position && this.level) {
      return this.level.updateEntityPosition(this.actionEntity, this.position.x, this.position.y)
    }
    return false
  }

  private dialog(): boolean { return false }
  private observe(): boolean { return false }
  private obtain(): boolean { return false }
}
