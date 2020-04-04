import { Entity } from '../Entity/Entity';
import { LevelHandler } from '@/lib/LevelHandler';
import { GridPosition } from '../GridPosition';
import { Direction } from '../Direction';
import { EntityType } from '../Entity/EntityType';

export class Observer {
  private level: LevelHandler

  constructor(level: LevelHandler, observers: Entity[]) {
    this.level = level
  }

  public observe(ent: Entity): Entity[] {
    const linePos: GridPosition = JSON.parse(JSON.stringify(ent.getPosition()))
    const observerEntities: Entity[] = []
    const range: number = this.getRange(ent)
    const facing: Direction = this.getDirection(ent)
    let cone: number = 2

    this.incrementPosition(linePos, facing)
    for (let index = 0; index < range; index++) {
      for (let coneIndex = 0; coneIndex < cone; coneIndex++) {
        const tempPos: GridPosition = this.getCone(linePos, facing, coneIndex, cone)
        const temp: Entity | undefined = this.level.getEntityAtPosition(tempPos.x, tempPos.y)
        if (temp && temp.type() === EntityType.PLAYER) {
          observerEntities.push(temp)
        }
      }
      cone += 2
      this.incrementPosition(linePos, facing)
    }

    return observerEntities
  }

  private getRange(ent: Entity): number {
    const range = ent.getFields().viewRange
    return range !== undefined ? range : 3
  }

  private getDirection(ent: Entity): Direction {
    const direction = ent.getFields().direction
    return direction !== undefined ? direction : Direction.SOUTH
  }

  private getCone(pos: GridPosition, facing: Direction, itteration: number, max: number): GridPosition {
    if (facing === Direction.NORTH || facing === Direction.SOUTH) {
      return { x: (pos.x + Math.ceil(max / 2)) - (max - itteration), y: pos.y }
    } else {
      return { x: pos.x, y: (pos.y + Math.ceil(max / 2)) - (max - itteration) }
    }
  }

  private incrementPosition(pos: GridPosition, facing: Direction) {
    switch (facing) {
      case Direction.NORTH:
        pos.y--
        break;
      case Direction.SOUTH:
        pos.y++
        break;
      case Direction.WEST:
        pos.x--
        break;
      default:
        pos.x++
        break;
    }
  }
}
