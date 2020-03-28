import { ActionHandler } from './ActionHandler';
import { Entity } from '@/models/Entity/Entity';
import { PathingHandler } from '@/models/Pathing/PathingHandler';
import { GridPosition } from '@/models/GridPosition';
import { Observer } from '@/models/Observer/Observer';


interface Patrol { route: GridPosition[], index: number }
export class AIHandler {
  private actionHandlers: ActionHandler[] = []
  private pathingHandler: PathingHandler
  private observerHandler: Observer
  private entities: Entity[]
  private target: Entity
  private idCount: number = 0
  private patrols: Patrol[]

  constructor(entities: Entity[], pathingHandler: PathingHandler, observerHandler: Observer, target: Entity) {
    const temp = { x: 3, y: 0, z: 0 }
    this.patrols = []
    this.entities = entities
    this.entities.forEach((ent: Entity, index: number) => {
      this.patrols[index] = { route: [ent.getPosition(), temp], index: 0 }
      this.idCount = index
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

  public nextTurn() {
    this.actionHandlers.forEach((handler, index) => {
      this.pathingHandler.addTurn(handler)
      if (!this.pathingHandler.addMove(handler)) {
        // Change patrol route
        if (!this.pathingHandler.isAtDestination(handler)) {
          this.patrols[index].index--
          if (this.patrols[index].index < 0) {
            this.patrols[index].index = this.patrols[index].route.length - 1
          }
        }
        // Add route
        const isComp = this.pathingHandler.isCompromised(handler)
        this.pathingHandler.moveTo(handler, this.patrols[index].route[this.patrols[index].index])
        if (!isComp) {
          this.patrols[index].index++
        }

        if (this.patrols[index].index >= this.patrols[index].route.length) {
          this.patrols[index].index = 0
        }
      }
      while (handler.hasAct()) { if (!handler.nextAct()) { this.pathingHandler.compromisePath(handler) } }
    })
  }
}
