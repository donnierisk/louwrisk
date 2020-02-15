import { getRandomIntInclusive } from '@/utils/Arithmetic';
import { ActionHandler } from '@/lib/ActionHandler';
import { LevelHandler } from '@/lib/LevelHandler';
import { GridPosition } from '../GridPosition';
interface PathingObject { positions: GridPosition[], curIndex: number }

export class PathingHandler {
  private level: LevelHandler
  private paths: { [k: string]: PathingObject }
  private pastPaths: { [k: string]: { positions: GridPosition[][] } }
  constructor(level: LevelHandler) {
    this.level = level
    this.paths = {}
    this.pastPaths = {}
  }

  public addMove(handler: ActionHandler) {
    let obj: PathingObject = this.paths[handler.getId()]
    if (!obj) {
      this.addPath(handler)
      obj = this.paths[handler.getId()]
    }
    handler.addMove(obj.positions[obj.curIndex], this.level)
    obj.curIndex++

    if (obj.positions.length === obj.curIndex) {
      if (!this.pastPaths[handler.getId()]) {
        this.pastPaths[handler.getId()] = {
          positions: []
        }
      }
      this.pastPaths[handler.getId()].positions.push(obj.positions)
      delete this.paths[handler.getId()]
    }
  }

  public addPath(handler: ActionHandler) {
    this.paths[handler.getId()] = {
      positions: this.getRandomPath(handler.getEntityPosition(), 7),
      curIndex: 0
    }
  }

  private getRandomPath(initialPosition: GridPosition, steps: number): GridPosition[] {
    const count = []
    const returnPositions: GridPosition[] = []
    let previousPos: GridPosition = initialPosition
    for (let index = 0; index < steps; index++) {
      count.push(getRandomIntInclusive(0, 3))

      let pos: GridPosition = this.getNewPos(count[count.length - 1], previousPos)
      while ((count.length < 4) && this.level.isBlocked(pos.x, pos.y)) {
        let temp: number = getRandomIntInclusive(0, 3)
        while (count.includes(temp) && count.length < 4) {
          temp = getRandomIntInclusive(0, 3)
        }
        count.push(temp)
        pos = this.getNewPos(count[count.length - 1], previousPos)
      }

      if (count.length < 4) {
        returnPositions.push(pos)
        previousPos = pos
      }
    }

    return returnPositions
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

  private hasPath(id: number): boolean {
    if (this.paths[id] !== undefined) {
      return true
    }
    return false
  }
}
