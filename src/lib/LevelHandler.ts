import { TerrainSymbol as MS, TerrainSymbol } from '@/models/TerrainSymbol'
import { EntityType } from '@/models/EntityType'
import { EntityInstance } from '@/models/EntityInstance'
import { Entity } from '@/models/Entity';
import { Level } from '@/models/Level'
import { MortalState } from '@/models/MortalState';

export class LevelHandler {
  private MomentoLevel?: Level
  private CurrentLevel: Level = {
    terrain: [],
    entities: []
  }

  constructor() {
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
    this.MomentoLevel = JSON.parse(JSON.stringify(this.CurrentLevel))
  }

  public GetTerrain(): TerrainSymbol[][] {
    return this.CurrentLevel.terrain
  }

  public GetAllNPC(): Entity[] {
    return this.CurrentLevel.entities.filter((entity: Entity) => entity.type === EntityType.NPC)
  }

  public GetPlayer(): Entity {
    return this.CurrentLevel.entities.filter((entity: Entity) => entity.type === EntityType.PLAYER)[0]
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
    this.CurrentLevel = JSON.parse(JSON.stringify(this.MomentoLevel))
  }

  public LoadLevel(level: Level) {
    this.CurrentLevel = level
  }
}
