import { ActionHandler } from './ActionHandler';
import { Entity } from '@/models/Entity/Entity';

import { LevelHandler } from './LevelHandler';
import { PathingHandler } from '@/models/Pathing/PathingHandler';

export class AIHandler {
  private actionHandlers: ActionHandler[] = []
  private pathingHandler: PathingHandler
  private entities: Entity[]
  private idCount: number = 0

  constructor(entities: Entity[], pathingHandler: PathingHandler) {
    this.entities = entities
    this.entities.forEach((ent: Entity, index: number) => {
      this.idCount = index
      this.actionHandlers.push(new ActionHandler(ent, this.idCount))
    })
    this.pathingHandler = pathingHandler
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity)
    this.actionHandlers.push(new ActionHandler(entity, this.idCount + 1))
  }

  public nextTurn() {
    this.actionHandlers.forEach((handler) => {
      this.pathingHandler.addMove(handler)
      handler.nextAct()
    })
  }
}
