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
  private actionEvent: () => void
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
        this.actionEvent = () => { return }
    }
  }

  public getPosition() {
    return this.position
  }

  public act() {
    this.actionEvent()
  }

  public getType() {
    return this.type
  }

  public checkPosition(pos: GridPosition) {
    return this.position ? this.position.x === pos.x && this.position.y === pos.y : false
  }

  private attack() {
    if (this.interactionEntities) {
      this.interactionEntities.forEach((ent: Entity) => {
        ent.damage(1)
      })
    }
  }

  private move() {
    if (this.position && this.level) {
      this.level.updateEntityPosition(this.actionEntity, this.position.x, this.position.y)
    }
  }

  private dialog() { return }
  private observe() { return }
  private obtain() { return }
}
