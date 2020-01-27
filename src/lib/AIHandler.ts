import { ActionHandler } from './ActionHandler';
import { Entity } from '@/models/Entity/Entity';
import { getRandomIntInclusive } from '@/utils/Arithmetic';
import { GridPosition } from '@/models/GridPosition';
import { LevelHandler } from './LevelHandler';
import { ActionTypes } from '@/models/Action/ActionTypes';
import Action from '@/models/Action/Action';

export class AIHandler {
  private actionHandlers: ActionHandler[] = []
  private entities: Entity[]
  private level: LevelHandler

  constructor(level: LevelHandler, entities: Entity[]) {
    this.level = level
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

    this.actionHandlers.forEach((handler, index) => {
      handler.nextAct()
      const count = []
      let breakCount = 0
      count.push(getRandomIntInclusive(0, 3))
      let pos: GridPosition = getNewPos(count[count.length - 1], this.entities[index].getPosition())
      while ((count.length < 4)
        && (this.peekAtPosition(pos)
          || this.level.isBlocked(pos.x, pos.y))
      ) {
        let temp: number = getRandomIntInclusive(0, 3)
        while (count.includes(temp) && count.length < 4) {
          temp = getRandomIntInclusive(0, 3)
          breakCount++
        }
        count.push(temp)
        pos = getNewPos(count[count.length - 1], this.entities[index].getPosition())
      }

      if (count.length < 4) {
        handler.addMove(pos, this.level)
      }
    })
  }

  public interruptAtPosition(pos: GridPosition) {
    this.actionHandlers.forEach((handler) => {
      const action: Action | undefined = handler.peekQueueFront()
      if (action) {
        if (action.checkPosition(pos)) {
          handler.popQueueFront()
        }
      }
    })
  }

  public peekAtPosition(pos: GridPosition): boolean {
    this.actionHandlers.forEach((handler) => {
      const action: Action | undefined = handler.peekQueueFront()
      if (action) {
        if (action.checkPosition(pos)) {
          return true
        }
      }
    })
    return false
  }
}
