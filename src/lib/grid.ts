import { TerrainSymbol as MS } from '@/models/TerrainSymbol'
import { EntityType } from '@/models/EntityType'
import { EntityInstance } from '@/models/EntityInstance'
import { Level } from '@/models/Level'

const Grid: Level = {
  terrain: [
    [MS.WATER, MS.WATER, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
    [MS.WATER, MS.WATER, MS.WATER, MS.WATER, MS.EMPTY, MS.WATER, MS.WATER, MS.EMPTY],
    [MS.EMPTY, MS.EMPTY, MS.WATER, MS.WATER, MS.EMPTY, MS.WATER, MS.WATER, MS.WATER],
    [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.WATER, MS.WATER],
    [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.ROCK],
    [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
    [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
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
        position: { x: 2, y: 4, z: 1 },
        span: { x: 1, y: 1, z: 1 },
        name: EntityInstance.CRATE,
        description: 'Its a crate',
        blocks: true
      },
      {
        type: EntityType.INTERACTIVE_PROP,
        position: { x: 3, y: 3, z: 1 },
        span: { x: 1, y: 1, z: 1 },
        name: EntityInstance.ROCK,
        description: 'Its a crate',
        blocks: true
      }
    ]
}

export default Grid
