import { getRandomIntInclusive } from '@/utils/Arithmetic';
import { ActionHandler } from '@/lib/ActionHandler';
import { LevelHandler } from '@/lib/LevelHandler';
import { GridPosition } from '../GridPosition';
interface PathingObject { positions: GridPosition[], curIndex: number }
interface Node { position: GridPosition }
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
      positions: this.getPathBetweenTwoPoints(handler.getEntityPosition(), { x: 3, y: 0, z: 0 }),
      curIndex: 0
    }
  }

  private getKey(n: Node): string {
    return n.position.x + '-' + n.position.y
  }

  private getPathBetweenTwoPoints(initialPoint: GridPosition, endPoint: GridPosition): GridPosition[] {
    const start: Node = { position: initialPoint }
    const target: Node = { position: endPoint }
    let found: boolean = false
    const k = this.getKey
    const dist: { [k: string]: number } = {}
    const prev: { [k: string]: Node } = {}
    const queue: { [k: string]: Node } = {}

    queue[k(start)] = start
    dist[k(start)] = 0
    queue[k(target)] = target
    dist[k(target)] = Infinity
    for (let yPos = 0; yPos < this.level.GridSize.y; yPos++) {
      for (let xPos = 0; xPos < this.level.GridSize.x; xPos++) {
        const key: string = xPos + '-' + yPos
        if (queue[key] !== queue[k(start)]
          && queue[key] !== queue[k(target)]
          && !this.level.isBlocked(xPos, yPos)) {
          const tempNode: Node = { position: { x: xPos, y: yPos, z: 0 } }
          queue[key] = tempNode
          dist[key] = Infinity
        }
      }
    }

    while (!this.isEmpty(queue) && !found) {
      const currentNodeKey: string = this.popNodeWithLowestDistance(dist, queue)
      const current: Node = queue[currentNodeKey]
      delete queue[currentNodeKey]
      if (currentNodeKey === k(target)) {
        found = true
      } else {
        for (const neighbors of this.getSurroundingNodes(current, queue)) {
          const weight: number = dist[k(current)] + 1
          if (weight < dist[k(neighbors)]) {
            dist[k(neighbors)] = weight
            prev[k(neighbors)] = current
          }
        }
      }
    }

    const returnPositions: GridPosition[] = []
    let cur = target
    while (cur !== undefined) {
      returnPositions.unshift(cur.position)
      cur = prev[k(cur)]
    }
    console.log(returnPositions)
    return returnPositions
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

  private getSurroundingPositions(currentPosition: GridPosition): GridPosition[] {
    const returnPositions: GridPosition[] = []
    for (let index = 0; index < 4; index++) {
      returnPositions.push(this.getNewPos(index, currentPosition))
    }
    return returnPositions
  }

  private getSurroundingNodes(currentNode: Node, queue: { [k: string]: Node }): Node[] {
    const returnNode: Node[] = []
    const temp: GridPosition[] = this.getSurroundingPositions(currentNode.position)
    for (const pos of temp) {
      const key: string = pos.x + '-' + pos.y
      if (queue[key] !== undefined) {
        returnNode.push(queue[key])
      }
    }
    return returnNode
  }

  private popNodeWithLowestDistance(prev: { [k: string]: number }, queue: { [k: string]: Node }): string {
    let temp: string = ''
    for (const key in queue) {
      if (!temp.length) {
        temp = key
      } else {
        if (prev[key] < prev[temp]) {
          temp = key
        }
      }
    }
    return temp
  }

  private isEmpty(obj: Object) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        return false;
      }
    }
    return true;
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
