import { GridBlockI } from '../models/GridBlockI'
import { EntityType } from '@/models/EntityTypes'
import { TerrainSymbol } from '@/models/TerrainSymbol'
import DialogOption from '@/models/DialogOption'

export class Observer {
  private observedEntities: GridBlockI = { symbol: TerrainSymbol.EMPTY, id: 0 }
  private text: string[] = []
  public addToObserver(grid: GridBlockI) {
    if (grid.symbol === TerrainSymbol.WATER) {
      this.text.push(`There is water ${grid.id}`)
    } else {
      this.text.push(`There is nothing`)
    }
    this.observedEntities = grid
  }

  public getText() {
    return this.text
  }

  public getObservedEntities(): GridBlockI {
    return this.observedEntities;
  }

  public hasObservedEntities() {
    return this.observedEntities.symbol !== TerrainSymbol.EMPTY
  }
}
