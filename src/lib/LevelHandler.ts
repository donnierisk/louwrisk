import { TerrainSymbol as MS, TerrainSymbol } from '@/models/TerrainSymbol'
import { EntityType } from '@/models/EntityType'
import { EntityInstance } from '@/models/EntityInstance'
import { Entity } from '@/models/Entity';
import { Level } from '@/models/Level'
import { MortalState } from '@/models/MortalState';
import { GridPosition } from '@/models/GridPosition';

const EmptyLevel: string = `{
  "terrain": [],
  "entities": []
}`

export class LevelHandler {
  public reloadingSave = false
  private MomentoLevel: string
  private CurrentLevel: Level = JSON.parse(EmptyLevel) as Level
  private BlockingTerrainLib: TerrainSymbol[] = [TerrainSymbol.ROCK]
  private range: number = 2

  constructor() {
    this.MomentoLevel = EmptyLevel
    this.LoadLevel({
      terrain: [
        [MS.WATER, MS.WATER, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.WATER, MS.WATER, MS.WATER, MS.WATER, MS.EMPTY, MS.WATER, MS.WATER, MS.EMPTY],
        [MS.EMPTY, MS.EMPTY, MS.WATER, MS.WATER, MS.EMPTY, MS.WATER, MS.WATER, MS.WATER],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.ROCK, MS.EMPTY, MS.WATER, MS.WATER],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.ROCK],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.EMPTY, MS.EMPTY, MS.ROCK, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.WATER, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.WATER, MS.WATER, MS.EMPTY, MS.WATER, MS.WATER, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.WATER, MS.WATER, MS.WATER, MS.WATER, MS.WATER, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.EMPTY, MS.EMPTY, MS.WATER, MS.WATER, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.WATER],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
        [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY]
      ], entities:
        [
          {
            type: EntityType.PLAYER,
            position: { x: 3, y: 5, z: 1 },
            mortalState: MortalState.ALIVE,
            health: 10,
            span: { x: 1, y: 1, z: 1 },
            name: 'Gale',
            description: 'Don\'t look at his uni-brow',
            blocks: false
          },
          {
            type: EntityType.INTERACTIVE_PROP,
            mortalState: MortalState.INANIMATE,
            health: 1,
            invincible: true,
            position: { x: 4, y: 5, z: 1 },
            span: { x: 1, y: 1, z: 1 },
            name: 'crate1',
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
            name: 'crate1',
            description: 'It are a crate',
            blocks: true
          },
          {
            type: EntityType.NPC,
            mortalState: MortalState.ALIVE,
            health: 12,
            position: { x: 5, y: 6, z: 1 },
            span: { x: 1, y: 1, z: 1 },
            name: 'bandit',
            description: 'It is a bandit',
            blocks: true
          }
        ]
    })
    this.SaveLevel()
  }

  public SaveLevel() {
    this.MomentoLevel = JSON.stringify(this.CurrentLevel)
  }

  public SetRange(range: number) {
    this.range = range
  }

  public GetTerrain(): TerrainSymbol[][] {
    return this.CurrentLevel.terrain
  }

  public GetTerrainBlock(col: number, row: number): TerrainSymbol {
    return this.CurrentLevel.terrain[row][col]
  }

  public GetAllNPC(): Entity[] {
    return this.CurrentLevel.entities.filter((entity: Entity) => entity.type === EntityType.NPC)
  }

  public GetPlayer(): Entity {
    return this.CurrentLevel.entities.filter((entity: Entity) => entity.type === EntityType.PLAYER)[0]
  }

  public GetEntity(x: number, y: number) {
    return this.GetAllEntities().find((ent: Entity) => {
      return ent.position.x === x && ent.position.y === y
    })
  }

  public IsInObserveRange(gridX: number, gridY: number): boolean {
    const minX = this.GetPlayer().position.x - this.range
    const minY = this.GetPlayer().position.y - this.range

    const maxX = this.GetPlayer().position.x + this.range
    const maxY = this.GetPlayer().position.y + this.range

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

  public IsBlocked(col: number, row: number): boolean {
    let blockingEntity = false
    const entity = this.GetEntity(col, row) as Entity
    if (entity && entity.blocks) {
      blockingEntity = true
    }

    return this.BlockingTerrainLib.includes(this.GetTerrainBlock(col, row)) || blockingEntity
  }

  public IsOutOfBounds(col: number, row: number) {
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
      x: this.GetTerrain()[0].length,
      y: this.GetTerrain().length,
      z: 1
    }
  }

  public GetAllEntities(): Entity[] {
    return this.CurrentLevel.entities
  }

  public UpdatePlayerPosition(x: number, y: number) {
    const tempPlayer = this.CurrentLevel.entities.filter((entity: Entity) => entity.type === EntityType.PLAYER)[0]
    tempPlayer.position.x = x
    tempPlayer.position.y = y
  }

  public ReloadSave() {
    this.reloadingSave = true
    this.CurrentLevel = JSON.parse(this.MomentoLevel)
  }

  public LoadLevel(level: Level) {
    this.CurrentLevel = level
  }
}
