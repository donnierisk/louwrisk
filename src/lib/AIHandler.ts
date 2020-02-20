import { ActionHandler } from './ActionHandler';
import { Entity } from '@/models/Entity/Entity';

import { LevelHandler } from './LevelHandler';
import { PathingHandler } from '@/models/Pathing/PathingHandler';

export class AIHandler {
  private actionHandlers: ActionHandler[] = []
  private pathingHandler: PathingHandler
  private entities: Entity[]
  private target: Entity
  private idCount: number = 0

  constructor(entities: Entity[], pathingHandler: PathingHandler, target: Entity) {
    this.entities = entities
    this.entities.forEach((ent: Entity, index: number) => {
      this.idCount = index
      this.actionHandlers.push(new ActionHandler(ent, this.idCount))
    })
    this.pathingHandler = pathingHandler
    this.target = target
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity)
    this.actionHandlers.push(new ActionHandler(entity, this.idCount + 1))
  }

  public nextTurn() {
    //{ x: 3, y: 0, z: 0 }
    this.actionHandlers.forEach((handler) => {
      this.pathingHandler.follow(handler, this.target.getPosition())
      handler.nextAct()
    })
  }
}
