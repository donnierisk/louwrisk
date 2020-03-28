import { Entity } from '../Entity/Entity';
import { LevelHandler } from '@/lib/LevelHandler';
import { GridPosition } from '../GridPosition';
import { EntityType } from '../Entity/EntityType';
import { Direction } from '../Direction';

export class Observer {
  private level: LevelHandler
  private observers: Entity[]

  constructor(level: LevelHandler, observers: Entity[]) {
    this.level = level
    this.observers = observers
  }

  public getObserved(id: number): Entity {
    return this.observers[id]
  }

  public observe(ent: Entity, id: number, facing: Direction): Entity | undefined {
    const tempPos: GridPosition = JSON.parse(JSON.stringify(ent.getPosition()))
    this.incrementPosition(tempPos, facing)
    let temp: Entity | undefined
    for (let index = 0; index < 4; index++) {
      temp = this.level.getEntityAtPosition(tempPos.x, tempPos.y)
      this.incrementPosition(tempPos, facing)
      if (temp && temp.getFields().type === EntityType.NPC) {
        index = 4
        this.observers[id] = temp
      }
    }
    return temp
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
