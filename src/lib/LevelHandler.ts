import { TerrainSymbol as MS, TerrainSymbol } from '@/models/TerrainSymbol'
import { EntityType } from '@/models/Entity/EntityType'
import { Entity } from '@/models/Entity/Entity';
import { Level } from '@/models/Level'
import { MortalState } from '@/models/MortalState';
import { GridPosition } from '@/models/GridPosition';
import { EntityInterface } from '@/models/Entity/EntityInterface';

const EmptyLevel: string = `{
  "terrain": [],
  "entities": []
}`

export class LevelHandler {
  public reloadingSave = false
  private LevelMomento: string
  private player: Entity
  private entities: Entity[] = []
  private CurrentLevel: Level = JSON.parse(EmptyLevel) as Level
  private BlockingTerrainLib: TerrainSymbol[] = [TerrainSymbol.ROCK]
  private range: number = 2

  constructor() {
    this.LevelMomento = EmptyLevel
    this.loadLevel({
      terrain: [
        [MS.WATER, MS.WATER, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.WATER, MS.WATER, MS.WATER, MS.WATER, MS.GRASS, MS.WATER, MS.WATER, MS.GRASS, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.WATER, MS.WATER, MS.GRASS, MS.WATER, MS.WATER, MS.WATER, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.ROCK, MS.GRASS, MS.WATER, MS.WATER, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.ROCK, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.ROCK, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.WATER, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.WATER, MS.WATER, MS.GRASS, MS.WATER, MS.WATER, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.WATER, MS.WATER, MS.WATER, MS.WATER, MS.WATER, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.WATER, MS.WATER, MS.GRASS, MS.GRASS, MS.GRASS, MS.WATER, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS],
        [MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS, MS.GRASS]
      ], entities:
        [
          {
            type: EntityType.INTERACTIVE_PROP,
            mortalState: MortalState.INANIMATE,
            health: 1,
            invincible: true,
            position: { x: 4, y: 5, z: 1 },
            span: { x: 1, y: 1, z: 1 },
            spriteName: 'crate1',
            description: 'It are a crate',
            blocks: true
          },
          {
            type: EntityType.INTERACTIVE_PROP,
            mortalState: MortalState.INANIMATE,
            health: 1,
            invincible: true,
            position: { x: 5, y: 5, z: 1 },
            span: { x: 1, y: 1, z: 1 },
            spriteName: 'crate1',
            description: 'It are a crate',
            blocks: true
          },
          {
            type: EntityType.NPC,
            mortalState: MortalState.ALIVE,
            health: 12,
            position: { x: 5, y: 6, z: 1 },
            span: { x: 1, y: 1, z: 1 },
            spriteName: 'bandit',
            description: 'It is a bandit',
            blocks: true
          }
        ]
    })

    this.player = new Entity({
      type: EntityType.PLAYER,
      position: { x: 3, y: 5, z: 1 },
      mortalState: MortalState.ALIVE,
      health: 10,
      span: { x: 1, y: 1, z: 1 },
      spriteName: 'player',
      description: 'Don\'t look at his uni-brow',
      blocks: true
    }, 0)


    let t: EntityType
    const entityIds: any = {}

    this.entities.push(this.player)
    this.CurrentLevel.entities.forEach((ent) => {
      t = ent.type
      if (entityIds[t] !== undefined) {
        entityIds[t]++
      } else {
        entityIds[t] = 0
      }
      this.entities.push(new Entity(ent, entityIds[t]))
    })
    this.saveLevel()
  }

  public saveLevel() {
    const temp: any = {}
    this.entities.forEach((ent) => temp[ent.type() + ent.getId()] = ent.getFields())
    this.LevelMomento = JSON.stringify(temp)
  }

  public setRange(range: number) {
    this.range = range
  }

  public getTerrain(): TerrainSymbol[][] {
    return this.CurrentLevel.terrain
  }

  public getTerrainBlock(col: number, row: number): TerrainSymbol {
    return this.CurrentLevel.terrain[row][col]
  }

  public getAllNPC(): EntityInterface[] {
    return this.CurrentLevel.entities.filter((entity: EntityInterface) => entity.type === EntityType.NPC)
  }

  public getPlayer(): Entity {
    return this.player
  }

  public getEntityAtPosition(x: number, y: number) {
    return this.getAllEntities().find((ent: Entity) => {
      const pos = ent.getPosition()
      return pos.x === x && pos.y === y
    })
  }

  public getEntityAtIndex(i: number) {
    return this.entities[i]
  }

  public isInObserveRange(gridX: number, gridY: number): boolean {
    const p = this.player.getPosition()
    const minX = p.x - this.range
    const minY = p.y - this.range

    const maxX = p.x + this.range
    const maxY = p.y + this.range

    if (
      gridX >= minX &&
      gridY >= minY &&
      (gridX >= minX && gridY <= maxY) &&
      (gridX <= maxX && gridY >= minY)
    ) {
      return true
    }

    return false
  }

  public isBlocked(col: number, row: number): boolean {
    let blockingEntity = false
    const entity = this.getEntityAtPosition(col, row) as Entity
    if (entity && entity.isBlocker()) {
      blockingEntity = true
    }

    return this.BlockingTerrainLib.includes(this.getTerrainBlock(col, row)) || blockingEntity
  }

  public isOutOfBounds(col: number, row: number) {
    if (col >= this.GridSize.x || col < 0) {
      return true
    }
    if (row >= this.GridSize.y || row < 0) {
      return true
    }
    return false
  }

  public get GridSize(): GridPosition {
    return {
      x: this.getTerrain()[0].length,
      y: this.getTerrain().length,
      z: 1
    }
  }

  public getAllEntities(): Entity[] {
    return this.entities
  }

  public updateEntityPosition(entity: Entity, x: number, y: number) {
    entity.setPosition(x, y)
  }

  public reloadSave() {
    const entMomento = JSON.parse(this.LevelMomento) as any
    this.entities.forEach(
      (ent) => { ent.setFields(entMomento[ent.type() + ent.getId()] as EntityInterface) }
    )
    this.reloadingSave = true
  }

  public loadLevel(level: Level) {
    this.CurrentLevel = level
  }
}
