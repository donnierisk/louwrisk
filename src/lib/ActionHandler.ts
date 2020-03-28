import { ActionTypes } from '@/models/Action/ActionTypes';
import Action from '@/models/Action/Action';
import { Entity } from '@/models/Entity/Entity';
import { GridPosition } from '@/models/GridPosition';
import { LevelHandler } from './LevelHandler';
import { Direction } from '@/models/Direction';

export class ActionHandler {
  private actionQueue: Action[] = []
  private oldQueue: Action[] = []
  private entity: Entity
  private id: number

  constructor(ent: Entity, id: number) {
    this.entity = ent
    this.id = id
  }

  public addMove(position: GridPosition, level: LevelHandler) {
    this.actionQueue.push(new Action(ActionTypes.MOVE, this.entity, position, level))
  }

  public addTurn(direction: Direction) {
    this.actionQueue.push(new Action(ActionTypes.TURN, this.entity, direction))
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

  public getEntityPosition(): GridPosition {
    return this.entity.getPosition()
  }

  public getId(): number {
    return this.id
  }

  public getQueue(): string {
    return JSON.stringify(this.actionQueue.map((obj: Action) => obj.getPosition()))
  }

  public hasAct(): boolean {
    return this.actionQueue[0] !== undefined
  }

  public nextActTry(): boolean {
    const tempAction: Action | undefined = this.actionQueue.shift()
    if (tempAction) {
      if (tempAction.act()) {
        this.oldQueue.push(tempAction)
        return true
      } else {
        this.actionQueue.unshift(tempAction)
      }
    } else {
      // TODO: LOGGER
    }
    return false
  }

  public nextAct(): boolean {
    const tempAction: Action | undefined = this.actionQueue.shift()
    if (tempAction) {
      if (tempAction.act()) {
        this.oldQueue.push(tempAction)
        return true
      }
    } else {
      // TODO: LOGGER
    }
    return false
  }
}
