import { ActionHandler } from './ActionHandler';
import { Entity } from '@/models/Entity/Entity';

import { GridPosition } from '@/models/GridPosition';
import { LevelHandler } from './LevelHandler';

import Action from '@/models/Action/Action';

export class AIHandler {
  private actionHandlers: ActionHandler[] = []
  private entities: Entity[]

  constructor(level: LevelHandler, entities: Entity[]) {
    this.entities = entities
    this.entities.forEach((ent: Entity) => {
      this.actionHandlers.push(new ActionHandler(ent))
    })
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity)
    this.actionHandlers.push(new ActionHandler(entity))
  }

  public nextTurn() {
    this.actionHandlers.forEach((handler, index) => {
      handler.nextAct()
    })
  }
}
