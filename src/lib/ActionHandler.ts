import { ActionTypes } from '@/models/Action/ActionTypes';
import Action from '@/models/Action/Action';
import { Entity } from '@/models/Entity/Entity';
import { GridPosition } from '@/models/GridPosition';
import { LevelHandler } from './LevelHandler';

export class ActionHandler {
  private actionQueue: Action[] = []
  private oldQueue: Action[] = []
  private entity: Entity
  constructor(ent: Entity) {
    this.entity = ent
  }

  public addMove(position: GridPosition, level: LevelHandler) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, this.entity, position, level))
  }

  public addObserve(observedEntity: Entity[]) {
    this.actionQueue.push(new Action(ActionTypes.OBSERVE, this.entity, observedEntity))
  }

  public addObtain(obtainedEntity: Entity[]) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, this.entity, obtainedEntity))
  }

  public addAttack(obtainedEntity: Entity[]) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, this.entity, obtainedEntity))
  }

  public addDialogue(obtainedEntity: Entity[], dialogs: string[]) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, this.entity, dialogs))
  }

  public peekQueueFront(): Action | undefined {
    if (this.actionQueue.length) {
      return this.actionQueue[0]
    } else {
      return undefined
    }
  }

  public popQueueFront(): Action | undefined {
    if (this.actionQueue.length) {
      return this.actionQueue.shift()
    } else {
      return undefined
    }
  }

  public getQueue(): string {
    return JSON.stringify(this.actionQueue.map((obj: Action) => obj.getPosition()))
  }

  public nextAct() {
    const tempAction: Action | undefined = this.actionQueue.shift()
    if (tempAction) {
      tempAction.act()
      this.oldQueue.push(tempAction)
    } else {
      // TODO: LOGGER
    }
  }
}
