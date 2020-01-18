import { ActionTypes } from '@/models/Action/ActionTypes';
import { Action } from '@/models/Action/Action';
import { Entity } from '@/models/Entity/Entity';
import { GridPosition } from '@/models/GridPosition';


export class ActionHandler {
  private actionQueue: Action[] = []
  private oldQueue: Action[] = []

  public addMove(entity: Entity, position: GridPosition) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, entity, position))
  }

  public addObserve(entity: Entity, observedEntity: Entity[]) {
    this.actionQueue.push(new Action(ActionTypes.OBSERVE, entity, observedEntity))
  }

  public addObtain(entity: Entity, obtainedEntity: Entity[]) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, entity, obtainedEntity))
  }

  public addAttack(entity: Entity, obtainedEntity: Entity[]) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, entity, obtainedEntity))
  }

  public addDialogue(entity: Entity, obtainedEntity: Entity[], dialogs: string[]) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, entity, dialogs))
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
