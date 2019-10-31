import { TerrainSymbol as MS } from '@/models/TerrainSymbol'

const Grid = {
  terrain: [
    [MS.WATER, MS.WATER, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
    [MS.WATER, MS.WATER, MS.WATER, MS.WATER, MS.EMPTY, MS.WATER, MS.WATER, MS.EMPTY],
    [MS.EMPTY, MS.EMPTY, MS.WATER, MS.WATER, MS.EMPTY, MS.WATER, MS.WATER, MS.WATER],
    [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.WATER, MS.WATER],
    [MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY, MS.EMPTY],
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
  ],
  entities:
    [
      playerPos: { x: 3, y: 5, z: 1 }
      cratePos: { x: 2, y: 4, z: 1 }
    ]
}

export default Grid
