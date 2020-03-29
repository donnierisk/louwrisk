import { ActionHandler } from './ActionHandler';
import { Entity } from '@/models/Entity/Entity';
import { PathingHandler } from '@/models/Pathing/PathingHandler';
import { GridPosition } from '@/models/GridPosition';
import { Observer } from '@/models/Observer/Observer';
import { ActionTypes } from '@/models/Action/ActionTypes';
import { PatrolHandler } from '@/models/Pathing/PatrolHandler';

export class AIHandler {
  private actionHandlers: ActionHandler[] = []
  private pathingHandler: PathingHandler
  private observerHandler: Observer
  private entities: Entity[]
  private patrolHandler: PatrolHandler
  private targets: { [k: number]: {target: Entity, followTollerance: number, current: number} }
  private idCount: number = 0

  constructor(entities: Entity[], pathingHandler: PathingHandler, observerHandler: Observer) {
    const temp = { x: 3, y: 0, z: 0 }
    this.patrolHandler = new PatrolHandler()
    this.entities = entities
    this.entities.forEach((ent: Entity, index: number) => {
      this.idCount = index
      this.patrolHandler.addPatroller(this.idCount, ent, temp)
      this.actionHandlers.push(new ActionHandler(ent, this.idCount))
    })
    this.pathingHandler = pathingHandler
    this.observerHandler = observerHandler
    this.targets = []
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity)
    this.actionHandlers.push(new ActionHandler(entity, this.idCount + 1))
  }

  public actOnIt(handler: ActionHandler, id: number) {
    while (handler.hasAct()) {
      switch (handler.nextActType()) {
        case ActionTypes.MOVE:
          if (!handler.nextAct()) { this.pathingHandler.compromisePath(handler) }
          break;
        case ActionTypes.TURN:
          handler.nextAct()
          break;
        default:
          handler.nextAct()
          break;
      }
    }
    const observed: Entity[] = this.observerHandler.observe(this.entities[id])
    if (observed.length) {
      if (!this.targets[id]) {
        this.targets[id] = { target: observed[0], followTollerance: 2, current: 0 }
      } else {
        this.targets[id].target = observed[0]
        this.targets[id].current = 0
      }
      this.pathingHandler.compromisePath(handler)
    }
  }

  public nextTurn() {
    this.actionHandlers.forEach((handler, index: number) => {
      this.pathingHandler.addTurn(handler)
      if (!this.pathingHandler.addMove(handler)) {
        if (this.targets[index] === undefined) {
          const isComp = this.pathingHandler.isCompromised(handler)
          if (this.pathingHandler.isAtDestination(handler) && !isComp) {
            this.patrolHandler.startNextRoute(index)
          }
          // Add route
        }

        const tempPos: GridPosition =
          this.targets[index] !== undefined ?
          this.targets[index].target.getPosition() :
          this.patrolHandler.getNextPoint(index)

        this.pathingHandler.moveTo(handler, tempPos)
        if (this.targets[index]) {
          if (this.targets[index].followTollerance <= this.targets[index].current) {
            delete this.targets[index]
          } else {
            this.targets[index].current++
          }
        }
      }
      this.actOnIt(handler, index)
    })
  }
}
