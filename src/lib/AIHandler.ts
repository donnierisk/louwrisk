import { ActionHandler } from './ActionHandler';
import { Entity } from '@/models/Entity/Entity';
import { getRandomIntInclusive } from '@/utils/Arithmetic';
import { GridPosition } from '@/models/GridPosition';
import { LevelHandler } from './LevelHandler';

export class AIHandler {
  private actionHandler: ActionHandler
  private entities: Entity[]
  private level: LevelHandler
  constructor(handler: ActionHandler, level: LevelHandler, entities: Entity[]) {
    this.actionHandler = handler
    this.level = level
    this.entities = entities
  }

  public addEntity(entity: Entity) {
    this.entities.push(entity)
  }

  public nextTurn() {
    const getNewPos = (direction: number, position: GridPosition): GridPosition => {
      const returnPos = { x: position.x, y: position.y }
      switch (direction) {
        case 0:
          returnPos.y++
          break;
        case 1:
          returnPos.y--
          break;
        case 2:
          returnPos.x++
          break;
        case 3:
          returnPos.x--
          break;
      }
      return returnPos
    }
    this.entities.forEach(ent => {
      this.actionHandler.nextAct()
      // this.actionHandler.addMove()
      let pos: GridPosition = getNewPos(getRandomIntInclusive(0, 4), ent.getPosition())
      while (this.level.isBlocked(pos.x, pos.y) || this.level.isOutOfBounds(pos.x, pos.y)) {
        pos = getNewPos(getRandomIntInclusive(0, 4), ent.getPosition())
      }
      this.actionHandler.addMove(ent, pos)
    })
  }
}
