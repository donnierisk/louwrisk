import { ActionTypes } from '@/models/Action/ActionTypes';
import { getRandomIntInclusive } from '@/utils/Arithmetic';
import { ActionHandler } from '@/lib/ActionHandler';
import { LevelHandler } from '@/lib/LevelHandler';
import { GridPosition } from '../GridPosition';

export class PathingHandler {
  private level: LevelHandler
  constructor(level: LevelHandler) {
    this.level = level
  }

  public getPath(handler: ActionHandler) {
    const count = []
    count.push(getRandomIntInclusive(0, 3))
    let pos: GridPosition = this.getNewPos(count[count.length - 1], this.entities[index].getPosition())
    while ((count.length < 4)
      && (this.peekAtPosition(pos)
        || this.level.isBlocked(pos.x, pos.y))
    ) {
      let temp: number = getRandomIntInclusive(0, 3)
      while (count.includes(temp) && count.length < 4) {
        temp = getRandomIntInclusive(0, 3)
      }
      count.push(temp)
      pos = this.getNewPos(count[count.length - 1], this.entities[index].getPosition())
    }

    if (count.length < 4) {
      handler.addMove(pos, this.level)
    }
  }
  private getNewPos = (direction: number, position: GridPosition): GridPosition => {
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

  private peekAtPosition(pos: GridPosition): boolean {
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
