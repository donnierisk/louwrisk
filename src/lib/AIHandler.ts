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
  private target: Entity
  private idCount: number = 0

  constructor(entities: Entity[], pathingHandler: PathingHandler, observerHandler: Observer, target: Entity) {
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

    this.target = target
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
          const observed: Entity[] = this.observerHandler.observe(this.entities[id])
          if (observed.length) {
            this.patrolHandler.deviate(id, observed[0].getPosition())
            this.pathingHandler.compromisePath(handler)
          }
          break;
        default:
          handler.nextAct()
          break;
      }
    }
  }

  public nextTurn() {
    this.actionHandlers.forEach((handler, index) => {
      this.pathingHandler.addTurn(handler)
      if (!this.pathingHandler.addMove(handler)) {
        const isComp = this.pathingHandler.isCompromised(handler)
        if (this.pathingHandler.isAtDestination(handler) && !isComp) {
          this.patrolHandler.startNextRoute(index)
        }
        // Add route
        this.pathingHandler.moveTo(handler, this.patrolHandler.getNextPoint(index))
      }
      this.actOnIt(handler, index)
    })
  }
}
