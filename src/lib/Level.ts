import { TerrainSymbol as MS } from '@/models/TerrainSymbol'
import { EntityType } from '@/models/EntityType'
import { EntityInstance } from '@/models/EntityInstance'
import { Level } from '@/models/Level'

const Level: Level = {
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
        span: { x: 1, y: 1, z: 1 },
        name: 'Gale',
        description: 'Don\'t look at his uni-brow',
        blocks: false
      },
      {
        type: EntityType.INTERACTIVE_PROP,
        position: { x: 4, y: 5, z: 1 },
        span: { x: 1, y: 1, z: 1 },
        name: 'crate1',
        description: 'It are a crate',
        blocks: true
      },
      {
        type: EntityType.INTERACTIVE_PROP,
        position: { x: 5, y: 5, z: 1 },
        span: { x: 1, y: 1, z: 1 },
        name: 'crate1',
        description: 'It are a crate',
        blocks: true
      },
      {
        type: EntityType.NPC,
        position: { x: 5, y: 6, z: 1 },
        span: { x: 1, y: 1, z: 1 },
        name: 'bandit',
        description: 'It is a bandit',
        blocks: true
      }
    ]
}

export default Level
