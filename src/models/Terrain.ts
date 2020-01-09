import { TerrainSymbol } from './TerrainSymbol';

export class Terrain {
  private terrainType: TerrainSymbol
  constructor(type: TerrainSymbol) {
    this.terrainType = type
  }

  public Type() {
    return this.terrainType
  }
}
