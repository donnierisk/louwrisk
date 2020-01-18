import { ActionTypes } from './ActionTypes';
import { Entity } from '../Entity/Entity';
import { GridPosition } from '../GridPosition';

export class Action {
  private type: ActionTypes
  private actionEntity: Entity
  private interactionEntities?: Entity[]
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
        break;
      case ActionTypes.DIALOGUE:
        this.actionEvent = this.dialog
        this.interactionEntities = parameters[0]
        this.dialogs = parameters[1]
        break;
    }
  }
  public act() {
    this.actionEvent()
  }

  private attack() {
    if (this.interactionEntities) {
      this.interactionEntities.forEach((ent: Entity) => {
        ent.damage(1)
      })
    }
  }

  private move() {
    if (this.position) {
      this.actionEntity.setPosition(this.position.x, this.position.y)
    }
  }

  private dialog() { }
  private observe() { }
  private obtain() { }
}
